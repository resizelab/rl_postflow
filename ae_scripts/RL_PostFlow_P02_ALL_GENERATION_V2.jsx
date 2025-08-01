// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence P02_ALL avec 71 plans
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
        fileName175 = "UNDLM_00175.mov";
        importSuccess175 = true;
        editImportCount++;
        logImportSuccess(175, "EDIT", editFile175.fsName, fileName175);
    } catch (e) {
        logImportError(175, "EDIT", editFile175.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess175 && editFilePoignees175.exists) {
    try {
        var editFootage175 = project.importFile(new ImportOptions(editFilePoignees175));
        editFootage175.parentFolder = fromEditFolder;
        editFootage175.name = "UNDLM_00175";
        editSources[175] = editFootage175;
        fileName175 = "UNDLM_00175_AVEC_POIGNEES.mov";
        importSuccess175 = true;
        editImportCount++;
        logImportSuccess(175, "EDIT", editFilePoignees175.fsName, fileName175);
    } catch (e) {
        logImportError(175, "EDIT", editFilePoignees175.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess175 && editFileBis175.exists) {
    try {
        var editFootage175 = project.importFile(new ImportOptions(editFileBis175));
        editFootage175.parentFolder = fromEditFolder;
        editFootage175.name = "UNDLM_00175";
        editSources[175] = editFootage175;
        fileName175 = "UNDLM_00175bis.mov";
        importSuccess175 = true;
        editImportCount++;
        logImportSuccess(175, "EDIT", editFileBis175.fsName, fileName175);
    } catch (e) {
        logImportError(175, "EDIT", editFileBis175.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess175) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00175.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00175.mov: " + editFile175.exists + "\n" +
          "• UNDLM_00175_AVEC_POIGNEES.mov: " + editFilePoignees175.exists + "\n" +
          "• UNDLM_00175bis.mov: " + editFileBis175.exists);
}

// Import plan EDIT 00176
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176.mov");
var editFilePoignees176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov");
var editFileBis176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176bis.mov");

var importSuccess176 = false;
var fileName176 = "";

// Tenter import standard
if (editFile176.exists) {
    try {
        var editFootage176 = project.importFile(new ImportOptions(editFile176));
        editFootage176.parentFolder = fromEditFolder;
        editFootage176.name = "UNDLM_00176";
        editSources[176] = editFootage176;
        fileName176 = "UNDLM_00176.mov";
        importSuccess176 = true;
        editImportCount++;
        logImportSuccess(176, "EDIT", editFile176.fsName, fileName176);
    } catch (e) {
        logImportError(176, "EDIT", editFile176.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess176 && editFilePoignees176.exists) {
    try {
        var editFootage176 = project.importFile(new ImportOptions(editFilePoignees176));
        editFootage176.parentFolder = fromEditFolder;
        editFootage176.name = "UNDLM_00176";
        editSources[176] = editFootage176;
        fileName176 = "UNDLM_00176_AVEC_POIGNEES.mov";
        importSuccess176 = true;
        editImportCount++;
        logImportSuccess(176, "EDIT", editFilePoignees176.fsName, fileName176);
    } catch (e) {
        logImportError(176, "EDIT", editFilePoignees176.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess176 && editFileBis176.exists) {
    try {
        var editFootage176 = project.importFile(new ImportOptions(editFileBis176));
        editFootage176.parentFolder = fromEditFolder;
        editFootage176.name = "UNDLM_00176";
        editSources[176] = editFootage176;
        fileName176 = "UNDLM_00176bis.mov";
        importSuccess176 = true;
        editImportCount++;
        logImportSuccess(176, "EDIT", editFileBis176.fsName, fileName176);
    } catch (e) {
        logImportError(176, "EDIT", editFileBis176.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess176) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00176.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00176.mov: " + editFile176.exists + "\n" +
          "• UNDLM_00176_AVEC_POIGNEES.mov: " + editFilePoignees176.exists + "\n" +
          "• UNDLM_00176bis.mov: " + editFileBis176.exists);
}

// Import plan EDIT 00177
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177.mov");
var editFilePoignees177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov");
var editFileBis177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177bis.mov");

var importSuccess177 = false;
var fileName177 = "";

// Tenter import standard
if (editFile177.exists) {
    try {
        var editFootage177 = project.importFile(new ImportOptions(editFile177));
        editFootage177.parentFolder = fromEditFolder;
        editFootage177.name = "UNDLM_00177";
        editSources[177] = editFootage177;
        fileName177 = "UNDLM_00177.mov";
        importSuccess177 = true;
        editImportCount++;
        logImportSuccess(177, "EDIT", editFile177.fsName, fileName177);
    } catch (e) {
        logImportError(177, "EDIT", editFile177.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess177 && editFilePoignees177.exists) {
    try {
        var editFootage177 = project.importFile(new ImportOptions(editFilePoignees177));
        editFootage177.parentFolder = fromEditFolder;
        editFootage177.name = "UNDLM_00177";
        editSources[177] = editFootage177;
        fileName177 = "UNDLM_00177_AVEC_POIGNEES.mov";
        importSuccess177 = true;
        editImportCount++;
        logImportSuccess(177, "EDIT", editFilePoignees177.fsName, fileName177);
    } catch (e) {
        logImportError(177, "EDIT", editFilePoignees177.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess177 && editFileBis177.exists) {
    try {
        var editFootage177 = project.importFile(new ImportOptions(editFileBis177));
        editFootage177.parentFolder = fromEditFolder;
        editFootage177.name = "UNDLM_00177";
        editSources[177] = editFootage177;
        fileName177 = "UNDLM_00177bis.mov";
        importSuccess177 = true;
        editImportCount++;
        logImportSuccess(177, "EDIT", editFileBis177.fsName, fileName177);
    } catch (e) {
        logImportError(177, "EDIT", editFileBis177.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess177) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00177.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00177.mov: " + editFile177.exists + "\n" +
          "• UNDLM_00177_AVEC_POIGNEES.mov: " + editFilePoignees177.exists + "\n" +
          "• UNDLM_00177bis.mov: " + editFileBis177.exists);
}

// Import plan EDIT 00193
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193.mov");
var editFilePoignees193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov");
var editFileBis193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00193bis.mov");

var importSuccess193 = false;
var fileName193 = "";

// Tenter import standard
if (editFile193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFile193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193";
        editSources[193] = editFootage193;
        fileName193 = "UNDLM_00193.mov";
        importSuccess193 = true;
        editImportCount++;
        logImportSuccess(193, "EDIT", editFile193.fsName, fileName193);
    } catch (e) {
        logImportError(193, "EDIT", editFile193.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess193 && editFilePoignees193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFilePoignees193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193";
        editSources[193] = editFootage193;
        fileName193 = "UNDLM_00193_AVEC_POIGNEES.mov";
        importSuccess193 = true;
        editImportCount++;
        logImportSuccess(193, "EDIT", editFilePoignees193.fsName, fileName193);
    } catch (e) {
        logImportError(193, "EDIT", editFilePoignees193.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess193 && editFileBis193.exists) {
    try {
        var editFootage193 = project.importFile(new ImportOptions(editFileBis193));
        editFootage193.parentFolder = fromEditFolder;
        editFootage193.name = "UNDLM_00193";
        editSources[193] = editFootage193;
        fileName193 = "UNDLM_00193bis.mov";
        importSuccess193 = true;
        editImportCount++;
        logImportSuccess(193, "EDIT", editFileBis193.fsName, fileName193);
    } catch (e) {
        logImportError(193, "EDIT", editFileBis193.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess193) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00193.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00193.mov: " + editFile193.exists + "\n" +
          "• UNDLM_00193_AVEC_POIGNEES.mov: " + editFilePoignees193.exists + "\n" +
          "• UNDLM_00193bis.mov: " + editFileBis193.exists);
}

// Import plan EDIT 00194
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194.mov");
var editFilePoignees194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov");
var editFileBis194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00194bis.mov");

var importSuccess194 = false;
var fileName194 = "";

// Tenter import standard
if (editFile194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFile194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194";
        editSources[194] = editFootage194;
        fileName194 = "UNDLM_00194.mov";
        importSuccess194 = true;
        editImportCount++;
        logImportSuccess(194, "EDIT", editFile194.fsName, fileName194);
    } catch (e) {
        logImportError(194, "EDIT", editFile194.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess194 && editFilePoignees194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFilePoignees194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194";
        editSources[194] = editFootage194;
        fileName194 = "UNDLM_00194_AVEC_POIGNEES.mov";
        importSuccess194 = true;
        editImportCount++;
        logImportSuccess(194, "EDIT", editFilePoignees194.fsName, fileName194);
    } catch (e) {
        logImportError(194, "EDIT", editFilePoignees194.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess194 && editFileBis194.exists) {
    try {
        var editFootage194 = project.importFile(new ImportOptions(editFileBis194));
        editFootage194.parentFolder = fromEditFolder;
        editFootage194.name = "UNDLM_00194";
        editSources[194] = editFootage194;
        fileName194 = "UNDLM_00194bis.mov";
        importSuccess194 = true;
        editImportCount++;
        logImportSuccess(194, "EDIT", editFileBis194.fsName, fileName194);
    } catch (e) {
        logImportError(194, "EDIT", editFileBis194.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess194) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00194.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00194.mov: " + editFile194.exists + "\n" +
          "• UNDLM_00194_AVEC_POIGNEES.mov: " + editFilePoignees194.exists + "\n" +
          "• UNDLM_00194bis.mov: " + editFileBis194.exists);
}

// Import plan EDIT 00195
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195.mov");
var editFilePoignees195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov");
var editFileBis195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00195bis.mov");

var importSuccess195 = false;
var fileName195 = "";

// Tenter import standard
if (editFile195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFile195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195";
        editSources[195] = editFootage195;
        fileName195 = "UNDLM_00195.mov";
        importSuccess195 = true;
        editImportCount++;
        logImportSuccess(195, "EDIT", editFile195.fsName, fileName195);
    } catch (e) {
        logImportError(195, "EDIT", editFile195.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess195 && editFilePoignees195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFilePoignees195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195";
        editSources[195] = editFootage195;
        fileName195 = "UNDLM_00195_AVEC_POIGNEES.mov";
        importSuccess195 = true;
        editImportCount++;
        logImportSuccess(195, "EDIT", editFilePoignees195.fsName, fileName195);
    } catch (e) {
        logImportError(195, "EDIT", editFilePoignees195.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess195 && editFileBis195.exists) {
    try {
        var editFootage195 = project.importFile(new ImportOptions(editFileBis195));
        editFootage195.parentFolder = fromEditFolder;
        editFootage195.name = "UNDLM_00195";
        editSources[195] = editFootage195;
        fileName195 = "UNDLM_00195bis.mov";
        importSuccess195 = true;
        editImportCount++;
        logImportSuccess(195, "EDIT", editFileBis195.fsName, fileName195);
    } catch (e) {
        logImportError(195, "EDIT", editFileBis195.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess195) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00195.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00195.mov: " + editFile195.exists + "\n" +
          "• UNDLM_00195_AVEC_POIGNEES.mov: " + editFilePoignees195.exists + "\n" +
          "• UNDLM_00195bis.mov: " + editFileBis195.exists);
}

// Import plan EDIT 00196
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196.mov");
var editFilePoignees196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov");
var editFileBis196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00196bis.mov");

var importSuccess196 = false;
var fileName196 = "";

// Tenter import standard
if (editFile196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFile196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196";
        editSources[196] = editFootage196;
        fileName196 = "UNDLM_00196.mov";
        importSuccess196 = true;
        editImportCount++;
        logImportSuccess(196, "EDIT", editFile196.fsName, fileName196);
    } catch (e) {
        logImportError(196, "EDIT", editFile196.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess196 && editFilePoignees196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFilePoignees196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196";
        editSources[196] = editFootage196;
        fileName196 = "UNDLM_00196_AVEC_POIGNEES.mov";
        importSuccess196 = true;
        editImportCount++;
        logImportSuccess(196, "EDIT", editFilePoignees196.fsName, fileName196);
    } catch (e) {
        logImportError(196, "EDIT", editFilePoignees196.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess196 && editFileBis196.exists) {
    try {
        var editFootage196 = project.importFile(new ImportOptions(editFileBis196));
        editFootage196.parentFolder = fromEditFolder;
        editFootage196.name = "UNDLM_00196";
        editSources[196] = editFootage196;
        fileName196 = "UNDLM_00196bis.mov";
        importSuccess196 = true;
        editImportCount++;
        logImportSuccess(196, "EDIT", editFileBis196.fsName, fileName196);
    } catch (e) {
        logImportError(196, "EDIT", editFileBis196.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess196) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00196.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00196.mov: " + editFile196.exists + "\n" +
          "• UNDLM_00196_AVEC_POIGNEES.mov: " + editFilePoignees196.exists + "\n" +
          "• UNDLM_00196bis.mov: " + editFileBis196.exists);
}

// Import plan EDIT 00197
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197.mov");
var editFilePoignees197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov");
var editFileBis197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00197bis.mov");

var importSuccess197 = false;
var fileName197 = "";

// Tenter import standard
if (editFile197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFile197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197";
        editSources[197] = editFootage197;
        fileName197 = "UNDLM_00197.mov";
        importSuccess197 = true;
        editImportCount++;
        logImportSuccess(197, "EDIT", editFile197.fsName, fileName197);
    } catch (e) {
        logImportError(197, "EDIT", editFile197.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess197 && editFilePoignees197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFilePoignees197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197";
        editSources[197] = editFootage197;
        fileName197 = "UNDLM_00197_AVEC_POIGNEES.mov";
        importSuccess197 = true;
        editImportCount++;
        logImportSuccess(197, "EDIT", editFilePoignees197.fsName, fileName197);
    } catch (e) {
        logImportError(197, "EDIT", editFilePoignees197.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess197 && editFileBis197.exists) {
    try {
        var editFootage197 = project.importFile(new ImportOptions(editFileBis197));
        editFootage197.parentFolder = fromEditFolder;
        editFootage197.name = "UNDLM_00197";
        editSources[197] = editFootage197;
        fileName197 = "UNDLM_00197bis.mov";
        importSuccess197 = true;
        editImportCount++;
        logImportSuccess(197, "EDIT", editFileBis197.fsName, fileName197);
    } catch (e) {
        logImportError(197, "EDIT", editFileBis197.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess197) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00197.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00197.mov: " + editFile197.exists + "\n" +
          "• UNDLM_00197_AVEC_POIGNEES.mov: " + editFilePoignees197.exists + "\n" +
          "• UNDLM_00197bis.mov: " + editFileBis197.exists);
}

// Import plan EDIT 00198
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198.mov");
var editFilePoignees198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov");
var editFileBis198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00198bis.mov");

var importSuccess198 = false;
var fileName198 = "";

// Tenter import standard
if (editFile198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFile198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198";
        editSources[198] = editFootage198;
        fileName198 = "UNDLM_00198.mov";
        importSuccess198 = true;
        editImportCount++;
        logImportSuccess(198, "EDIT", editFile198.fsName, fileName198);
    } catch (e) {
        logImportError(198, "EDIT", editFile198.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess198 && editFilePoignees198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFilePoignees198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198";
        editSources[198] = editFootage198;
        fileName198 = "UNDLM_00198_AVEC_POIGNEES.mov";
        importSuccess198 = true;
        editImportCount++;
        logImportSuccess(198, "EDIT", editFilePoignees198.fsName, fileName198);
    } catch (e) {
        logImportError(198, "EDIT", editFilePoignees198.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess198 && editFileBis198.exists) {
    try {
        var editFootage198 = project.importFile(new ImportOptions(editFileBis198));
        editFootage198.parentFolder = fromEditFolder;
        editFootage198.name = "UNDLM_00198";
        editSources[198] = editFootage198;
        fileName198 = "UNDLM_00198bis.mov";
        importSuccess198 = true;
        editImportCount++;
        logImportSuccess(198, "EDIT", editFileBis198.fsName, fileName198);
    } catch (e) {
        logImportError(198, "EDIT", editFileBis198.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess198) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00198.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00198.mov: " + editFile198.exists + "\n" +
          "• UNDLM_00198_AVEC_POIGNEES.mov: " + editFilePoignees198.exists + "\n" +
          "• UNDLM_00198bis.mov: " + editFileBis198.exists);
}

// Import plan EDIT 00199
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199.mov");
var editFilePoignees199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov");
var editFileBis199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00199bis.mov");

var importSuccess199 = false;
var fileName199 = "";

// Tenter import standard
if (editFile199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFile199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199";
        editSources[199] = editFootage199;
        fileName199 = "UNDLM_00199.mov";
        importSuccess199 = true;
        editImportCount++;
        logImportSuccess(199, "EDIT", editFile199.fsName, fileName199);
    } catch (e) {
        logImportError(199, "EDIT", editFile199.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess199 && editFilePoignees199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFilePoignees199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199";
        editSources[199] = editFootage199;
        fileName199 = "UNDLM_00199_AVEC_POIGNEES.mov";
        importSuccess199 = true;
        editImportCount++;
        logImportSuccess(199, "EDIT", editFilePoignees199.fsName, fileName199);
    } catch (e) {
        logImportError(199, "EDIT", editFilePoignees199.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess199 && editFileBis199.exists) {
    try {
        var editFootage199 = project.importFile(new ImportOptions(editFileBis199));
        editFootage199.parentFolder = fromEditFolder;
        editFootage199.name = "UNDLM_00199";
        editSources[199] = editFootage199;
        fileName199 = "UNDLM_00199bis.mov";
        importSuccess199 = true;
        editImportCount++;
        logImportSuccess(199, "EDIT", editFileBis199.fsName, fileName199);
    } catch (e) {
        logImportError(199, "EDIT", editFileBis199.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess199) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00199.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00199.mov: " + editFile199.exists + "\n" +
          "• UNDLM_00199_AVEC_POIGNEES.mov: " + editFilePoignees199.exists + "\n" +
          "• UNDLM_00199bis.mov: " + editFileBis199.exists);
}

// Import plan EDIT 00200
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200.mov");
var editFilePoignees200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov");
var editFileBis200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00200bis.mov");

var importSuccess200 = false;
var fileName200 = "";

// Tenter import standard
if (editFile200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFile200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200";
        editSources[200] = editFootage200;
        fileName200 = "UNDLM_00200.mov";
        importSuccess200 = true;
        editImportCount++;
        logImportSuccess(200, "EDIT", editFile200.fsName, fileName200);
    } catch (e) {
        logImportError(200, "EDIT", editFile200.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess200 && editFilePoignees200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFilePoignees200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200";
        editSources[200] = editFootage200;
        fileName200 = "UNDLM_00200_AVEC_POIGNEES.mov";
        importSuccess200 = true;
        editImportCount++;
        logImportSuccess(200, "EDIT", editFilePoignees200.fsName, fileName200);
    } catch (e) {
        logImportError(200, "EDIT", editFilePoignees200.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess200 && editFileBis200.exists) {
    try {
        var editFootage200 = project.importFile(new ImportOptions(editFileBis200));
        editFootage200.parentFolder = fromEditFolder;
        editFootage200.name = "UNDLM_00200";
        editSources[200] = editFootage200;
        fileName200 = "UNDLM_00200bis.mov";
        importSuccess200 = true;
        editImportCount++;
        logImportSuccess(200, "EDIT", editFileBis200.fsName, fileName200);
    } catch (e) {
        logImportError(200, "EDIT", editFileBis200.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess200) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00200.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00200.mov: " + editFile200.exists + "\n" +
          "• UNDLM_00200_AVEC_POIGNEES.mov: " + editFilePoignees200.exists + "\n" +
          "• UNDLM_00200bis.mov: " + editFileBis200.exists);
}

// Import plan EDIT 00201
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201.mov");
var editFilePoignees201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov");
var editFileBis201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00201bis.mov");

var importSuccess201 = false;
var fileName201 = "";

// Tenter import standard
if (editFile201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFile201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201";
        editSources[201] = editFootage201;
        fileName201 = "UNDLM_00201.mov";
        importSuccess201 = true;
        editImportCount++;
        logImportSuccess(201, "EDIT", editFile201.fsName, fileName201);
    } catch (e) {
        logImportError(201, "EDIT", editFile201.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess201 && editFilePoignees201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFilePoignees201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201";
        editSources[201] = editFootage201;
        fileName201 = "UNDLM_00201_AVEC_POIGNEES.mov";
        importSuccess201 = true;
        editImportCount++;
        logImportSuccess(201, "EDIT", editFilePoignees201.fsName, fileName201);
    } catch (e) {
        logImportError(201, "EDIT", editFilePoignees201.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess201 && editFileBis201.exists) {
    try {
        var editFootage201 = project.importFile(new ImportOptions(editFileBis201));
        editFootage201.parentFolder = fromEditFolder;
        editFootage201.name = "UNDLM_00201";
        editSources[201] = editFootage201;
        fileName201 = "UNDLM_00201bis.mov";
        importSuccess201 = true;
        editImportCount++;
        logImportSuccess(201, "EDIT", editFileBis201.fsName, fileName201);
    } catch (e) {
        logImportError(201, "EDIT", editFileBis201.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess201) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00201.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00201.mov: " + editFile201.exists + "\n" +
          "• UNDLM_00201_AVEC_POIGNEES.mov: " + editFilePoignees201.exists + "\n" +
          "• UNDLM_00201bis.mov: " + editFileBis201.exists);
}

// Import plan EDIT 00212
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212.mov");
var editFilePoignees212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov");
var editFileBis212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00212bis.mov");

var importSuccess212 = false;
var fileName212 = "";

// Tenter import standard
if (editFile212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFile212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212";
        editSources[212] = editFootage212;
        fileName212 = "UNDLM_00212.mov";
        importSuccess212 = true;
        editImportCount++;
        logImportSuccess(212, "EDIT", editFile212.fsName, fileName212);
    } catch (e) {
        logImportError(212, "EDIT", editFile212.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess212 && editFilePoignees212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFilePoignees212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212";
        editSources[212] = editFootage212;
        fileName212 = "UNDLM_00212_AVEC_POIGNEES.mov";
        importSuccess212 = true;
        editImportCount++;
        logImportSuccess(212, "EDIT", editFilePoignees212.fsName, fileName212);
    } catch (e) {
        logImportError(212, "EDIT", editFilePoignees212.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess212 && editFileBis212.exists) {
    try {
        var editFootage212 = project.importFile(new ImportOptions(editFileBis212));
        editFootage212.parentFolder = fromEditFolder;
        editFootage212.name = "UNDLM_00212";
        editSources[212] = editFootage212;
        fileName212 = "UNDLM_00212bis.mov";
        importSuccess212 = true;
        editImportCount++;
        logImportSuccess(212, "EDIT", editFileBis212.fsName, fileName212);
    } catch (e) {
        logImportError(212, "EDIT", editFileBis212.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess212) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00212.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00212.mov: " + editFile212.exists + "\n" +
          "• UNDLM_00212_AVEC_POIGNEES.mov: " + editFilePoignees212.exists + "\n" +
          "• UNDLM_00212bis.mov: " + editFileBis212.exists);
}

// Import plan EDIT 00213
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213.mov");
var editFilePoignees213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov");
var editFileBis213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00213bis.mov");

var importSuccess213 = false;
var fileName213 = "";

// Tenter import standard
if (editFile213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFile213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213";
        editSources[213] = editFootage213;
        fileName213 = "UNDLM_00213.mov";
        importSuccess213 = true;
        editImportCount++;
        logImportSuccess(213, "EDIT", editFile213.fsName, fileName213);
    } catch (e) {
        logImportError(213, "EDIT", editFile213.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess213 && editFilePoignees213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFilePoignees213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213";
        editSources[213] = editFootage213;
        fileName213 = "UNDLM_00213_AVEC_POIGNEES.mov";
        importSuccess213 = true;
        editImportCount++;
        logImportSuccess(213, "EDIT", editFilePoignees213.fsName, fileName213);
    } catch (e) {
        logImportError(213, "EDIT", editFilePoignees213.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess213 && editFileBis213.exists) {
    try {
        var editFootage213 = project.importFile(new ImportOptions(editFileBis213));
        editFootage213.parentFolder = fromEditFolder;
        editFootage213.name = "UNDLM_00213";
        editSources[213] = editFootage213;
        fileName213 = "UNDLM_00213bis.mov";
        importSuccess213 = true;
        editImportCount++;
        logImportSuccess(213, "EDIT", editFileBis213.fsName, fileName213);
    } catch (e) {
        logImportError(213, "EDIT", editFileBis213.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess213) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00213.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00213.mov: " + editFile213.exists + "\n" +
          "• UNDLM_00213_AVEC_POIGNEES.mov: " + editFilePoignees213.exists + "\n" +
          "• UNDLM_00213bis.mov: " + editFileBis213.exists);
}

// Import plan EDIT 00215
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215.mov");
var editFilePoignees215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov");
var editFileBis215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00215bis.mov");

var importSuccess215 = false;
var fileName215 = "";

// Tenter import standard
if (editFile215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFile215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215";
        editSources[215] = editFootage215;
        fileName215 = "UNDLM_00215.mov";
        importSuccess215 = true;
        editImportCount++;
        logImportSuccess(215, "EDIT", editFile215.fsName, fileName215);
    } catch (e) {
        logImportError(215, "EDIT", editFile215.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess215 && editFilePoignees215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFilePoignees215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215";
        editSources[215] = editFootage215;
        fileName215 = "UNDLM_00215_AVEC_POIGNEES.mov";
        importSuccess215 = true;
        editImportCount++;
        logImportSuccess(215, "EDIT", editFilePoignees215.fsName, fileName215);
    } catch (e) {
        logImportError(215, "EDIT", editFilePoignees215.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess215 && editFileBis215.exists) {
    try {
        var editFootage215 = project.importFile(new ImportOptions(editFileBis215));
        editFootage215.parentFolder = fromEditFolder;
        editFootage215.name = "UNDLM_00215";
        editSources[215] = editFootage215;
        fileName215 = "UNDLM_00215bis.mov";
        importSuccess215 = true;
        editImportCount++;
        logImportSuccess(215, "EDIT", editFileBis215.fsName, fileName215);
    } catch (e) {
        logImportError(215, "EDIT", editFileBis215.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess215) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00215.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00215.mov: " + editFile215.exists + "\n" +
          "• UNDLM_00215_AVEC_POIGNEES.mov: " + editFilePoignees215.exists + "\n" +
          "• UNDLM_00215bis.mov: " + editFileBis215.exists);
}

// Import plan EDIT 00216
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216.mov");
var editFilePoignees216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov");
var editFileBis216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00216bis.mov");

var importSuccess216 = false;
var fileName216 = "";

// Tenter import standard
if (editFile216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFile216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216";
        editSources[216] = editFootage216;
        fileName216 = "UNDLM_00216.mov";
        importSuccess216 = true;
        editImportCount++;
        logImportSuccess(216, "EDIT", editFile216.fsName, fileName216);
    } catch (e) {
        logImportError(216, "EDIT", editFile216.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess216 && editFilePoignees216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFilePoignees216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216";
        editSources[216] = editFootage216;
        fileName216 = "UNDLM_00216_AVEC_POIGNEES.mov";
        importSuccess216 = true;
        editImportCount++;
        logImportSuccess(216, "EDIT", editFilePoignees216.fsName, fileName216);
    } catch (e) {
        logImportError(216, "EDIT", editFilePoignees216.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess216 && editFileBis216.exists) {
    try {
        var editFootage216 = project.importFile(new ImportOptions(editFileBis216));
        editFootage216.parentFolder = fromEditFolder;
        editFootage216.name = "UNDLM_00216";
        editSources[216] = editFootage216;
        fileName216 = "UNDLM_00216bis.mov";
        importSuccess216 = true;
        editImportCount++;
        logImportSuccess(216, "EDIT", editFileBis216.fsName, fileName216);
    } catch (e) {
        logImportError(216, "EDIT", editFileBis216.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess216) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00216.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00216.mov: " + editFile216.exists + "\n" +
          "• UNDLM_00216_AVEC_POIGNEES.mov: " + editFilePoignees216.exists + "\n" +
          "• UNDLM_00216bis.mov: " + editFileBis216.exists);
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
        fileName251 = "UNDLM_00251.mov";
        importSuccess251 = true;
        editImportCount++;
        logImportSuccess(251, "EDIT", editFile251.fsName, fileName251);
    } catch (e) {
        logImportError(251, "EDIT", editFile251.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess251 && editFilePoignees251.exists) {
    try {
        var editFootage251 = project.importFile(new ImportOptions(editFilePoignees251));
        editFootage251.parentFolder = fromEditFolder;
        editFootage251.name = "UNDLM_00251";
        editSources[251] = editFootage251;
        fileName251 = "UNDLM_00251_AVEC_POIGNEES.mov";
        importSuccess251 = true;
        editImportCount++;
        logImportSuccess(251, "EDIT", editFilePoignees251.fsName, fileName251);
    } catch (e) {
        logImportError(251, "EDIT", editFilePoignees251.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess251 && editFileBis251.exists) {
    try {
        var editFootage251 = project.importFile(new ImportOptions(editFileBis251));
        editFootage251.parentFolder = fromEditFolder;
        editFootage251.name = "UNDLM_00251";
        editSources[251] = editFootage251;
        fileName251 = "UNDLM_00251bis.mov";
        importSuccess251 = true;
        editImportCount++;
        logImportSuccess(251, "EDIT", editFileBis251.fsName, fileName251);
    } catch (e) {
        logImportError(251, "EDIT", editFileBis251.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess251) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00251.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00251.mov: " + editFile251.exists + "\n" +
          "• UNDLM_00251_AVEC_POIGNEES.mov: " + editFilePoignees251.exists + "\n" +
          "• UNDLM_00251bis.mov: " + editFileBis251.exists);
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
        fileName252 = "UNDLM_00252.mov";
        importSuccess252 = true;
        editImportCount++;
        logImportSuccess(252, "EDIT", editFile252.fsName, fileName252);
    } catch (e) {
        logImportError(252, "EDIT", editFile252.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess252 && editFilePoignees252.exists) {
    try {
        var editFootage252 = project.importFile(new ImportOptions(editFilePoignees252));
        editFootage252.parentFolder = fromEditFolder;
        editFootage252.name = "UNDLM_00252";
        editSources[252] = editFootage252;
        fileName252 = "UNDLM_00252_AVEC_POIGNEES.mov";
        importSuccess252 = true;
        editImportCount++;
        logImportSuccess(252, "EDIT", editFilePoignees252.fsName, fileName252);
    } catch (e) {
        logImportError(252, "EDIT", editFilePoignees252.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess252 && editFileBis252.exists) {
    try {
        var editFootage252 = project.importFile(new ImportOptions(editFileBis252));
        editFootage252.parentFolder = fromEditFolder;
        editFootage252.name = "UNDLM_00252";
        editSources[252] = editFootage252;
        fileName252 = "UNDLM_00252bis.mov";
        importSuccess252 = true;
        editImportCount++;
        logImportSuccess(252, "EDIT", editFileBis252.fsName, fileName252);
    } catch (e) {
        logImportError(252, "EDIT", editFileBis252.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess252) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00252.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00252.mov: " + editFile252.exists + "\n" +
          "• UNDLM_00252_AVEC_POIGNEES.mov: " + editFilePoignees252.exists + "\n" +
          "• UNDLM_00252bis.mov: " + editFileBis252.exists);
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
        fileName254 = "UNDLM_00254.mov";
        importSuccess254 = true;
        editImportCount++;
        logImportSuccess(254, "EDIT", editFile254.fsName, fileName254);
    } catch (e) {
        logImportError(254, "EDIT", editFile254.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess254 && editFilePoignees254.exists) {
    try {
        var editFootage254 = project.importFile(new ImportOptions(editFilePoignees254));
        editFootage254.parentFolder = fromEditFolder;
        editFootage254.name = "UNDLM_00254";
        editSources[254] = editFootage254;
        fileName254 = "UNDLM_00254_AVEC_POIGNEES.mov";
        importSuccess254 = true;
        editImportCount++;
        logImportSuccess(254, "EDIT", editFilePoignees254.fsName, fileName254);
    } catch (e) {
        logImportError(254, "EDIT", editFilePoignees254.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess254 && editFileBis254.exists) {
    try {
        var editFootage254 = project.importFile(new ImportOptions(editFileBis254));
        editFootage254.parentFolder = fromEditFolder;
        editFootage254.name = "UNDLM_00254";
        editSources[254] = editFootage254;
        fileName254 = "UNDLM_00254bis.mov";
        importSuccess254 = true;
        editImportCount++;
        logImportSuccess(254, "EDIT", editFileBis254.fsName, fileName254);
    } catch (e) {
        logImportError(254, "EDIT", editFileBis254.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess254) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00254.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00254.mov: " + editFile254.exists + "\n" +
          "• UNDLM_00254_AVEC_POIGNEES.mov: " + editFilePoignees254.exists + "\n" +
          "• UNDLM_00254bis.mov: " + editFileBis254.exists);
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
        fileName255 = "UNDLM_00255.mov";
        importSuccess255 = true;
        editImportCount++;
        logImportSuccess(255, "EDIT", editFile255.fsName, fileName255);
    } catch (e) {
        logImportError(255, "EDIT", editFile255.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess255 && editFilePoignees255.exists) {
    try {
        var editFootage255 = project.importFile(new ImportOptions(editFilePoignees255));
        editFootage255.parentFolder = fromEditFolder;
        editFootage255.name = "UNDLM_00255";
        editSources[255] = editFootage255;
        fileName255 = "UNDLM_00255_AVEC_POIGNEES.mov";
        importSuccess255 = true;
        editImportCount++;
        logImportSuccess(255, "EDIT", editFilePoignees255.fsName, fileName255);
    } catch (e) {
        logImportError(255, "EDIT", editFilePoignees255.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess255 && editFileBis255.exists) {
    try {
        var editFootage255 = project.importFile(new ImportOptions(editFileBis255));
        editFootage255.parentFolder = fromEditFolder;
        editFootage255.name = "UNDLM_00255";
        editSources[255] = editFootage255;
        fileName255 = "UNDLM_00255bis.mov";
        importSuccess255 = true;
        editImportCount++;
        logImportSuccess(255, "EDIT", editFileBis255.fsName, fileName255);
    } catch (e) {
        logImportError(255, "EDIT", editFileBis255.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess255) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00255.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00255.mov: " + editFile255.exists + "\n" +
          "• UNDLM_00255_AVEC_POIGNEES.mov: " + editFilePoignees255.exists + "\n" +
          "• UNDLM_00255bis.mov: " + editFileBis255.exists);
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
        fileName256 = "UNDLM_00256.mov";
        importSuccess256 = true;
        editImportCount++;
        logImportSuccess(256, "EDIT", editFile256.fsName, fileName256);
    } catch (e) {
        logImportError(256, "EDIT", editFile256.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess256 && editFilePoignees256.exists) {
    try {
        var editFootage256 = project.importFile(new ImportOptions(editFilePoignees256));
        editFootage256.parentFolder = fromEditFolder;
        editFootage256.name = "UNDLM_00256";
        editSources[256] = editFootage256;
        fileName256 = "UNDLM_00256_AVEC_POIGNEES.mov";
        importSuccess256 = true;
        editImportCount++;
        logImportSuccess(256, "EDIT", editFilePoignees256.fsName, fileName256);
    } catch (e) {
        logImportError(256, "EDIT", editFilePoignees256.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess256 && editFileBis256.exists) {
    try {
        var editFootage256 = project.importFile(new ImportOptions(editFileBis256));
        editFootage256.parentFolder = fromEditFolder;
        editFootage256.name = "UNDLM_00256";
        editSources[256] = editFootage256;
        fileName256 = "UNDLM_00256bis.mov";
        importSuccess256 = true;
        editImportCount++;
        logImportSuccess(256, "EDIT", editFileBis256.fsName, fileName256);
    } catch (e) {
        logImportError(256, "EDIT", editFileBis256.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess256) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00256.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00256.mov: " + editFile256.exists + "\n" +
          "• UNDLM_00256_AVEC_POIGNEES.mov: " + editFilePoignees256.exists + "\n" +
          "• UNDLM_00256bis.mov: " + editFileBis256.exists);
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
        fileName262 = "UNDLM_00262.mov";
        importSuccess262 = true;
        editImportCount++;
        logImportSuccess(262, "EDIT", editFile262.fsName, fileName262);
    } catch (e) {
        logImportError(262, "EDIT", editFile262.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess262 && editFilePoignees262.exists) {
    try {
        var editFootage262 = project.importFile(new ImportOptions(editFilePoignees262));
        editFootage262.parentFolder = fromEditFolder;
        editFootage262.name = "UNDLM_00262";
        editSources[262] = editFootage262;
        fileName262 = "UNDLM_00262_AVEC_POIGNEES.mov";
        importSuccess262 = true;
        editImportCount++;
        logImportSuccess(262, "EDIT", editFilePoignees262.fsName, fileName262);
    } catch (e) {
        logImportError(262, "EDIT", editFilePoignees262.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess262 && editFileBis262.exists) {
    try {
        var editFootage262 = project.importFile(new ImportOptions(editFileBis262));
        editFootage262.parentFolder = fromEditFolder;
        editFootage262.name = "UNDLM_00262";
        editSources[262] = editFootage262;
        fileName262 = "UNDLM_00262bis.mov";
        importSuccess262 = true;
        editImportCount++;
        logImportSuccess(262, "EDIT", editFileBis262.fsName, fileName262);
    } catch (e) {
        logImportError(262, "EDIT", editFileBis262.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess262) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00262.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00262.mov: " + editFile262.exists + "\n" +
          "• UNDLM_00262_AVEC_POIGNEES.mov: " + editFilePoignees262.exists + "\n" +
          "• UNDLM_00262bis.mov: " + editFileBis262.exists);
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
        fileName263 = "UNDLM_00263.mov";
        importSuccess263 = true;
        editImportCount++;
        logImportSuccess(263, "EDIT", editFile263.fsName, fileName263);
    } catch (e) {
        logImportError(263, "EDIT", editFile263.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess263 && editFilePoignees263.exists) {
    try {
        var editFootage263 = project.importFile(new ImportOptions(editFilePoignees263));
        editFootage263.parentFolder = fromEditFolder;
        editFootage263.name = "UNDLM_00263";
        editSources[263] = editFootage263;
        fileName263 = "UNDLM_00263_AVEC_POIGNEES.mov";
        importSuccess263 = true;
        editImportCount++;
        logImportSuccess(263, "EDIT", editFilePoignees263.fsName, fileName263);
    } catch (e) {
        logImportError(263, "EDIT", editFilePoignees263.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess263 && editFileBis263.exists) {
    try {
        var editFootage263 = project.importFile(new ImportOptions(editFileBis263));
        editFootage263.parentFolder = fromEditFolder;
        editFootage263.name = "UNDLM_00263";
        editSources[263] = editFootage263;
        fileName263 = "UNDLM_00263bis.mov";
        importSuccess263 = true;
        editImportCount++;
        logImportSuccess(263, "EDIT", editFileBis263.fsName, fileName263);
    } catch (e) {
        logImportError(263, "EDIT", editFileBis263.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess263) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00263.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00263.mov: " + editFile263.exists + "\n" +
          "• UNDLM_00263_AVEC_POIGNEES.mov: " + editFilePoignees263.exists + "\n" +
          "• UNDLM_00263bis.mov: " + editFileBis263.exists);
}

// Import plan EDIT 00275
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275.mov");
var editFilePoignees275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov");
var editFileBis275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00275bis.mov");

var importSuccess275 = false;
var fileName275 = "";

// Tenter import standard
if (editFile275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFile275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275";
        editSources[275] = editFootage275;
        fileName275 = "UNDLM_00275.mov";
        importSuccess275 = true;
        editImportCount++;
        logImportSuccess(275, "EDIT", editFile275.fsName, fileName275);
    } catch (e) {
        logImportError(275, "EDIT", editFile275.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess275 && editFilePoignees275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFilePoignees275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275";
        editSources[275] = editFootage275;
        fileName275 = "UNDLM_00275_AVEC_POIGNEES.mov";
        importSuccess275 = true;
        editImportCount++;
        logImportSuccess(275, "EDIT", editFilePoignees275.fsName, fileName275);
    } catch (e) {
        logImportError(275, "EDIT", editFilePoignees275.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess275 && editFileBis275.exists) {
    try {
        var editFootage275 = project.importFile(new ImportOptions(editFileBis275));
        editFootage275.parentFolder = fromEditFolder;
        editFootage275.name = "UNDLM_00275";
        editSources[275] = editFootage275;
        fileName275 = "UNDLM_00275bis.mov";
        importSuccess275 = true;
        editImportCount++;
        logImportSuccess(275, "EDIT", editFileBis275.fsName, fileName275);
    } catch (e) {
        logImportError(275, "EDIT", editFileBis275.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess275) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00275.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00275.mov: " + editFile275.exists + "\n" +
          "• UNDLM_00275_AVEC_POIGNEES.mov: " + editFilePoignees275.exists + "\n" +
          "• UNDLM_00275bis.mov: " + editFileBis275.exists);
}

// Import plan EDIT 00276
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276.mov");
var editFilePoignees276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov");
var editFileBis276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00276bis.mov");

var importSuccess276 = false;
var fileName276 = "";

// Tenter import standard
if (editFile276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFile276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276";
        editSources[276] = editFootage276;
        fileName276 = "UNDLM_00276.mov";
        importSuccess276 = true;
        editImportCount++;
        logImportSuccess(276, "EDIT", editFile276.fsName, fileName276);
    } catch (e) {
        logImportError(276, "EDIT", editFile276.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess276 && editFilePoignees276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFilePoignees276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276";
        editSources[276] = editFootage276;
        fileName276 = "UNDLM_00276_AVEC_POIGNEES.mov";
        importSuccess276 = true;
        editImportCount++;
        logImportSuccess(276, "EDIT", editFilePoignees276.fsName, fileName276);
    } catch (e) {
        logImportError(276, "EDIT", editFilePoignees276.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess276 && editFileBis276.exists) {
    try {
        var editFootage276 = project.importFile(new ImportOptions(editFileBis276));
        editFootage276.parentFolder = fromEditFolder;
        editFootage276.name = "UNDLM_00276";
        editSources[276] = editFootage276;
        fileName276 = "UNDLM_00276bis.mov";
        importSuccess276 = true;
        editImportCount++;
        logImportSuccess(276, "EDIT", editFileBis276.fsName, fileName276);
    } catch (e) {
        logImportError(276, "EDIT", editFileBis276.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess276) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00276.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00276.mov: " + editFile276.exists + "\n" +
          "• UNDLM_00276_AVEC_POIGNEES.mov: " + editFilePoignees276.exists + "\n" +
          "• UNDLM_00276bis.mov: " + editFileBis276.exists);
}

// Import plan EDIT 00277
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277.mov");
var editFilePoignees277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov");
var editFileBis277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00277bis.mov");

var importSuccess277 = false;
var fileName277 = "";

// Tenter import standard
if (editFile277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFile277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277";
        editSources[277] = editFootage277;
        fileName277 = "UNDLM_00277.mov";
        importSuccess277 = true;
        editImportCount++;
        logImportSuccess(277, "EDIT", editFile277.fsName, fileName277);
    } catch (e) {
        logImportError(277, "EDIT", editFile277.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess277 && editFilePoignees277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFilePoignees277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277";
        editSources[277] = editFootage277;
        fileName277 = "UNDLM_00277_AVEC_POIGNEES.mov";
        importSuccess277 = true;
        editImportCount++;
        logImportSuccess(277, "EDIT", editFilePoignees277.fsName, fileName277);
    } catch (e) {
        logImportError(277, "EDIT", editFilePoignees277.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess277 && editFileBis277.exists) {
    try {
        var editFootage277 = project.importFile(new ImportOptions(editFileBis277));
        editFootage277.parentFolder = fromEditFolder;
        editFootage277.name = "UNDLM_00277";
        editSources[277] = editFootage277;
        fileName277 = "UNDLM_00277bis.mov";
        importSuccess277 = true;
        editImportCount++;
        logImportSuccess(277, "EDIT", editFileBis277.fsName, fileName277);
    } catch (e) {
        logImportError(277, "EDIT", editFileBis277.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess277) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00277.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00277.mov: " + editFile277.exists + "\n" +
          "• UNDLM_00277_AVEC_POIGNEES.mov: " + editFilePoignees277.exists + "\n" +
          "• UNDLM_00277bis.mov: " + editFileBis277.exists);
}

// Import plan EDIT 00279
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279.mov");
var editFilePoignees279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov");
var editFileBis279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00279bis.mov");

var importSuccess279 = false;
var fileName279 = "";

// Tenter import standard
if (editFile279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFile279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279";
        editSources[279] = editFootage279;
        fileName279 = "UNDLM_00279.mov";
        importSuccess279 = true;
        editImportCount++;
        logImportSuccess(279, "EDIT", editFile279.fsName, fileName279);
    } catch (e) {
        logImportError(279, "EDIT", editFile279.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess279 && editFilePoignees279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFilePoignees279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279";
        editSources[279] = editFootage279;
        fileName279 = "UNDLM_00279_AVEC_POIGNEES.mov";
        importSuccess279 = true;
        editImportCount++;
        logImportSuccess(279, "EDIT", editFilePoignees279.fsName, fileName279);
    } catch (e) {
        logImportError(279, "EDIT", editFilePoignees279.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess279 && editFileBis279.exists) {
    try {
        var editFootage279 = project.importFile(new ImportOptions(editFileBis279));
        editFootage279.parentFolder = fromEditFolder;
        editFootage279.name = "UNDLM_00279";
        editSources[279] = editFootage279;
        fileName279 = "UNDLM_00279bis.mov";
        importSuccess279 = true;
        editImportCount++;
        logImportSuccess(279, "EDIT", editFileBis279.fsName, fileName279);
    } catch (e) {
        logImportError(279, "EDIT", editFileBis279.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess279) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00279.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00279.mov: " + editFile279.exists + "\n" +
          "• UNDLM_00279_AVEC_POIGNEES.mov: " + editFilePoignees279.exists + "\n" +
          "• UNDLM_00279bis.mov: " + editFileBis279.exists);
}

// Import plan EDIT 00280
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280.mov");
var editFilePoignees280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov");
var editFileBis280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00280bis.mov");

var importSuccess280 = false;
var fileName280 = "";

// Tenter import standard
if (editFile280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFile280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280";
        editSources[280] = editFootage280;
        fileName280 = "UNDLM_00280.mov";
        importSuccess280 = true;
        editImportCount++;
        logImportSuccess(280, "EDIT", editFile280.fsName, fileName280);
    } catch (e) {
        logImportError(280, "EDIT", editFile280.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess280 && editFilePoignees280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFilePoignees280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280";
        editSources[280] = editFootage280;
        fileName280 = "UNDLM_00280_AVEC_POIGNEES.mov";
        importSuccess280 = true;
        editImportCount++;
        logImportSuccess(280, "EDIT", editFilePoignees280.fsName, fileName280);
    } catch (e) {
        logImportError(280, "EDIT", editFilePoignees280.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess280 && editFileBis280.exists) {
    try {
        var editFootage280 = project.importFile(new ImportOptions(editFileBis280));
        editFootage280.parentFolder = fromEditFolder;
        editFootage280.name = "UNDLM_00280";
        editSources[280] = editFootage280;
        fileName280 = "UNDLM_00280bis.mov";
        importSuccess280 = true;
        editImportCount++;
        logImportSuccess(280, "EDIT", editFileBis280.fsName, fileName280);
    } catch (e) {
        logImportError(280, "EDIT", editFileBis280.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess280) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00280.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00280.mov: " + editFile280.exists + "\n" +
          "• UNDLM_00280_AVEC_POIGNEES.mov: " + editFilePoignees280.exists + "\n" +
          "• UNDLM_00280bis.mov: " + editFileBis280.exists);
}

// Import plan EDIT 00282
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282.mov");
var editFilePoignees282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov");
var editFileBis282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00282bis.mov");

var importSuccess282 = false;
var fileName282 = "";

// Tenter import standard
if (editFile282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFile282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282";
        editSources[282] = editFootage282;
        fileName282 = "UNDLM_00282.mov";
        importSuccess282 = true;
        editImportCount++;
        logImportSuccess(282, "EDIT", editFile282.fsName, fileName282);
    } catch (e) {
        logImportError(282, "EDIT", editFile282.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess282 && editFilePoignees282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFilePoignees282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282";
        editSources[282] = editFootage282;
        fileName282 = "UNDLM_00282_AVEC_POIGNEES.mov";
        importSuccess282 = true;
        editImportCount++;
        logImportSuccess(282, "EDIT", editFilePoignees282.fsName, fileName282);
    } catch (e) {
        logImportError(282, "EDIT", editFilePoignees282.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess282 && editFileBis282.exists) {
    try {
        var editFootage282 = project.importFile(new ImportOptions(editFileBis282));
        editFootage282.parentFolder = fromEditFolder;
        editFootage282.name = "UNDLM_00282";
        editSources[282] = editFootage282;
        fileName282 = "UNDLM_00282bis.mov";
        importSuccess282 = true;
        editImportCount++;
        logImportSuccess(282, "EDIT", editFileBis282.fsName, fileName282);
    } catch (e) {
        logImportError(282, "EDIT", editFileBis282.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess282) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00282.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00282.mov: " + editFile282.exists + "\n" +
          "• UNDLM_00282_AVEC_POIGNEES.mov: " + editFilePoignees282.exists + "\n" +
          "• UNDLM_00282bis.mov: " + editFileBis282.exists);
}

// Import plan EDIT 00283
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283.mov");
var editFilePoignees283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov");
var editFileBis283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00283bis.mov");

var importSuccess283 = false;
var fileName283 = "";

// Tenter import standard
if (editFile283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFile283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283";
        editSources[283] = editFootage283;
        fileName283 = "UNDLM_00283.mov";
        importSuccess283 = true;
        editImportCount++;
        logImportSuccess(283, "EDIT", editFile283.fsName, fileName283);
    } catch (e) {
        logImportError(283, "EDIT", editFile283.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess283 && editFilePoignees283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFilePoignees283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283";
        editSources[283] = editFootage283;
        fileName283 = "UNDLM_00283_AVEC_POIGNEES.mov";
        importSuccess283 = true;
        editImportCount++;
        logImportSuccess(283, "EDIT", editFilePoignees283.fsName, fileName283);
    } catch (e) {
        logImportError(283, "EDIT", editFilePoignees283.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess283 && editFileBis283.exists) {
    try {
        var editFootage283 = project.importFile(new ImportOptions(editFileBis283));
        editFootage283.parentFolder = fromEditFolder;
        editFootage283.name = "UNDLM_00283";
        editSources[283] = editFootage283;
        fileName283 = "UNDLM_00283bis.mov";
        importSuccess283 = true;
        editImportCount++;
        logImportSuccess(283, "EDIT", editFileBis283.fsName, fileName283);
    } catch (e) {
        logImportError(283, "EDIT", editFileBis283.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess283) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00283.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00283.mov: " + editFile283.exists + "\n" +
          "• UNDLM_00283_AVEC_POIGNEES.mov: " + editFilePoignees283.exists + "\n" +
          "• UNDLM_00283bis.mov: " + editFileBis283.exists);
}

// Import plan EDIT 00285
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285.mov");
var editFilePoignees285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov");
var editFileBis285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00285bis.mov");

var importSuccess285 = false;
var fileName285 = "";

// Tenter import standard
if (editFile285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFile285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285";
        editSources[285] = editFootage285;
        fileName285 = "UNDLM_00285.mov";
        importSuccess285 = true;
        editImportCount++;
        logImportSuccess(285, "EDIT", editFile285.fsName, fileName285);
    } catch (e) {
        logImportError(285, "EDIT", editFile285.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess285 && editFilePoignees285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFilePoignees285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285";
        editSources[285] = editFootage285;
        fileName285 = "UNDLM_00285_AVEC_POIGNEES.mov";
        importSuccess285 = true;
        editImportCount++;
        logImportSuccess(285, "EDIT", editFilePoignees285.fsName, fileName285);
    } catch (e) {
        logImportError(285, "EDIT", editFilePoignees285.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess285 && editFileBis285.exists) {
    try {
        var editFootage285 = project.importFile(new ImportOptions(editFileBis285));
        editFootage285.parentFolder = fromEditFolder;
        editFootage285.name = "UNDLM_00285";
        editSources[285] = editFootage285;
        fileName285 = "UNDLM_00285bis.mov";
        importSuccess285 = true;
        editImportCount++;
        logImportSuccess(285, "EDIT", editFileBis285.fsName, fileName285);
    } catch (e) {
        logImportError(285, "EDIT", editFileBis285.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess285) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00285.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00285.mov: " + editFile285.exists + "\n" +
          "• UNDLM_00285_AVEC_POIGNEES.mov: " + editFilePoignees285.exists + "\n" +
          "• UNDLM_00285bis.mov: " + editFileBis285.exists);
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
        fileName311 = "UNDLM_00311.mov";
        importSuccess311 = true;
        editImportCount++;
        logImportSuccess(311, "EDIT", editFile311.fsName, fileName311);
    } catch (e) {
        logImportError(311, "EDIT", editFile311.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess311 && editFilePoignees311.exists) {
    try {
        var editFootage311 = project.importFile(new ImportOptions(editFilePoignees311));
        editFootage311.parentFolder = fromEditFolder;
        editFootage311.name = "UNDLM_00311";
        editSources[311] = editFootage311;
        fileName311 = "UNDLM_00311_AVEC_POIGNEES.mov";
        importSuccess311 = true;
        editImportCount++;
        logImportSuccess(311, "EDIT", editFilePoignees311.fsName, fileName311);
    } catch (e) {
        logImportError(311, "EDIT", editFilePoignees311.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess311 && editFileBis311.exists) {
    try {
        var editFootage311 = project.importFile(new ImportOptions(editFileBis311));
        editFootage311.parentFolder = fromEditFolder;
        editFootage311.name = "UNDLM_00311";
        editSources[311] = editFootage311;
        fileName311 = "UNDLM_00311bis.mov";
        importSuccess311 = true;
        editImportCount++;
        logImportSuccess(311, "EDIT", editFileBis311.fsName, fileName311);
    } catch (e) {
        logImportError(311, "EDIT", editFileBis311.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess311) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00311.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00311.mov: " + editFile311.exists + "\n" +
          "• UNDLM_00311_AVEC_POIGNEES.mov: " + editFilePoignees311.exists + "\n" +
          "• UNDLM_00311bis.mov: " + editFileBis311.exists);
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
        fileName312 = "UNDLM_00312.mov";
        importSuccess312 = true;
        editImportCount++;
        logImportSuccess(312, "EDIT", editFile312.fsName, fileName312);
    } catch (e) {
        logImportError(312, "EDIT", editFile312.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess312 && editFilePoignees312.exists) {
    try {
        var editFootage312 = project.importFile(new ImportOptions(editFilePoignees312));
        editFootage312.parentFolder = fromEditFolder;
        editFootage312.name = "UNDLM_00312";
        editSources[312] = editFootage312;
        fileName312 = "UNDLM_00312_AVEC_POIGNEES.mov";
        importSuccess312 = true;
        editImportCount++;
        logImportSuccess(312, "EDIT", editFilePoignees312.fsName, fileName312);
    } catch (e) {
        logImportError(312, "EDIT", editFilePoignees312.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess312 && editFileBis312.exists) {
    try {
        var editFootage312 = project.importFile(new ImportOptions(editFileBis312));
        editFootage312.parentFolder = fromEditFolder;
        editFootage312.name = "UNDLM_00312";
        editSources[312] = editFootage312;
        fileName312 = "UNDLM_00312bis.mov";
        importSuccess312 = true;
        editImportCount++;
        logImportSuccess(312, "EDIT", editFileBis312.fsName, fileName312);
    } catch (e) {
        logImportError(312, "EDIT", editFileBis312.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess312) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00312.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00312.mov: " + editFile312.exists + "\n" +
          "• UNDLM_00312_AVEC_POIGNEES.mov: " + editFilePoignees312.exists + "\n" +
          "• UNDLM_00312bis.mov: " + editFileBis312.exists);
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
        fileName313 = "UNDLM_00313.mov";
        importSuccess313 = true;
        editImportCount++;
        logImportSuccess(313, "EDIT", editFile313.fsName, fileName313);
    } catch (e) {
        logImportError(313, "EDIT", editFile313.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess313 && editFilePoignees313.exists) {
    try {
        var editFootage313 = project.importFile(new ImportOptions(editFilePoignees313));
        editFootage313.parentFolder = fromEditFolder;
        editFootage313.name = "UNDLM_00313";
        editSources[313] = editFootage313;
        fileName313 = "UNDLM_00313_AVEC_POIGNEES.mov";
        importSuccess313 = true;
        editImportCount++;
        logImportSuccess(313, "EDIT", editFilePoignees313.fsName, fileName313);
    } catch (e) {
        logImportError(313, "EDIT", editFilePoignees313.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess313 && editFileBis313.exists) {
    try {
        var editFootage313 = project.importFile(new ImportOptions(editFileBis313));
        editFootage313.parentFolder = fromEditFolder;
        editFootage313.name = "UNDLM_00313";
        editSources[313] = editFootage313;
        fileName313 = "UNDLM_00313bis.mov";
        importSuccess313 = true;
        editImportCount++;
        logImportSuccess(313, "EDIT", editFileBis313.fsName, fileName313);
    } catch (e) {
        logImportError(313, "EDIT", editFileBis313.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess313) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00313.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00313.mov: " + editFile313.exists + "\n" +
          "• UNDLM_00313_AVEC_POIGNEES.mov: " + editFilePoignees313.exists + "\n" +
          "• UNDLM_00313bis.mov: " + editFileBis313.exists);
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
        fileName314 = "UNDLM_00314.mov";
        importSuccess314 = true;
        editImportCount++;
        logImportSuccess(314, "EDIT", editFile314.fsName, fileName314);
    } catch (e) {
        logImportError(314, "EDIT", editFile314.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess314 && editFilePoignees314.exists) {
    try {
        var editFootage314 = project.importFile(new ImportOptions(editFilePoignees314));
        editFootage314.parentFolder = fromEditFolder;
        editFootage314.name = "UNDLM_00314";
        editSources[314] = editFootage314;
        fileName314 = "UNDLM_00314_AVEC_POIGNEES.mov";
        importSuccess314 = true;
        editImportCount++;
        logImportSuccess(314, "EDIT", editFilePoignees314.fsName, fileName314);
    } catch (e) {
        logImportError(314, "EDIT", editFilePoignees314.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess314 && editFileBis314.exists) {
    try {
        var editFootage314 = project.importFile(new ImportOptions(editFileBis314));
        editFootage314.parentFolder = fromEditFolder;
        editFootage314.name = "UNDLM_00314";
        editSources[314] = editFootage314;
        fileName314 = "UNDLM_00314bis.mov";
        importSuccess314 = true;
        editImportCount++;
        logImportSuccess(314, "EDIT", editFileBis314.fsName, fileName314);
    } catch (e) {
        logImportError(314, "EDIT", editFileBis314.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess314) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00314.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00314.mov: " + editFile314.exists + "\n" +
          "• UNDLM_00314_AVEC_POIGNEES.mov: " + editFilePoignees314.exists + "\n" +
          "• UNDLM_00314bis.mov: " + editFileBis314.exists);
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
        fileName315 = "UNDLM_00315.mov";
        importSuccess315 = true;
        editImportCount++;
        logImportSuccess(315, "EDIT", editFile315.fsName, fileName315);
    } catch (e) {
        logImportError(315, "EDIT", editFile315.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess315 && editFilePoignees315.exists) {
    try {
        var editFootage315 = project.importFile(new ImportOptions(editFilePoignees315));
        editFootage315.parentFolder = fromEditFolder;
        editFootage315.name = "UNDLM_00315";
        editSources[315] = editFootage315;
        fileName315 = "UNDLM_00315_AVEC_POIGNEES.mov";
        importSuccess315 = true;
        editImportCount++;
        logImportSuccess(315, "EDIT", editFilePoignees315.fsName, fileName315);
    } catch (e) {
        logImportError(315, "EDIT", editFilePoignees315.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess315 && editFileBis315.exists) {
    try {
        var editFootage315 = project.importFile(new ImportOptions(editFileBis315));
        editFootage315.parentFolder = fromEditFolder;
        editFootage315.name = "UNDLM_00315";
        editSources[315] = editFootage315;
        fileName315 = "UNDLM_00315bis.mov";
        importSuccess315 = true;
        editImportCount++;
        logImportSuccess(315, "EDIT", editFileBis315.fsName, fileName315);
    } catch (e) {
        logImportError(315, "EDIT", editFileBis315.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess315) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00315.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00315.mov: " + editFile315.exists + "\n" +
          "• UNDLM_00315_AVEC_POIGNEES.mov: " + editFilePoignees315.exists + "\n" +
          "• UNDLM_00315bis.mov: " + editFileBis315.exists);
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
        fileName316 = "UNDLM_00316.mov";
        importSuccess316 = true;
        editImportCount++;
        logImportSuccess(316, "EDIT", editFile316.fsName, fileName316);
    } catch (e) {
        logImportError(316, "EDIT", editFile316.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess316 && editFilePoignees316.exists) {
    try {
        var editFootage316 = project.importFile(new ImportOptions(editFilePoignees316));
        editFootage316.parentFolder = fromEditFolder;
        editFootage316.name = "UNDLM_00316";
        editSources[316] = editFootage316;
        fileName316 = "UNDLM_00316_AVEC_POIGNEES.mov";
        importSuccess316 = true;
        editImportCount++;
        logImportSuccess(316, "EDIT", editFilePoignees316.fsName, fileName316);
    } catch (e) {
        logImportError(316, "EDIT", editFilePoignees316.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess316 && editFileBis316.exists) {
    try {
        var editFootage316 = project.importFile(new ImportOptions(editFileBis316));
        editFootage316.parentFolder = fromEditFolder;
        editFootage316.name = "UNDLM_00316";
        editSources[316] = editFootage316;
        fileName316 = "UNDLM_00316bis.mov";
        importSuccess316 = true;
        editImportCount++;
        logImportSuccess(316, "EDIT", editFileBis316.fsName, fileName316);
    } catch (e) {
        logImportError(316, "EDIT", editFileBis316.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess316) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00316.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00316.mov: " + editFile316.exists + "\n" +
          "• UNDLM_00316_AVEC_POIGNEES.mov: " + editFilePoignees316.exists + "\n" +
          "• UNDLM_00316bis.mov: " + editFileBis316.exists);
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
        fileName317 = "UNDLM_00317.mov";
        importSuccess317 = true;
        editImportCount++;
        logImportSuccess(317, "EDIT", editFile317.fsName, fileName317);
    } catch (e) {
        logImportError(317, "EDIT", editFile317.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess317 && editFilePoignees317.exists) {
    try {
        var editFootage317 = project.importFile(new ImportOptions(editFilePoignees317));
        editFootage317.parentFolder = fromEditFolder;
        editFootage317.name = "UNDLM_00317";
        editSources[317] = editFootage317;
        fileName317 = "UNDLM_00317_AVEC_POIGNEES.mov";
        importSuccess317 = true;
        editImportCount++;
        logImportSuccess(317, "EDIT", editFilePoignees317.fsName, fileName317);
    } catch (e) {
        logImportError(317, "EDIT", editFilePoignees317.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess317 && editFileBis317.exists) {
    try {
        var editFootage317 = project.importFile(new ImportOptions(editFileBis317));
        editFootage317.parentFolder = fromEditFolder;
        editFootage317.name = "UNDLM_00317";
        editSources[317] = editFootage317;
        fileName317 = "UNDLM_00317bis.mov";
        importSuccess317 = true;
        editImportCount++;
        logImportSuccess(317, "EDIT", editFileBis317.fsName, fileName317);
    } catch (e) {
        logImportError(317, "EDIT", editFileBis317.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess317) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00317.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00317.mov: " + editFile317.exists + "\n" +
          "• UNDLM_00317_AVEC_POIGNEES.mov: " + editFilePoignees317.exists + "\n" +
          "• UNDLM_00317bis.mov: " + editFileBis317.exists);
}

// Import plan EDIT 00327
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327.mov");
var editFilePoignees327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov");
var editFileBis327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00327bis.mov");

var importSuccess327 = false;
var fileName327 = "";

// Tenter import standard
if (editFile327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFile327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327";
        editSources[327] = editFootage327;
        fileName327 = "UNDLM_00327.mov";
        importSuccess327 = true;
        editImportCount++;
        logImportSuccess(327, "EDIT", editFile327.fsName, fileName327);
    } catch (e) {
        logImportError(327, "EDIT", editFile327.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess327 && editFilePoignees327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFilePoignees327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327";
        editSources[327] = editFootage327;
        fileName327 = "UNDLM_00327_AVEC_POIGNEES.mov";
        importSuccess327 = true;
        editImportCount++;
        logImportSuccess(327, "EDIT", editFilePoignees327.fsName, fileName327);
    } catch (e) {
        logImportError(327, "EDIT", editFilePoignees327.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess327 && editFileBis327.exists) {
    try {
        var editFootage327 = project.importFile(new ImportOptions(editFileBis327));
        editFootage327.parentFolder = fromEditFolder;
        editFootage327.name = "UNDLM_00327";
        editSources[327] = editFootage327;
        fileName327 = "UNDLM_00327bis.mov";
        importSuccess327 = true;
        editImportCount++;
        logImportSuccess(327, "EDIT", editFileBis327.fsName, fileName327);
    } catch (e) {
        logImportError(327, "EDIT", editFileBis327.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess327) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00327.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00327.mov: " + editFile327.exists + "\n" +
          "• UNDLM_00327_AVEC_POIGNEES.mov: " + editFilePoignees327.exists + "\n" +
          "• UNDLM_00327bis.mov: " + editFileBis327.exists);
}

// Import plan EDIT 00328
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328.mov");
var editFilePoignees328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov");
var editFileBis328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00328bis.mov");

var importSuccess328 = false;
var fileName328 = "";

// Tenter import standard
if (editFile328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFile328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328";
        editSources[328] = editFootage328;
        fileName328 = "UNDLM_00328.mov";
        importSuccess328 = true;
        editImportCount++;
        logImportSuccess(328, "EDIT", editFile328.fsName, fileName328);
    } catch (e) {
        logImportError(328, "EDIT", editFile328.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess328 && editFilePoignees328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFilePoignees328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328";
        editSources[328] = editFootage328;
        fileName328 = "UNDLM_00328_AVEC_POIGNEES.mov";
        importSuccess328 = true;
        editImportCount++;
        logImportSuccess(328, "EDIT", editFilePoignees328.fsName, fileName328);
    } catch (e) {
        logImportError(328, "EDIT", editFilePoignees328.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess328 && editFileBis328.exists) {
    try {
        var editFootage328 = project.importFile(new ImportOptions(editFileBis328));
        editFootage328.parentFolder = fromEditFolder;
        editFootage328.name = "UNDLM_00328";
        editSources[328] = editFootage328;
        fileName328 = "UNDLM_00328bis.mov";
        importSuccess328 = true;
        editImportCount++;
        logImportSuccess(328, "EDIT", editFileBis328.fsName, fileName328);
    } catch (e) {
        logImportError(328, "EDIT", editFileBis328.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess328) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00328.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00328.mov: " + editFile328.exists + "\n" +
          "• UNDLM_00328_AVEC_POIGNEES.mov: " + editFilePoignees328.exists + "\n" +
          "• UNDLM_00328bis.mov: " + editFileBis328.exists);
}

// Import plan EDIT 00329
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329.mov");
var editFilePoignees329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov");
var editFileBis329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00329bis.mov");

var importSuccess329 = false;
var fileName329 = "";

// Tenter import standard
if (editFile329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFile329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329";
        editSources[329] = editFootage329;
        fileName329 = "UNDLM_00329.mov";
        importSuccess329 = true;
        editImportCount++;
        logImportSuccess(329, "EDIT", editFile329.fsName, fileName329);
    } catch (e) {
        logImportError(329, "EDIT", editFile329.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess329 && editFilePoignees329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFilePoignees329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329";
        editSources[329] = editFootage329;
        fileName329 = "UNDLM_00329_AVEC_POIGNEES.mov";
        importSuccess329 = true;
        editImportCount++;
        logImportSuccess(329, "EDIT", editFilePoignees329.fsName, fileName329);
    } catch (e) {
        logImportError(329, "EDIT", editFilePoignees329.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess329 && editFileBis329.exists) {
    try {
        var editFootage329 = project.importFile(new ImportOptions(editFileBis329));
        editFootage329.parentFolder = fromEditFolder;
        editFootage329.name = "UNDLM_00329";
        editSources[329] = editFootage329;
        fileName329 = "UNDLM_00329bis.mov";
        importSuccess329 = true;
        editImportCount++;
        logImportSuccess(329, "EDIT", editFileBis329.fsName, fileName329);
    } catch (e) {
        logImportError(329, "EDIT", editFileBis329.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess329) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00329.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00329.mov: " + editFile329.exists + "\n" +
          "• UNDLM_00329_AVEC_POIGNEES.mov: " + editFilePoignees329.exists + "\n" +
          "• UNDLM_00329bis.mov: " + editFileBis329.exists);
}

// Import plan EDIT 00330
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330.mov");
var editFilePoignees330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov");
var editFileBis330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00330bis.mov");

var importSuccess330 = false;
var fileName330 = "";

// Tenter import standard
if (editFile330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFile330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330";
        editSources[330] = editFootage330;
        fileName330 = "UNDLM_00330.mov";
        importSuccess330 = true;
        editImportCount++;
        logImportSuccess(330, "EDIT", editFile330.fsName, fileName330);
    } catch (e) {
        logImportError(330, "EDIT", editFile330.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess330 && editFilePoignees330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFilePoignees330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330";
        editSources[330] = editFootage330;
        fileName330 = "UNDLM_00330_AVEC_POIGNEES.mov";
        importSuccess330 = true;
        editImportCount++;
        logImportSuccess(330, "EDIT", editFilePoignees330.fsName, fileName330);
    } catch (e) {
        logImportError(330, "EDIT", editFilePoignees330.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess330 && editFileBis330.exists) {
    try {
        var editFootage330 = project.importFile(new ImportOptions(editFileBis330));
        editFootage330.parentFolder = fromEditFolder;
        editFootage330.name = "UNDLM_00330";
        editSources[330] = editFootage330;
        fileName330 = "UNDLM_00330bis.mov";
        importSuccess330 = true;
        editImportCount++;
        logImportSuccess(330, "EDIT", editFileBis330.fsName, fileName330);
    } catch (e) {
        logImportError(330, "EDIT", editFileBis330.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess330) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00330.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00330.mov: " + editFile330.exists + "\n" +
          "• UNDLM_00330_AVEC_POIGNEES.mov: " + editFilePoignees330.exists + "\n" +
          "• UNDLM_00330bis.mov: " + editFileBis330.exists);
}

// Import plan EDIT 00331
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331.mov");
var editFilePoignees331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov");
var editFileBis331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00331bis.mov");

var importSuccess331 = false;
var fileName331 = "";

// Tenter import standard
if (editFile331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFile331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331";
        editSources[331] = editFootage331;
        fileName331 = "UNDLM_00331.mov";
        importSuccess331 = true;
        editImportCount++;
        logImportSuccess(331, "EDIT", editFile331.fsName, fileName331);
    } catch (e) {
        logImportError(331, "EDIT", editFile331.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess331 && editFilePoignees331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFilePoignees331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331";
        editSources[331] = editFootage331;
        fileName331 = "UNDLM_00331_AVEC_POIGNEES.mov";
        importSuccess331 = true;
        editImportCount++;
        logImportSuccess(331, "EDIT", editFilePoignees331.fsName, fileName331);
    } catch (e) {
        logImportError(331, "EDIT", editFilePoignees331.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess331 && editFileBis331.exists) {
    try {
        var editFootage331 = project.importFile(new ImportOptions(editFileBis331));
        editFootage331.parentFolder = fromEditFolder;
        editFootage331.name = "UNDLM_00331";
        editSources[331] = editFootage331;
        fileName331 = "UNDLM_00331bis.mov";
        importSuccess331 = true;
        editImportCount++;
        logImportSuccess(331, "EDIT", editFileBis331.fsName, fileName331);
    } catch (e) {
        logImportError(331, "EDIT", editFileBis331.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess331) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00331.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00331.mov: " + editFile331.exists + "\n" +
          "• UNDLM_00331_AVEC_POIGNEES.mov: " + editFilePoignees331.exists + "\n" +
          "• UNDLM_00331bis.mov: " + editFileBis331.exists);
}

// Import plan EDIT 00384
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384.mov");
var editFilePoignees384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov");
var editFileBis384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00384bis.mov");

var importSuccess384 = false;
var fileName384 = "";

// Tenter import standard
if (editFile384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFile384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384";
        editSources[384] = editFootage384;
        fileName384 = "UNDLM_00384.mov";
        importSuccess384 = true;
        editImportCount++;
        logImportSuccess(384, "EDIT", editFile384.fsName, fileName384);
    } catch (e) {
        logImportError(384, "EDIT", editFile384.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess384 && editFilePoignees384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFilePoignees384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384";
        editSources[384] = editFootage384;
        fileName384 = "UNDLM_00384_AVEC_POIGNEES.mov";
        importSuccess384 = true;
        editImportCount++;
        logImportSuccess(384, "EDIT", editFilePoignees384.fsName, fileName384);
    } catch (e) {
        logImportError(384, "EDIT", editFilePoignees384.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess384 && editFileBis384.exists) {
    try {
        var editFootage384 = project.importFile(new ImportOptions(editFileBis384));
        editFootage384.parentFolder = fromEditFolder;
        editFootage384.name = "UNDLM_00384";
        editSources[384] = editFootage384;
        fileName384 = "UNDLM_00384bis.mov";
        importSuccess384 = true;
        editImportCount++;
        logImportSuccess(384, "EDIT", editFileBis384.fsName, fileName384);
    } catch (e) {
        logImportError(384, "EDIT", editFileBis384.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess384) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00384.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00384.mov: " + editFile384.exists + "\n" +
          "• UNDLM_00384_AVEC_POIGNEES.mov: " + editFilePoignees384.exists + "\n" +
          "• UNDLM_00384bis.mov: " + editFileBis384.exists);
}

// Import plan EDIT 00385
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385.mov");
var editFilePoignees385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov");
var editFileBis385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00385bis.mov");

var importSuccess385 = false;
var fileName385 = "";

// Tenter import standard
if (editFile385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFile385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385";
        editSources[385] = editFootage385;
        fileName385 = "UNDLM_00385.mov";
        importSuccess385 = true;
        editImportCount++;
        logImportSuccess(385, "EDIT", editFile385.fsName, fileName385);
    } catch (e) {
        logImportError(385, "EDIT", editFile385.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess385 && editFilePoignees385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFilePoignees385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385";
        editSources[385] = editFootage385;
        fileName385 = "UNDLM_00385_AVEC_POIGNEES.mov";
        importSuccess385 = true;
        editImportCount++;
        logImportSuccess(385, "EDIT", editFilePoignees385.fsName, fileName385);
    } catch (e) {
        logImportError(385, "EDIT", editFilePoignees385.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess385 && editFileBis385.exists) {
    try {
        var editFootage385 = project.importFile(new ImportOptions(editFileBis385));
        editFootage385.parentFolder = fromEditFolder;
        editFootage385.name = "UNDLM_00385";
        editSources[385] = editFootage385;
        fileName385 = "UNDLM_00385bis.mov";
        importSuccess385 = true;
        editImportCount++;
        logImportSuccess(385, "EDIT", editFileBis385.fsName, fileName385);
    } catch (e) {
        logImportError(385, "EDIT", editFileBis385.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess385) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00385.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00385.mov: " + editFile385.exists + "\n" +
          "• UNDLM_00385_AVEC_POIGNEES.mov: " + editFilePoignees385.exists + "\n" +
          "• UNDLM_00385bis.mov: " + editFileBis385.exists);
}

// Import plan EDIT 00386
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386.mov");
var editFilePoignees386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov");
var editFileBis386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00386bis.mov");

var importSuccess386 = false;
var fileName386 = "";

// Tenter import standard
if (editFile386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFile386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386";
        editSources[386] = editFootage386;
        fileName386 = "UNDLM_00386.mov";
        importSuccess386 = true;
        editImportCount++;
        logImportSuccess(386, "EDIT", editFile386.fsName, fileName386);
    } catch (e) {
        logImportError(386, "EDIT", editFile386.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess386 && editFilePoignees386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFilePoignees386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386";
        editSources[386] = editFootage386;
        fileName386 = "UNDLM_00386_AVEC_POIGNEES.mov";
        importSuccess386 = true;
        editImportCount++;
        logImportSuccess(386, "EDIT", editFilePoignees386.fsName, fileName386);
    } catch (e) {
        logImportError(386, "EDIT", editFilePoignees386.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess386 && editFileBis386.exists) {
    try {
        var editFootage386 = project.importFile(new ImportOptions(editFileBis386));
        editFootage386.parentFolder = fromEditFolder;
        editFootage386.name = "UNDLM_00386";
        editSources[386] = editFootage386;
        fileName386 = "UNDLM_00386bis.mov";
        importSuccess386 = true;
        editImportCount++;
        logImportSuccess(386, "EDIT", editFileBis386.fsName, fileName386);
    } catch (e) {
        logImportError(386, "EDIT", editFileBis386.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess386) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00386.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00386.mov: " + editFile386.exists + "\n" +
          "• UNDLM_00386_AVEC_POIGNEES.mov: " + editFilePoignees386.exists + "\n" +
          "• UNDLM_00386bis.mov: " + editFileBis386.exists);
}

// Import plan EDIT 00387
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387.mov");
var editFilePoignees387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov");
var editFileBis387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00387bis.mov");

var importSuccess387 = false;
var fileName387 = "";

// Tenter import standard
if (editFile387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFile387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387";
        editSources[387] = editFootage387;
        fileName387 = "UNDLM_00387.mov";
        importSuccess387 = true;
        editImportCount++;
        logImportSuccess(387, "EDIT", editFile387.fsName, fileName387);
    } catch (e) {
        logImportError(387, "EDIT", editFile387.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess387 && editFilePoignees387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFilePoignees387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387";
        editSources[387] = editFootage387;
        fileName387 = "UNDLM_00387_AVEC_POIGNEES.mov";
        importSuccess387 = true;
        editImportCount++;
        logImportSuccess(387, "EDIT", editFilePoignees387.fsName, fileName387);
    } catch (e) {
        logImportError(387, "EDIT", editFilePoignees387.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess387 && editFileBis387.exists) {
    try {
        var editFootage387 = project.importFile(new ImportOptions(editFileBis387));
        editFootage387.parentFolder = fromEditFolder;
        editFootage387.name = "UNDLM_00387";
        editSources[387] = editFootage387;
        fileName387 = "UNDLM_00387bis.mov";
        importSuccess387 = true;
        editImportCount++;
        logImportSuccess(387, "EDIT", editFileBis387.fsName, fileName387);
    } catch (e) {
        logImportError(387, "EDIT", editFileBis387.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess387) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00387.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00387.mov: " + editFile387.exists + "\n" +
          "• UNDLM_00387_AVEC_POIGNEES.mov: " + editFilePoignees387.exists + "\n" +
          "• UNDLM_00387bis.mov: " + editFileBis387.exists);
}

// Import plan EDIT 00391
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391.mov");
var editFilePoignees391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov");
var editFileBis391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00391bis.mov");

var importSuccess391 = false;
var fileName391 = "";

// Tenter import standard
if (editFile391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFile391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391";
        editSources[391] = editFootage391;
        fileName391 = "UNDLM_00391.mov";
        importSuccess391 = true;
        editImportCount++;
        logImportSuccess(391, "EDIT", editFile391.fsName, fileName391);
    } catch (e) {
        logImportError(391, "EDIT", editFile391.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess391 && editFilePoignees391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFilePoignees391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391";
        editSources[391] = editFootage391;
        fileName391 = "UNDLM_00391_AVEC_POIGNEES.mov";
        importSuccess391 = true;
        editImportCount++;
        logImportSuccess(391, "EDIT", editFilePoignees391.fsName, fileName391);
    } catch (e) {
        logImportError(391, "EDIT", editFilePoignees391.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess391 && editFileBis391.exists) {
    try {
        var editFootage391 = project.importFile(new ImportOptions(editFileBis391));
        editFootage391.parentFolder = fromEditFolder;
        editFootage391.name = "UNDLM_00391";
        editSources[391] = editFootage391;
        fileName391 = "UNDLM_00391bis.mov";
        importSuccess391 = true;
        editImportCount++;
        logImportSuccess(391, "EDIT", editFileBis391.fsName, fileName391);
    } catch (e) {
        logImportError(391, "EDIT", editFileBis391.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess391) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00391.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00391.mov: " + editFile391.exists + "\n" +
          "• UNDLM_00391_AVEC_POIGNEES.mov: " + editFilePoignees391.exists + "\n" +
          "• UNDLM_00391bis.mov: " + editFileBis391.exists);
}

// Import plan EDIT 00393
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393.mov");
var editFilePoignees393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov");
var editFileBis393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00393bis.mov");

var importSuccess393 = false;
var fileName393 = "";

// Tenter import standard
if (editFile393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFile393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393";
        editSources[393] = editFootage393;
        fileName393 = "UNDLM_00393.mov";
        importSuccess393 = true;
        editImportCount++;
        logImportSuccess(393, "EDIT", editFile393.fsName, fileName393);
    } catch (e) {
        logImportError(393, "EDIT", editFile393.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess393 && editFilePoignees393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFilePoignees393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393";
        editSources[393] = editFootage393;
        fileName393 = "UNDLM_00393_AVEC_POIGNEES.mov";
        importSuccess393 = true;
        editImportCount++;
        logImportSuccess(393, "EDIT", editFilePoignees393.fsName, fileName393);
    } catch (e) {
        logImportError(393, "EDIT", editFilePoignees393.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess393 && editFileBis393.exists) {
    try {
        var editFootage393 = project.importFile(new ImportOptions(editFileBis393));
        editFootage393.parentFolder = fromEditFolder;
        editFootage393.name = "UNDLM_00393";
        editSources[393] = editFootage393;
        fileName393 = "UNDLM_00393bis.mov";
        importSuccess393 = true;
        editImportCount++;
        logImportSuccess(393, "EDIT", editFileBis393.fsName, fileName393);
    } catch (e) {
        logImportError(393, "EDIT", editFileBis393.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess393) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00393.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00393.mov: " + editFile393.exists + "\n" +
          "• UNDLM_00393_AVEC_POIGNEES.mov: " + editFilePoignees393.exists + "\n" +
          "• UNDLM_00393bis.mov: " + editFileBis393.exists);
}

// Import plan EDIT 00394
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394.mov");
var editFilePoignees394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov");
var editFileBis394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00394bis.mov");

var importSuccess394 = false;
var fileName394 = "";

// Tenter import standard
if (editFile394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFile394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394";
        editSources[394] = editFootage394;
        fileName394 = "UNDLM_00394.mov";
        importSuccess394 = true;
        editImportCount++;
        logImportSuccess(394, "EDIT", editFile394.fsName, fileName394);
    } catch (e) {
        logImportError(394, "EDIT", editFile394.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess394 && editFilePoignees394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFilePoignees394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394";
        editSources[394] = editFootage394;
        fileName394 = "UNDLM_00394_AVEC_POIGNEES.mov";
        importSuccess394 = true;
        editImportCount++;
        logImportSuccess(394, "EDIT", editFilePoignees394.fsName, fileName394);
    } catch (e) {
        logImportError(394, "EDIT", editFilePoignees394.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess394 && editFileBis394.exists) {
    try {
        var editFootage394 = project.importFile(new ImportOptions(editFileBis394));
        editFootage394.parentFolder = fromEditFolder;
        editFootage394.name = "UNDLM_00394";
        editSources[394] = editFootage394;
        fileName394 = "UNDLM_00394bis.mov";
        importSuccess394 = true;
        editImportCount++;
        logImportSuccess(394, "EDIT", editFileBis394.fsName, fileName394);
    } catch (e) {
        logImportError(394, "EDIT", editFileBis394.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess394) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00394.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00394.mov: " + editFile394.exists + "\n" +
          "• UNDLM_00394_AVEC_POIGNEES.mov: " + editFilePoignees394.exists + "\n" +
          "• UNDLM_00394bis.mov: " + editFileBis394.exists);
}

// Import plan EDIT 00395
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395.mov");
var editFilePoignees395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov");
var editFileBis395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00395bis.mov");

var importSuccess395 = false;
var fileName395 = "";

// Tenter import standard
if (editFile395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFile395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395";
        editSources[395] = editFootage395;
        fileName395 = "UNDLM_00395.mov";
        importSuccess395 = true;
        editImportCount++;
        logImportSuccess(395, "EDIT", editFile395.fsName, fileName395);
    } catch (e) {
        logImportError(395, "EDIT", editFile395.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess395 && editFilePoignees395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFilePoignees395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395";
        editSources[395] = editFootage395;
        fileName395 = "UNDLM_00395_AVEC_POIGNEES.mov";
        importSuccess395 = true;
        editImportCount++;
        logImportSuccess(395, "EDIT", editFilePoignees395.fsName, fileName395);
    } catch (e) {
        logImportError(395, "EDIT", editFilePoignees395.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess395 && editFileBis395.exists) {
    try {
        var editFootage395 = project.importFile(new ImportOptions(editFileBis395));
        editFootage395.parentFolder = fromEditFolder;
        editFootage395.name = "UNDLM_00395";
        editSources[395] = editFootage395;
        fileName395 = "UNDLM_00395bis.mov";
        importSuccess395 = true;
        editImportCount++;
        logImportSuccess(395, "EDIT", editFileBis395.fsName, fileName395);
    } catch (e) {
        logImportError(395, "EDIT", editFileBis395.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess395) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00395.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00395.mov: " + editFile395.exists + "\n" +
          "• UNDLM_00395_AVEC_POIGNEES.mov: " + editFilePoignees395.exists + "\n" +
          "• UNDLM_00395bis.mov: " + editFileBis395.exists);
}

// Import plan EDIT 00396
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396.mov");
var editFilePoignees396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov");
var editFileBis396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00396bis.mov");

var importSuccess396 = false;
var fileName396 = "";

// Tenter import standard
if (editFile396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFile396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396";
        editSources[396] = editFootage396;
        fileName396 = "UNDLM_00396.mov";
        importSuccess396 = true;
        editImportCount++;
        logImportSuccess(396, "EDIT", editFile396.fsName, fileName396);
    } catch (e) {
        logImportError(396, "EDIT", editFile396.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess396 && editFilePoignees396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFilePoignees396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396";
        editSources[396] = editFootage396;
        fileName396 = "UNDLM_00396_AVEC_POIGNEES.mov";
        importSuccess396 = true;
        editImportCount++;
        logImportSuccess(396, "EDIT", editFilePoignees396.fsName, fileName396);
    } catch (e) {
        logImportError(396, "EDIT", editFilePoignees396.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess396 && editFileBis396.exists) {
    try {
        var editFootage396 = project.importFile(new ImportOptions(editFileBis396));
        editFootage396.parentFolder = fromEditFolder;
        editFootage396.name = "UNDLM_00396";
        editSources[396] = editFootage396;
        fileName396 = "UNDLM_00396bis.mov";
        importSuccess396 = true;
        editImportCount++;
        logImportSuccess(396, "EDIT", editFileBis396.fsName, fileName396);
    } catch (e) {
        logImportError(396, "EDIT", editFileBis396.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess396) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00396.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00396.mov: " + editFile396.exists + "\n" +
          "• UNDLM_00396_AVEC_POIGNEES.mov: " + editFilePoignees396.exists + "\n" +
          "• UNDLM_00396bis.mov: " + editFileBis396.exists);
}

// Import plan EDIT 00397
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397.mov");
var editFilePoignees397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov");
var editFileBis397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00397bis.mov");

var importSuccess397 = false;
var fileName397 = "";

// Tenter import standard
if (editFile397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFile397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397";
        editSources[397] = editFootage397;
        fileName397 = "UNDLM_00397.mov";
        importSuccess397 = true;
        editImportCount++;
        logImportSuccess(397, "EDIT", editFile397.fsName, fileName397);
    } catch (e) {
        logImportError(397, "EDIT", editFile397.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess397 && editFilePoignees397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFilePoignees397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397";
        editSources[397] = editFootage397;
        fileName397 = "UNDLM_00397_AVEC_POIGNEES.mov";
        importSuccess397 = true;
        editImportCount++;
        logImportSuccess(397, "EDIT", editFilePoignees397.fsName, fileName397);
    } catch (e) {
        logImportError(397, "EDIT", editFilePoignees397.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess397 && editFileBis397.exists) {
    try {
        var editFootage397 = project.importFile(new ImportOptions(editFileBis397));
        editFootage397.parentFolder = fromEditFolder;
        editFootage397.name = "UNDLM_00397";
        editSources[397] = editFootage397;
        fileName397 = "UNDLM_00397bis.mov";
        importSuccess397 = true;
        editImportCount++;
        logImportSuccess(397, "EDIT", editFileBis397.fsName, fileName397);
    } catch (e) {
        logImportError(397, "EDIT", editFileBis397.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess397) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00397.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00397.mov: " + editFile397.exists + "\n" +
          "• UNDLM_00397_AVEC_POIGNEES.mov: " + editFilePoignees397.exists + "\n" +
          "• UNDLM_00397bis.mov: " + editFileBis397.exists);
}

// Import plan EDIT 00398
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398.mov");
var editFilePoignees398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov");
var editFileBis398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00398bis.mov");

var importSuccess398 = false;
var fileName398 = "";

// Tenter import standard
if (editFile398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFile398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398";
        editSources[398] = editFootage398;
        fileName398 = "UNDLM_00398.mov";
        importSuccess398 = true;
        editImportCount++;
        logImportSuccess(398, "EDIT", editFile398.fsName, fileName398);
    } catch (e) {
        logImportError(398, "EDIT", editFile398.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess398 && editFilePoignees398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFilePoignees398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398";
        editSources[398] = editFootage398;
        fileName398 = "UNDLM_00398_AVEC_POIGNEES.mov";
        importSuccess398 = true;
        editImportCount++;
        logImportSuccess(398, "EDIT", editFilePoignees398.fsName, fileName398);
    } catch (e) {
        logImportError(398, "EDIT", editFilePoignees398.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess398 && editFileBis398.exists) {
    try {
        var editFootage398 = project.importFile(new ImportOptions(editFileBis398));
        editFootage398.parentFolder = fromEditFolder;
        editFootage398.name = "UNDLM_00398";
        editSources[398] = editFootage398;
        fileName398 = "UNDLM_00398bis.mov";
        importSuccess398 = true;
        editImportCount++;
        logImportSuccess(398, "EDIT", editFileBis398.fsName, fileName398);
    } catch (e) {
        logImportError(398, "EDIT", editFileBis398.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess398) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00398.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00398.mov: " + editFile398.exists + "\n" +
          "• UNDLM_00398_AVEC_POIGNEES.mov: " + editFilePoignees398.exists + "\n" +
          "• UNDLM_00398bis.mov: " + editFileBis398.exists);
}

// Import plan EDIT 00399
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399.mov");
var editFilePoignees399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov");
var editFileBis399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00399bis.mov");

var importSuccess399 = false;
var fileName399 = "";

// Tenter import standard
if (editFile399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFile399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399";
        editSources[399] = editFootage399;
        fileName399 = "UNDLM_00399.mov";
        importSuccess399 = true;
        editImportCount++;
        logImportSuccess(399, "EDIT", editFile399.fsName, fileName399);
    } catch (e) {
        logImportError(399, "EDIT", editFile399.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess399 && editFilePoignees399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFilePoignees399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399";
        editSources[399] = editFootage399;
        fileName399 = "UNDLM_00399_AVEC_POIGNEES.mov";
        importSuccess399 = true;
        editImportCount++;
        logImportSuccess(399, "EDIT", editFilePoignees399.fsName, fileName399);
    } catch (e) {
        logImportError(399, "EDIT", editFilePoignees399.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess399 && editFileBis399.exists) {
    try {
        var editFootage399 = project.importFile(new ImportOptions(editFileBis399));
        editFootage399.parentFolder = fromEditFolder;
        editFootage399.name = "UNDLM_00399";
        editSources[399] = editFootage399;
        fileName399 = "UNDLM_00399bis.mov";
        importSuccess399 = true;
        editImportCount++;
        logImportSuccess(399, "EDIT", editFileBis399.fsName, fileName399);
    } catch (e) {
        logImportError(399, "EDIT", editFileBis399.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess399) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00399.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00399.mov: " + editFile399.exists + "\n" +
          "• UNDLM_00399_AVEC_POIGNEES.mov: " + editFilePoignees399.exists + "\n" +
          "• UNDLM_00399bis.mov: " + editFileBis399.exists);
}

// Import plan EDIT 00400
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400.mov");
var editFilePoignees400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov");
var editFileBis400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00400bis.mov");

var importSuccess400 = false;
var fileName400 = "";

// Tenter import standard
if (editFile400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFile400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400";
        editSources[400] = editFootage400;
        fileName400 = "UNDLM_00400.mov";
        importSuccess400 = true;
        editImportCount++;
        logImportSuccess(400, "EDIT", editFile400.fsName, fileName400);
    } catch (e) {
        logImportError(400, "EDIT", editFile400.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess400 && editFilePoignees400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFilePoignees400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400";
        editSources[400] = editFootage400;
        fileName400 = "UNDLM_00400_AVEC_POIGNEES.mov";
        importSuccess400 = true;
        editImportCount++;
        logImportSuccess(400, "EDIT", editFilePoignees400.fsName, fileName400);
    } catch (e) {
        logImportError(400, "EDIT", editFilePoignees400.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess400 && editFileBis400.exists) {
    try {
        var editFootage400 = project.importFile(new ImportOptions(editFileBis400));
        editFootage400.parentFolder = fromEditFolder;
        editFootage400.name = "UNDLM_00400";
        editSources[400] = editFootage400;
        fileName400 = "UNDLM_00400bis.mov";
        importSuccess400 = true;
        editImportCount++;
        logImportSuccess(400, "EDIT", editFileBis400.fsName, fileName400);
    } catch (e) {
        logImportError(400, "EDIT", editFileBis400.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess400) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00400.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00400.mov: " + editFile400.exists + "\n" +
          "• UNDLM_00400_AVEC_POIGNEES.mov: " + editFilePoignees400.exists + "\n" +
          "• UNDLM_00400bis.mov: " + editFileBis400.exists);
}

// Import plan EDIT 00464
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464.mov");
var editFilePoignees464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov");
var editFileBis464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00464bis.mov");

var importSuccess464 = false;
var fileName464 = "";

// Tenter import standard
if (editFile464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFile464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464";
        editSources[464] = editFootage464;
        fileName464 = "UNDLM_00464.mov";
        importSuccess464 = true;
        editImportCount++;
        logImportSuccess(464, "EDIT", editFile464.fsName, fileName464);
    } catch (e) {
        logImportError(464, "EDIT", editFile464.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess464 && editFilePoignees464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFilePoignees464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464";
        editSources[464] = editFootage464;
        fileName464 = "UNDLM_00464_AVEC_POIGNEES.mov";
        importSuccess464 = true;
        editImportCount++;
        logImportSuccess(464, "EDIT", editFilePoignees464.fsName, fileName464);
    } catch (e) {
        logImportError(464, "EDIT", editFilePoignees464.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess464 && editFileBis464.exists) {
    try {
        var editFootage464 = project.importFile(new ImportOptions(editFileBis464));
        editFootage464.parentFolder = fromEditFolder;
        editFootage464.name = "UNDLM_00464";
        editSources[464] = editFootage464;
        fileName464 = "UNDLM_00464bis.mov";
        importSuccess464 = true;
        editImportCount++;
        logImportSuccess(464, "EDIT", editFileBis464.fsName, fileName464);
    } catch (e) {
        logImportError(464, "EDIT", editFileBis464.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess464) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00464.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00464.mov: " + editFile464.exists + "\n" +
          "• UNDLM_00464_AVEC_POIGNEES.mov: " + editFilePoignees464.exists + "\n" +
          "• UNDLM_00464bis.mov: " + editFileBis464.exists);
}

// Import plan EDIT 00465
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465.mov");
var editFilePoignees465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov");
var editFileBis465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00465bis.mov");

var importSuccess465 = false;
var fileName465 = "";

// Tenter import standard
if (editFile465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFile465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465";
        editSources[465] = editFootage465;
        fileName465 = "UNDLM_00465.mov";
        importSuccess465 = true;
        editImportCount++;
        logImportSuccess(465, "EDIT", editFile465.fsName, fileName465);
    } catch (e) {
        logImportError(465, "EDIT", editFile465.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess465 && editFilePoignees465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFilePoignees465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465";
        editSources[465] = editFootage465;
        fileName465 = "UNDLM_00465_AVEC_POIGNEES.mov";
        importSuccess465 = true;
        editImportCount++;
        logImportSuccess(465, "EDIT", editFilePoignees465.fsName, fileName465);
    } catch (e) {
        logImportError(465, "EDIT", editFilePoignees465.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess465 && editFileBis465.exists) {
    try {
        var editFootage465 = project.importFile(new ImportOptions(editFileBis465));
        editFootage465.parentFolder = fromEditFolder;
        editFootage465.name = "UNDLM_00465";
        editSources[465] = editFootage465;
        fileName465 = "UNDLM_00465bis.mov";
        importSuccess465 = true;
        editImportCount++;
        logImportSuccess(465, "EDIT", editFileBis465.fsName, fileName465);
    } catch (e) {
        logImportError(465, "EDIT", editFileBis465.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess465) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00465.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00465.mov: " + editFile465.exists + "\n" +
          "• UNDLM_00465_AVEC_POIGNEES.mov: " + editFilePoignees465.exists + "\n" +
          "• UNDLM_00465bis.mov: " + editFileBis465.exists);
}

// Import plan EDIT 00466
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466.mov");
var editFilePoignees466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov");
var editFileBis466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00466bis.mov");

var importSuccess466 = false;
var fileName466 = "";

// Tenter import standard
if (editFile466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFile466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466";
        editSources[466] = editFootage466;
        fileName466 = "UNDLM_00466.mov";
        importSuccess466 = true;
        editImportCount++;
        logImportSuccess(466, "EDIT", editFile466.fsName, fileName466);
    } catch (e) {
        logImportError(466, "EDIT", editFile466.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess466 && editFilePoignees466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFilePoignees466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466";
        editSources[466] = editFootage466;
        fileName466 = "UNDLM_00466_AVEC_POIGNEES.mov";
        importSuccess466 = true;
        editImportCount++;
        logImportSuccess(466, "EDIT", editFilePoignees466.fsName, fileName466);
    } catch (e) {
        logImportError(466, "EDIT", editFilePoignees466.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess466 && editFileBis466.exists) {
    try {
        var editFootage466 = project.importFile(new ImportOptions(editFileBis466));
        editFootage466.parentFolder = fromEditFolder;
        editFootage466.name = "UNDLM_00466";
        editSources[466] = editFootage466;
        fileName466 = "UNDLM_00466bis.mov";
        importSuccess466 = true;
        editImportCount++;
        logImportSuccess(466, "EDIT", editFileBis466.fsName, fileName466);
    } catch (e) {
        logImportError(466, "EDIT", editFileBis466.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess466) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00466.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00466.mov: " + editFile466.exists + "\n" +
          "• UNDLM_00466_AVEC_POIGNEES.mov: " + editFilePoignees466.exists + "\n" +
          "• UNDLM_00466bis.mov: " + editFileBis466.exists);
}

// Import plan EDIT 00467
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467.mov");
var editFilePoignees467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov");
var editFileBis467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00467bis.mov");

var importSuccess467 = false;
var fileName467 = "";

// Tenter import standard
if (editFile467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFile467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467";
        editSources[467] = editFootage467;
        fileName467 = "UNDLM_00467.mov";
        importSuccess467 = true;
        editImportCount++;
        logImportSuccess(467, "EDIT", editFile467.fsName, fileName467);
    } catch (e) {
        logImportError(467, "EDIT", editFile467.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess467 && editFilePoignees467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFilePoignees467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467";
        editSources[467] = editFootage467;
        fileName467 = "UNDLM_00467_AVEC_POIGNEES.mov";
        importSuccess467 = true;
        editImportCount++;
        logImportSuccess(467, "EDIT", editFilePoignees467.fsName, fileName467);
    } catch (e) {
        logImportError(467, "EDIT", editFilePoignees467.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess467 && editFileBis467.exists) {
    try {
        var editFootage467 = project.importFile(new ImportOptions(editFileBis467));
        editFootage467.parentFolder = fromEditFolder;
        editFootage467.name = "UNDLM_00467";
        editSources[467] = editFootage467;
        fileName467 = "UNDLM_00467bis.mov";
        importSuccess467 = true;
        editImportCount++;
        logImportSuccess(467, "EDIT", editFileBis467.fsName, fileName467);
    } catch (e) {
        logImportError(467, "EDIT", editFileBis467.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess467) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00467.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00467.mov: " + editFile467.exists + "\n" +
          "• UNDLM_00467_AVEC_POIGNEES.mov: " + editFilePoignees467.exists + "\n" +
          "• UNDLM_00467bis.mov: " + editFileBis467.exists);
}

// Import plan EDIT 00468
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468.mov");
var editFilePoignees468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov");
var editFileBis468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00468bis.mov");

var importSuccess468 = false;
var fileName468 = "";

// Tenter import standard
if (editFile468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFile468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468";
        editSources[468] = editFootage468;
        fileName468 = "UNDLM_00468.mov";
        importSuccess468 = true;
        editImportCount++;
        logImportSuccess(468, "EDIT", editFile468.fsName, fileName468);
    } catch (e) {
        logImportError(468, "EDIT", editFile468.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess468 && editFilePoignees468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFilePoignees468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468";
        editSources[468] = editFootage468;
        fileName468 = "UNDLM_00468_AVEC_POIGNEES.mov";
        importSuccess468 = true;
        editImportCount++;
        logImportSuccess(468, "EDIT", editFilePoignees468.fsName, fileName468);
    } catch (e) {
        logImportError(468, "EDIT", editFilePoignees468.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess468 && editFileBis468.exists) {
    try {
        var editFootage468 = project.importFile(new ImportOptions(editFileBis468));
        editFootage468.parentFolder = fromEditFolder;
        editFootage468.name = "UNDLM_00468";
        editSources[468] = editFootage468;
        fileName468 = "UNDLM_00468bis.mov";
        importSuccess468 = true;
        editImportCount++;
        logImportSuccess(468, "EDIT", editFileBis468.fsName, fileName468);
    } catch (e) {
        logImportError(468, "EDIT", editFileBis468.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess468) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00468.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00468.mov: " + editFile468.exists + "\n" +
          "• UNDLM_00468_AVEC_POIGNEES.mov: " + editFilePoignees468.exists + "\n" +
          "• UNDLM_00468bis.mov: " + editFileBis468.exists);
}

// Import plan EDIT 00469
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469.mov");
var editFilePoignees469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov");
var editFileBis469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00469bis.mov");

var importSuccess469 = false;
var fileName469 = "";

// Tenter import standard
if (editFile469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFile469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469";
        editSources[469] = editFootage469;
        fileName469 = "UNDLM_00469.mov";
        importSuccess469 = true;
        editImportCount++;
        logImportSuccess(469, "EDIT", editFile469.fsName, fileName469);
    } catch (e) {
        logImportError(469, "EDIT", editFile469.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess469 && editFilePoignees469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFilePoignees469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469";
        editSources[469] = editFootage469;
        fileName469 = "UNDLM_00469_AVEC_POIGNEES.mov";
        importSuccess469 = true;
        editImportCount++;
        logImportSuccess(469, "EDIT", editFilePoignees469.fsName, fileName469);
    } catch (e) {
        logImportError(469, "EDIT", editFilePoignees469.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess469 && editFileBis469.exists) {
    try {
        var editFootage469 = project.importFile(new ImportOptions(editFileBis469));
        editFootage469.parentFolder = fromEditFolder;
        editFootage469.name = "UNDLM_00469";
        editSources[469] = editFootage469;
        fileName469 = "UNDLM_00469bis.mov";
        importSuccess469 = true;
        editImportCount++;
        logImportSuccess(469, "EDIT", editFileBis469.fsName, fileName469);
    } catch (e) {
        logImportError(469, "EDIT", editFileBis469.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess469) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00469.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00469.mov: " + editFile469.exists + "\n" +
          "• UNDLM_00469_AVEC_POIGNEES.mov: " + editFilePoignees469.exists + "\n" +
          "• UNDLM_00469bis.mov: " + editFileBis469.exists);
}

// Import plan EDIT 00470
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470.mov");
var editFilePoignees470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov");
var editFileBis470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00470bis.mov");

var importSuccess470 = false;
var fileName470 = "";

// Tenter import standard
if (editFile470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFile470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470";
        editSources[470] = editFootage470;
        fileName470 = "UNDLM_00470.mov";
        importSuccess470 = true;
        editImportCount++;
        logImportSuccess(470, "EDIT", editFile470.fsName, fileName470);
    } catch (e) {
        logImportError(470, "EDIT", editFile470.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess470 && editFilePoignees470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFilePoignees470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470";
        editSources[470] = editFootage470;
        fileName470 = "UNDLM_00470_AVEC_POIGNEES.mov";
        importSuccess470 = true;
        editImportCount++;
        logImportSuccess(470, "EDIT", editFilePoignees470.fsName, fileName470);
    } catch (e) {
        logImportError(470, "EDIT", editFilePoignees470.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess470 && editFileBis470.exists) {
    try {
        var editFootage470 = project.importFile(new ImportOptions(editFileBis470));
        editFootage470.parentFolder = fromEditFolder;
        editFootage470.name = "UNDLM_00470";
        editSources[470] = editFootage470;
        fileName470 = "UNDLM_00470bis.mov";
        importSuccess470 = true;
        editImportCount++;
        logImportSuccess(470, "EDIT", editFileBis470.fsName, fileName470);
    } catch (e) {
        logImportError(470, "EDIT", editFileBis470.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess470) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00470.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00470.mov: " + editFile470.exists + "\n" +
          "• UNDLM_00470_AVEC_POIGNEES.mov: " + editFilePoignees470.exists + "\n" +
          "• UNDLM_00470bis.mov: " + editFileBis470.exists);
}

// Import plan EDIT 00471
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471.mov");
var editFilePoignees471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov");
var editFileBis471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00471bis.mov");

var importSuccess471 = false;
var fileName471 = "";

// Tenter import standard
if (editFile471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFile471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471";
        editSources[471] = editFootage471;
        fileName471 = "UNDLM_00471.mov";
        importSuccess471 = true;
        editImportCount++;
        logImportSuccess(471, "EDIT", editFile471.fsName, fileName471);
    } catch (e) {
        logImportError(471, "EDIT", editFile471.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess471 && editFilePoignees471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFilePoignees471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471";
        editSources[471] = editFootage471;
        fileName471 = "UNDLM_00471_AVEC_POIGNEES.mov";
        importSuccess471 = true;
        editImportCount++;
        logImportSuccess(471, "EDIT", editFilePoignees471.fsName, fileName471);
    } catch (e) {
        logImportError(471, "EDIT", editFilePoignees471.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess471 && editFileBis471.exists) {
    try {
        var editFootage471 = project.importFile(new ImportOptions(editFileBis471));
        editFootage471.parentFolder = fromEditFolder;
        editFootage471.name = "UNDLM_00471";
        editSources[471] = editFootage471;
        fileName471 = "UNDLM_00471bis.mov";
        importSuccess471 = true;
        editImportCount++;
        logImportSuccess(471, "EDIT", editFileBis471.fsName, fileName471);
    } catch (e) {
        logImportError(471, "EDIT", editFileBis471.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess471) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00471.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00471.mov: " + editFile471.exists + "\n" +
          "• UNDLM_00471_AVEC_POIGNEES.mov: " + editFilePoignees471.exists + "\n" +
          "• UNDLM_00471bis.mov: " + editFileBis471.exists);
}

// Import plan EDIT 00472
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472.mov");
var editFilePoignees472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov");
var editFileBis472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00472bis.mov");

var importSuccess472 = false;
var fileName472 = "";

// Tenter import standard
if (editFile472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFile472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472";
        editSources[472] = editFootage472;
        fileName472 = "UNDLM_00472.mov";
        importSuccess472 = true;
        editImportCount++;
        logImportSuccess(472, "EDIT", editFile472.fsName, fileName472);
    } catch (e) {
        logImportError(472, "EDIT", editFile472.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess472 && editFilePoignees472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFilePoignees472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472";
        editSources[472] = editFootage472;
        fileName472 = "UNDLM_00472_AVEC_POIGNEES.mov";
        importSuccess472 = true;
        editImportCount++;
        logImportSuccess(472, "EDIT", editFilePoignees472.fsName, fileName472);
    } catch (e) {
        logImportError(472, "EDIT", editFilePoignees472.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess472 && editFileBis472.exists) {
    try {
        var editFootage472 = project.importFile(new ImportOptions(editFileBis472));
        editFootage472.parentFolder = fromEditFolder;
        editFootage472.name = "UNDLM_00472";
        editSources[472] = editFootage472;
        fileName472 = "UNDLM_00472bis.mov";
        importSuccess472 = true;
        editImportCount++;
        logImportSuccess(472, "EDIT", editFileBis472.fsName, fileName472);
    } catch (e) {
        logImportError(472, "EDIT", editFileBis472.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess472) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00472.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00472.mov: " + editFile472.exists + "\n" +
          "• UNDLM_00472_AVEC_POIGNEES.mov: " + editFilePoignees472.exists + "\n" +
          "• UNDLM_00472bis.mov: " + editFileBis472.exists);
}

// Import plan EDIT 00473
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473.mov");
var editFilePoignees473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov");
var editFileBis473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00473bis.mov");

var importSuccess473 = false;
var fileName473 = "";

// Tenter import standard
if (editFile473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFile473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473";
        editSources[473] = editFootage473;
        fileName473 = "UNDLM_00473.mov";
        importSuccess473 = true;
        editImportCount++;
        logImportSuccess(473, "EDIT", editFile473.fsName, fileName473);
    } catch (e) {
        logImportError(473, "EDIT", editFile473.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess473 && editFilePoignees473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFilePoignees473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473";
        editSources[473] = editFootage473;
        fileName473 = "UNDLM_00473_AVEC_POIGNEES.mov";
        importSuccess473 = true;
        editImportCount++;
        logImportSuccess(473, "EDIT", editFilePoignees473.fsName, fileName473);
    } catch (e) {
        logImportError(473, "EDIT", editFilePoignees473.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess473 && editFileBis473.exists) {
    try {
        var editFootage473 = project.importFile(new ImportOptions(editFileBis473));
        editFootage473.parentFolder = fromEditFolder;
        editFootage473.name = "UNDLM_00473";
        editSources[473] = editFootage473;
        fileName473 = "UNDLM_00473bis.mov";
        importSuccess473 = true;
        editImportCount++;
        logImportSuccess(473, "EDIT", editFileBis473.fsName, fileName473);
    } catch (e) {
        logImportError(473, "EDIT", editFileBis473.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess473) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00473.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00473.mov: " + editFile473.exists + "\n" +
          "• UNDLM_00473_AVEC_POIGNEES.mov: " + editFilePoignees473.exists + "\n" +
          "• UNDLM_00473bis.mov: " + editFileBis473.exists);
}

// Import plan EDIT 00474
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474.mov");
var editFilePoignees474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov");
var editFileBis474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00474bis.mov");

var importSuccess474 = false;
var fileName474 = "";

// Tenter import standard
if (editFile474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFile474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474";
        editSources[474] = editFootage474;
        fileName474 = "UNDLM_00474.mov";
        importSuccess474 = true;
        editImportCount++;
        logImportSuccess(474, "EDIT", editFile474.fsName, fileName474);
    } catch (e) {
        logImportError(474, "EDIT", editFile474.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess474 && editFilePoignees474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFilePoignees474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474";
        editSources[474] = editFootage474;
        fileName474 = "UNDLM_00474_AVEC_POIGNEES.mov";
        importSuccess474 = true;
        editImportCount++;
        logImportSuccess(474, "EDIT", editFilePoignees474.fsName, fileName474);
    } catch (e) {
        logImportError(474, "EDIT", editFilePoignees474.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess474 && editFileBis474.exists) {
    try {
        var editFootage474 = project.importFile(new ImportOptions(editFileBis474));
        editFootage474.parentFolder = fromEditFolder;
        editFootage474.name = "UNDLM_00474";
        editSources[474] = editFootage474;
        fileName474 = "UNDLM_00474bis.mov";
        importSuccess474 = true;
        editImportCount++;
        logImportSuccess(474, "EDIT", editFileBis474.fsName, fileName474);
    } catch (e) {
        logImportError(474, "EDIT", editFileBis474.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess474) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00474.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00474.mov: " + editFile474.exists + "\n" +
          "• UNDLM_00474_AVEC_POIGNEES.mov: " + editFilePoignees474.exists + "\n" +
          "• UNDLM_00474bis.mov: " + editFileBis474.exists);
}

// Import plan EDIT 00475
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475.mov");
var editFilePoignees475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov");
var editFileBis475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00475bis.mov");

var importSuccess475 = false;
var fileName475 = "";

// Tenter import standard
if (editFile475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFile475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475";
        editSources[475] = editFootage475;
        fileName475 = "UNDLM_00475.mov";
        importSuccess475 = true;
        editImportCount++;
        logImportSuccess(475, "EDIT", editFile475.fsName, fileName475);
    } catch (e) {
        logImportError(475, "EDIT", editFile475.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess475 && editFilePoignees475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFilePoignees475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475";
        editSources[475] = editFootage475;
        fileName475 = "UNDLM_00475_AVEC_POIGNEES.mov";
        importSuccess475 = true;
        editImportCount++;
        logImportSuccess(475, "EDIT", editFilePoignees475.fsName, fileName475);
    } catch (e) {
        logImportError(475, "EDIT", editFilePoignees475.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess475 && editFileBis475.exists) {
    try {
        var editFootage475 = project.importFile(new ImportOptions(editFileBis475));
        editFootage475.parentFolder = fromEditFolder;
        editFootage475.name = "UNDLM_00475";
        editSources[475] = editFootage475;
        fileName475 = "UNDLM_00475bis.mov";
        importSuccess475 = true;
        editImportCount++;
        logImportSuccess(475, "EDIT", editFileBis475.fsName, fileName475);
    } catch (e) {
        logImportError(475, "EDIT", editFileBis475.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess475) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00475.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00475.mov: " + editFile475.exists + "\n" +
          "• UNDLM_00475_AVEC_POIGNEES.mov: " + editFilePoignees475.exists + "\n" +
          "• UNDLM_00475bis.mov: " + editFileBis475.exists);
}

// Import plan EDIT 00476
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476.mov");
var editFilePoignees476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov");
var editFileBis476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00476bis.mov");

var importSuccess476 = false;
var fileName476 = "";

// Tenter import standard
if (editFile476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFile476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476";
        editSources[476] = editFootage476;
        fileName476 = "UNDLM_00476.mov";
        importSuccess476 = true;
        editImportCount++;
        logImportSuccess(476, "EDIT", editFile476.fsName, fileName476);
    } catch (e) {
        logImportError(476, "EDIT", editFile476.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess476 && editFilePoignees476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFilePoignees476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476";
        editSources[476] = editFootage476;
        fileName476 = "UNDLM_00476_AVEC_POIGNEES.mov";
        importSuccess476 = true;
        editImportCount++;
        logImportSuccess(476, "EDIT", editFilePoignees476.fsName, fileName476);
    } catch (e) {
        logImportError(476, "EDIT", editFilePoignees476.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess476 && editFileBis476.exists) {
    try {
        var editFootage476 = project.importFile(new ImportOptions(editFileBis476));
        editFootage476.parentFolder = fromEditFolder;
        editFootage476.name = "UNDLM_00476";
        editSources[476] = editFootage476;
        fileName476 = "UNDLM_00476bis.mov";
        importSuccess476 = true;
        editImportCount++;
        logImportSuccess(476, "EDIT", editFileBis476.fsName, fileName476);
    } catch (e) {
        logImportError(476, "EDIT", editFileBis476.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess476) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00476.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00476.mov: " + editFile476.exists + "\n" +
          "• UNDLM_00476_AVEC_POIGNEES.mov: " + editFilePoignees476.exists + "\n" +
          "• UNDLM_00476bis.mov: " + editFileBis476.exists);
}

// Import plan EDIT 00477
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477.mov");
var editFilePoignees477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov");
var editFileBis477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00477bis.mov");

var importSuccess477 = false;
var fileName477 = "";

// Tenter import standard
if (editFile477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFile477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477";
        editSources[477] = editFootage477;
        fileName477 = "UNDLM_00477.mov";
        importSuccess477 = true;
        editImportCount++;
        logImportSuccess(477, "EDIT", editFile477.fsName, fileName477);
    } catch (e) {
        logImportError(477, "EDIT", editFile477.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess477 && editFilePoignees477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFilePoignees477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477";
        editSources[477] = editFootage477;
        fileName477 = "UNDLM_00477_AVEC_POIGNEES.mov";
        importSuccess477 = true;
        editImportCount++;
        logImportSuccess(477, "EDIT", editFilePoignees477.fsName, fileName477);
    } catch (e) {
        logImportError(477, "EDIT", editFilePoignees477.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess477 && editFileBis477.exists) {
    try {
        var editFootage477 = project.importFile(new ImportOptions(editFileBis477));
        editFootage477.parentFolder = fromEditFolder;
        editFootage477.name = "UNDLM_00477";
        editSources[477] = editFootage477;
        fileName477 = "UNDLM_00477bis.mov";
        importSuccess477 = true;
        editImportCount++;
        logImportSuccess(477, "EDIT", editFileBis477.fsName, fileName477);
    } catch (e) {
        logImportError(477, "EDIT", editFileBis477.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess477) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00477.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00477.mov: " + editFile477.exists + "\n" +
          "• UNDLM_00477_AVEC_POIGNEES.mov: " + editFilePoignees477.exists + "\n" +
          "• UNDLM_00477bis.mov: " + editFileBis477.exists);
}

// Import plan EDIT 00501
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501.mov");
var editFilePoignees501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov");
var editFileBis501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00501bis.mov");

var importSuccess501 = false;
var fileName501 = "";

// Tenter import standard
if (editFile501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFile501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501";
        editSources[501] = editFootage501;
        fileName501 = "UNDLM_00501.mov";
        importSuccess501 = true;
        editImportCount++;
        logImportSuccess(501, "EDIT", editFile501.fsName, fileName501);
    } catch (e) {
        logImportError(501, "EDIT", editFile501.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess501 && editFilePoignees501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFilePoignees501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501";
        editSources[501] = editFootage501;
        fileName501 = "UNDLM_00501_AVEC_POIGNEES.mov";
        importSuccess501 = true;
        editImportCount++;
        logImportSuccess(501, "EDIT", editFilePoignees501.fsName, fileName501);
    } catch (e) {
        logImportError(501, "EDIT", editFilePoignees501.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!importSuccess501 && editFileBis501.exists) {
    try {
        var editFootage501 = project.importFile(new ImportOptions(editFileBis501));
        editFootage501.parentFolder = fromEditFolder;
        editFootage501.name = "UNDLM_00501";
        editSources[501] = editFootage501;
        fileName501 = "UNDLM_00501bis.mov";
        importSuccess501 = true;
        editImportCount++;
        logImportSuccess(501, "EDIT", editFileBis501.fsName, fileName501);
    } catch (e) {
        logImportError(501, "EDIT", editFileBis501.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess501) {
    missingEditCount++;
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00501.mov\n" +
          "Variantes testées:\n" +
          "• UNDLM_00501.mov: " + editFile501.exists + "\n" +
          "• UNDLM_00501_AVEC_POIGNEES.mov: " + editFilePoignees501.exists + "\n" +
          "• UNDLM_00501bis.mov: " + editFileBis501.exists);
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
        gradedFileName175 = "UNDLM_00175.mov";
        gradedImportSuccess175 = true;
        gradingImportCount++;
        logImportSuccess(175, "GRADED", gradedFile175.fsName, gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED", gradedFile175.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess175 && gradedFilePoignees175.exists) {
    try {
        var gradedFootage175 = project.importFile(new ImportOptions(gradedFilePoignees175));
        gradedFootage175.parentFolder = fromGradingFolder;
        gradedFootage175.name = "UNDLM_00175";
        gradingSources[175] = gradedFootage175;
        gradedFileName175 = "UNDLM_00175_AVEC_POIGNEES.mov";
        gradedImportSuccess175 = true;
        gradingImportCount++;
        logImportSuccess(175, "GRADED", gradedFilePoignees175.fsName, gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED", gradedFilePoignees175.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess175 && gradedFileBis175.exists) {
    try {
        var gradedFootage175 = project.importFile(new ImportOptions(gradedFileBis175));
        gradedFootage175.parentFolder = fromGradingFolder;
        gradedFootage175.name = "UNDLM_00175";
        gradingSources[175] = gradedFootage175;
        gradedFileName175 = "UNDLM_00175bis.mov";
        gradedImportSuccess175 = true;
        gradingImportCount++;
        logImportSuccess(175, "GRADED", gradedFileBis175.fsName, gradedFileName175);
    } catch (e) {
        logImportError(175, "GRADED", gradedFileBis175.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess175) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00175 (normal)");
}

// Import plan GRADED 00176
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176.mov");
var gradedFilePoignees176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov");
var gradedFileBis176 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176bis.mov");

var gradedImportSuccess176 = false;
var gradedFileName176 = "";

// Tenter import standard
if (gradedFile176.exists) {
    try {
        var gradedFootage176 = project.importFile(new ImportOptions(gradedFile176));
        gradedFootage176.parentFolder = fromGradingFolder;
        gradedFootage176.name = "UNDLM_00176";
        gradingSources[176] = gradedFootage176;
        gradedFileName176 = "UNDLM_00176.mov";
        gradedImportSuccess176 = true;
        gradingImportCount++;
        logImportSuccess(176, "GRADED", gradedFile176.fsName, gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED", gradedFile176.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess176 && gradedFilePoignees176.exists) {
    try {
        var gradedFootage176 = project.importFile(new ImportOptions(gradedFilePoignees176));
        gradedFootage176.parentFolder = fromGradingFolder;
        gradedFootage176.name = "UNDLM_00176";
        gradingSources[176] = gradedFootage176;
        gradedFileName176 = "UNDLM_00176_AVEC_POIGNEES.mov";
        gradedImportSuccess176 = true;
        gradingImportCount++;
        logImportSuccess(176, "GRADED", gradedFilePoignees176.fsName, gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED", gradedFilePoignees176.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess176 && gradedFileBis176.exists) {
    try {
        var gradedFootage176 = project.importFile(new ImportOptions(gradedFileBis176));
        gradedFootage176.parentFolder = fromGradingFolder;
        gradedFootage176.name = "UNDLM_00176";
        gradingSources[176] = gradedFootage176;
        gradedFileName176 = "UNDLM_00176bis.mov";
        gradedImportSuccess176 = true;
        gradingImportCount++;
        logImportSuccess(176, "GRADED", gradedFileBis176.fsName, gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED", gradedFileBis176.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess176) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00176 (normal)");
}

// Import plan GRADED 00177
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177.mov");
var gradedFilePoignees177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov");
var gradedFileBis177 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177bis.mov");

var gradedImportSuccess177 = false;
var gradedFileName177 = "";

// Tenter import standard
if (gradedFile177.exists) {
    try {
        var gradedFootage177 = project.importFile(new ImportOptions(gradedFile177));
        gradedFootage177.parentFolder = fromGradingFolder;
        gradedFootage177.name = "UNDLM_00177";
        gradingSources[177] = gradedFootage177;
        gradedFileName177 = "UNDLM_00177.mov";
        gradedImportSuccess177 = true;
        gradingImportCount++;
        logImportSuccess(177, "GRADED", gradedFile177.fsName, gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED", gradedFile177.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess177 && gradedFilePoignees177.exists) {
    try {
        var gradedFootage177 = project.importFile(new ImportOptions(gradedFilePoignees177));
        gradedFootage177.parentFolder = fromGradingFolder;
        gradedFootage177.name = "UNDLM_00177";
        gradingSources[177] = gradedFootage177;
        gradedFileName177 = "UNDLM_00177_AVEC_POIGNEES.mov";
        gradedImportSuccess177 = true;
        gradingImportCount++;
        logImportSuccess(177, "GRADED", gradedFilePoignees177.fsName, gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED", gradedFilePoignees177.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess177 && gradedFileBis177.exists) {
    try {
        var gradedFootage177 = project.importFile(new ImportOptions(gradedFileBis177));
        gradedFootage177.parentFolder = fromGradingFolder;
        gradedFootage177.name = "UNDLM_00177";
        gradingSources[177] = gradedFootage177;
        gradedFileName177 = "UNDLM_00177bis.mov";
        gradedImportSuccess177 = true;
        gradingImportCount++;
        logImportSuccess(177, "GRADED", gradedFileBis177.fsName, gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED", gradedFileBis177.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess177) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00177 (normal)");
}

// Import plan GRADED 00193
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193.mov");
var gradedFilePoignees193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193_AVEC_POIGNEES.mov");
var gradedFileBis193 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00193bis.mov");

var gradedImportSuccess193 = false;
var gradedFileName193 = "";

// Tenter import standard
if (gradedFile193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFile193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193";
        gradingSources[193] = gradedFootage193;
        gradedFileName193 = "UNDLM_00193.mov";
        gradedImportSuccess193 = true;
        gradingImportCount++;
        logImportSuccess(193, "GRADED", gradedFile193.fsName, gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED", gradedFile193.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess193 && gradedFilePoignees193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFilePoignees193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193";
        gradingSources[193] = gradedFootage193;
        gradedFileName193 = "UNDLM_00193_AVEC_POIGNEES.mov";
        gradedImportSuccess193 = true;
        gradingImportCount++;
        logImportSuccess(193, "GRADED", gradedFilePoignees193.fsName, gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED", gradedFilePoignees193.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess193 && gradedFileBis193.exists) {
    try {
        var gradedFootage193 = project.importFile(new ImportOptions(gradedFileBis193));
        gradedFootage193.parentFolder = fromGradingFolder;
        gradedFootage193.name = "UNDLM_00193";
        gradingSources[193] = gradedFootage193;
        gradedFileName193 = "UNDLM_00193bis.mov";
        gradedImportSuccess193 = true;
        gradingImportCount++;
        logImportSuccess(193, "GRADED", gradedFileBis193.fsName, gradedFileName193);
    } catch (e) {
        logImportError(193, "GRADED", gradedFileBis193.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess193) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00193 (normal)");
}

// Import plan GRADED 00194
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194.mov");
var gradedFilePoignees194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194_AVEC_POIGNEES.mov");
var gradedFileBis194 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00194bis.mov");

var gradedImportSuccess194 = false;
var gradedFileName194 = "";

// Tenter import standard
if (gradedFile194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFile194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194";
        gradingSources[194] = gradedFootage194;
        gradedFileName194 = "UNDLM_00194.mov";
        gradedImportSuccess194 = true;
        gradingImportCount++;
        logImportSuccess(194, "GRADED", gradedFile194.fsName, gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED", gradedFile194.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess194 && gradedFilePoignees194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFilePoignees194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194";
        gradingSources[194] = gradedFootage194;
        gradedFileName194 = "UNDLM_00194_AVEC_POIGNEES.mov";
        gradedImportSuccess194 = true;
        gradingImportCount++;
        logImportSuccess(194, "GRADED", gradedFilePoignees194.fsName, gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED", gradedFilePoignees194.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess194 && gradedFileBis194.exists) {
    try {
        var gradedFootage194 = project.importFile(new ImportOptions(gradedFileBis194));
        gradedFootage194.parentFolder = fromGradingFolder;
        gradedFootage194.name = "UNDLM_00194";
        gradingSources[194] = gradedFootage194;
        gradedFileName194 = "UNDLM_00194bis.mov";
        gradedImportSuccess194 = true;
        gradingImportCount++;
        logImportSuccess(194, "GRADED", gradedFileBis194.fsName, gradedFileName194);
    } catch (e) {
        logImportError(194, "GRADED", gradedFileBis194.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess194) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00194 (normal)");
}

// Import plan GRADED 00195
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195.mov");
var gradedFilePoignees195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195_AVEC_POIGNEES.mov");
var gradedFileBis195 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00195bis.mov");

var gradedImportSuccess195 = false;
var gradedFileName195 = "";

// Tenter import standard
if (gradedFile195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFile195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195";
        gradingSources[195] = gradedFootage195;
        gradedFileName195 = "UNDLM_00195.mov";
        gradedImportSuccess195 = true;
        gradingImportCount++;
        logImportSuccess(195, "GRADED", gradedFile195.fsName, gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED", gradedFile195.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess195 && gradedFilePoignees195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFilePoignees195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195";
        gradingSources[195] = gradedFootage195;
        gradedFileName195 = "UNDLM_00195_AVEC_POIGNEES.mov";
        gradedImportSuccess195 = true;
        gradingImportCount++;
        logImportSuccess(195, "GRADED", gradedFilePoignees195.fsName, gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED", gradedFilePoignees195.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess195 && gradedFileBis195.exists) {
    try {
        var gradedFootage195 = project.importFile(new ImportOptions(gradedFileBis195));
        gradedFootage195.parentFolder = fromGradingFolder;
        gradedFootage195.name = "UNDLM_00195";
        gradingSources[195] = gradedFootage195;
        gradedFileName195 = "UNDLM_00195bis.mov";
        gradedImportSuccess195 = true;
        gradingImportCount++;
        logImportSuccess(195, "GRADED", gradedFileBis195.fsName, gradedFileName195);
    } catch (e) {
        logImportError(195, "GRADED", gradedFileBis195.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess195) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00195 (normal)");
}

// Import plan GRADED 00196
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196.mov");
var gradedFilePoignees196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196_AVEC_POIGNEES.mov");
var gradedFileBis196 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00196bis.mov");

var gradedImportSuccess196 = false;
var gradedFileName196 = "";

// Tenter import standard
if (gradedFile196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFile196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196";
        gradingSources[196] = gradedFootage196;
        gradedFileName196 = "UNDLM_00196.mov";
        gradedImportSuccess196 = true;
        gradingImportCount++;
        logImportSuccess(196, "GRADED", gradedFile196.fsName, gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED", gradedFile196.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess196 && gradedFilePoignees196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFilePoignees196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196";
        gradingSources[196] = gradedFootage196;
        gradedFileName196 = "UNDLM_00196_AVEC_POIGNEES.mov";
        gradedImportSuccess196 = true;
        gradingImportCount++;
        logImportSuccess(196, "GRADED", gradedFilePoignees196.fsName, gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED", gradedFilePoignees196.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess196 && gradedFileBis196.exists) {
    try {
        var gradedFootage196 = project.importFile(new ImportOptions(gradedFileBis196));
        gradedFootage196.parentFolder = fromGradingFolder;
        gradedFootage196.name = "UNDLM_00196";
        gradingSources[196] = gradedFootage196;
        gradedFileName196 = "UNDLM_00196bis.mov";
        gradedImportSuccess196 = true;
        gradingImportCount++;
        logImportSuccess(196, "GRADED", gradedFileBis196.fsName, gradedFileName196);
    } catch (e) {
        logImportError(196, "GRADED", gradedFileBis196.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess196) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00196 (normal)");
}

// Import plan GRADED 00197
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197.mov");
var gradedFilePoignees197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197_AVEC_POIGNEES.mov");
var gradedFileBis197 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00197bis.mov");

var gradedImportSuccess197 = false;
var gradedFileName197 = "";

// Tenter import standard
if (gradedFile197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFile197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197";
        gradingSources[197] = gradedFootage197;
        gradedFileName197 = "UNDLM_00197.mov";
        gradedImportSuccess197 = true;
        gradingImportCount++;
        logImportSuccess(197, "GRADED", gradedFile197.fsName, gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED", gradedFile197.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess197 && gradedFilePoignees197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFilePoignees197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197";
        gradingSources[197] = gradedFootage197;
        gradedFileName197 = "UNDLM_00197_AVEC_POIGNEES.mov";
        gradedImportSuccess197 = true;
        gradingImportCount++;
        logImportSuccess(197, "GRADED", gradedFilePoignees197.fsName, gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED", gradedFilePoignees197.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess197 && gradedFileBis197.exists) {
    try {
        var gradedFootage197 = project.importFile(new ImportOptions(gradedFileBis197));
        gradedFootage197.parentFolder = fromGradingFolder;
        gradedFootage197.name = "UNDLM_00197";
        gradingSources[197] = gradedFootage197;
        gradedFileName197 = "UNDLM_00197bis.mov";
        gradedImportSuccess197 = true;
        gradingImportCount++;
        logImportSuccess(197, "GRADED", gradedFileBis197.fsName, gradedFileName197);
    } catch (e) {
        logImportError(197, "GRADED", gradedFileBis197.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess197) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00197 (normal)");
}

// Import plan GRADED 00198
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198.mov");
var gradedFilePoignees198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198_AVEC_POIGNEES.mov");
var gradedFileBis198 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00198bis.mov");

var gradedImportSuccess198 = false;
var gradedFileName198 = "";

// Tenter import standard
if (gradedFile198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFile198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198";
        gradingSources[198] = gradedFootage198;
        gradedFileName198 = "UNDLM_00198.mov";
        gradedImportSuccess198 = true;
        gradingImportCount++;
        logImportSuccess(198, "GRADED", gradedFile198.fsName, gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED", gradedFile198.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess198 && gradedFilePoignees198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFilePoignees198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198";
        gradingSources[198] = gradedFootage198;
        gradedFileName198 = "UNDLM_00198_AVEC_POIGNEES.mov";
        gradedImportSuccess198 = true;
        gradingImportCount++;
        logImportSuccess(198, "GRADED", gradedFilePoignees198.fsName, gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED", gradedFilePoignees198.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess198 && gradedFileBis198.exists) {
    try {
        var gradedFootage198 = project.importFile(new ImportOptions(gradedFileBis198));
        gradedFootage198.parentFolder = fromGradingFolder;
        gradedFootage198.name = "UNDLM_00198";
        gradingSources[198] = gradedFootage198;
        gradedFileName198 = "UNDLM_00198bis.mov";
        gradedImportSuccess198 = true;
        gradingImportCount++;
        logImportSuccess(198, "GRADED", gradedFileBis198.fsName, gradedFileName198);
    } catch (e) {
        logImportError(198, "GRADED", gradedFileBis198.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess198) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00198 (normal)");
}

// Import plan GRADED 00199
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199.mov");
var gradedFilePoignees199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199_AVEC_POIGNEES.mov");
var gradedFileBis199 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00199bis.mov");

var gradedImportSuccess199 = false;
var gradedFileName199 = "";

// Tenter import standard
if (gradedFile199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFile199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199";
        gradingSources[199] = gradedFootage199;
        gradedFileName199 = "UNDLM_00199.mov";
        gradedImportSuccess199 = true;
        gradingImportCount++;
        logImportSuccess(199, "GRADED", gradedFile199.fsName, gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED", gradedFile199.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess199 && gradedFilePoignees199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFilePoignees199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199";
        gradingSources[199] = gradedFootage199;
        gradedFileName199 = "UNDLM_00199_AVEC_POIGNEES.mov";
        gradedImportSuccess199 = true;
        gradingImportCount++;
        logImportSuccess(199, "GRADED", gradedFilePoignees199.fsName, gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED", gradedFilePoignees199.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess199 && gradedFileBis199.exists) {
    try {
        var gradedFootage199 = project.importFile(new ImportOptions(gradedFileBis199));
        gradedFootage199.parentFolder = fromGradingFolder;
        gradedFootage199.name = "UNDLM_00199";
        gradingSources[199] = gradedFootage199;
        gradedFileName199 = "UNDLM_00199bis.mov";
        gradedImportSuccess199 = true;
        gradingImportCount++;
        logImportSuccess(199, "GRADED", gradedFileBis199.fsName, gradedFileName199);
    } catch (e) {
        logImportError(199, "GRADED", gradedFileBis199.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess199) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00199 (normal)");
}

// Import plan GRADED 00200
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200.mov");
var gradedFilePoignees200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200_AVEC_POIGNEES.mov");
var gradedFileBis200 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00200bis.mov");

var gradedImportSuccess200 = false;
var gradedFileName200 = "";

// Tenter import standard
if (gradedFile200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFile200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200";
        gradingSources[200] = gradedFootage200;
        gradedFileName200 = "UNDLM_00200.mov";
        gradedImportSuccess200 = true;
        gradingImportCount++;
        logImportSuccess(200, "GRADED", gradedFile200.fsName, gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED", gradedFile200.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess200 && gradedFilePoignees200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFilePoignees200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200";
        gradingSources[200] = gradedFootage200;
        gradedFileName200 = "UNDLM_00200_AVEC_POIGNEES.mov";
        gradedImportSuccess200 = true;
        gradingImportCount++;
        logImportSuccess(200, "GRADED", gradedFilePoignees200.fsName, gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED", gradedFilePoignees200.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess200 && gradedFileBis200.exists) {
    try {
        var gradedFootage200 = project.importFile(new ImportOptions(gradedFileBis200));
        gradedFootage200.parentFolder = fromGradingFolder;
        gradedFootage200.name = "UNDLM_00200";
        gradingSources[200] = gradedFootage200;
        gradedFileName200 = "UNDLM_00200bis.mov";
        gradedImportSuccess200 = true;
        gradingImportCount++;
        logImportSuccess(200, "GRADED", gradedFileBis200.fsName, gradedFileName200);
    } catch (e) {
        logImportError(200, "GRADED", gradedFileBis200.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess200) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00200 (normal)");
}

// Import plan GRADED 00201
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201.mov");
var gradedFilePoignees201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201_AVEC_POIGNEES.mov");
var gradedFileBis201 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00201bis.mov");

var gradedImportSuccess201 = false;
var gradedFileName201 = "";

// Tenter import standard
if (gradedFile201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFile201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201";
        gradingSources[201] = gradedFootage201;
        gradedFileName201 = "UNDLM_00201.mov";
        gradedImportSuccess201 = true;
        gradingImportCount++;
        logImportSuccess(201, "GRADED", gradedFile201.fsName, gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED", gradedFile201.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess201 && gradedFilePoignees201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFilePoignees201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201";
        gradingSources[201] = gradedFootage201;
        gradedFileName201 = "UNDLM_00201_AVEC_POIGNEES.mov";
        gradedImportSuccess201 = true;
        gradingImportCount++;
        logImportSuccess(201, "GRADED", gradedFilePoignees201.fsName, gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED", gradedFilePoignees201.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess201 && gradedFileBis201.exists) {
    try {
        var gradedFootage201 = project.importFile(new ImportOptions(gradedFileBis201));
        gradedFootage201.parentFolder = fromGradingFolder;
        gradedFootage201.name = "UNDLM_00201";
        gradingSources[201] = gradedFootage201;
        gradedFileName201 = "UNDLM_00201bis.mov";
        gradedImportSuccess201 = true;
        gradingImportCount++;
        logImportSuccess(201, "GRADED", gradedFileBis201.fsName, gradedFileName201);
    } catch (e) {
        logImportError(201, "GRADED", gradedFileBis201.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess201) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00201 (normal)");
}

// Import plan GRADED 00212
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212.mov");
var gradedFilePoignees212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212_AVEC_POIGNEES.mov");
var gradedFileBis212 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00212bis.mov");

var gradedImportSuccess212 = false;
var gradedFileName212 = "";

// Tenter import standard
if (gradedFile212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFile212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212";
        gradingSources[212] = gradedFootage212;
        gradedFileName212 = "UNDLM_00212.mov";
        gradedImportSuccess212 = true;
        gradingImportCount++;
        logImportSuccess(212, "GRADED", gradedFile212.fsName, gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED", gradedFile212.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess212 && gradedFilePoignees212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFilePoignees212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212";
        gradingSources[212] = gradedFootage212;
        gradedFileName212 = "UNDLM_00212_AVEC_POIGNEES.mov";
        gradedImportSuccess212 = true;
        gradingImportCount++;
        logImportSuccess(212, "GRADED", gradedFilePoignees212.fsName, gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED", gradedFilePoignees212.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess212 && gradedFileBis212.exists) {
    try {
        var gradedFootage212 = project.importFile(new ImportOptions(gradedFileBis212));
        gradedFootage212.parentFolder = fromGradingFolder;
        gradedFootage212.name = "UNDLM_00212";
        gradingSources[212] = gradedFootage212;
        gradedFileName212 = "UNDLM_00212bis.mov";
        gradedImportSuccess212 = true;
        gradingImportCount++;
        logImportSuccess(212, "GRADED", gradedFileBis212.fsName, gradedFileName212);
    } catch (e) {
        logImportError(212, "GRADED", gradedFileBis212.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess212) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00212 (normal)");
}

// Import plan GRADED 00213
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213.mov");
var gradedFilePoignees213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213_AVEC_POIGNEES.mov");
var gradedFileBis213 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00213bis.mov");

var gradedImportSuccess213 = false;
var gradedFileName213 = "";

// Tenter import standard
if (gradedFile213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFile213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213";
        gradingSources[213] = gradedFootage213;
        gradedFileName213 = "UNDLM_00213.mov";
        gradedImportSuccess213 = true;
        gradingImportCount++;
        logImportSuccess(213, "GRADED", gradedFile213.fsName, gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED", gradedFile213.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess213 && gradedFilePoignees213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFilePoignees213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213";
        gradingSources[213] = gradedFootage213;
        gradedFileName213 = "UNDLM_00213_AVEC_POIGNEES.mov";
        gradedImportSuccess213 = true;
        gradingImportCount++;
        logImportSuccess(213, "GRADED", gradedFilePoignees213.fsName, gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED", gradedFilePoignees213.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess213 && gradedFileBis213.exists) {
    try {
        var gradedFootage213 = project.importFile(new ImportOptions(gradedFileBis213));
        gradedFootage213.parentFolder = fromGradingFolder;
        gradedFootage213.name = "UNDLM_00213";
        gradingSources[213] = gradedFootage213;
        gradedFileName213 = "UNDLM_00213bis.mov";
        gradedImportSuccess213 = true;
        gradingImportCount++;
        logImportSuccess(213, "GRADED", gradedFileBis213.fsName, gradedFileName213);
    } catch (e) {
        logImportError(213, "GRADED", gradedFileBis213.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess213) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00213 (normal)");
}

// Import plan GRADED 00215
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215.mov");
var gradedFilePoignees215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215_AVEC_POIGNEES.mov");
var gradedFileBis215 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00215bis.mov");

var gradedImportSuccess215 = false;
var gradedFileName215 = "";

// Tenter import standard
if (gradedFile215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFile215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215";
        gradingSources[215] = gradedFootage215;
        gradedFileName215 = "UNDLM_00215.mov";
        gradedImportSuccess215 = true;
        gradingImportCount++;
        logImportSuccess(215, "GRADED", gradedFile215.fsName, gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED", gradedFile215.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess215 && gradedFilePoignees215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFilePoignees215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215";
        gradingSources[215] = gradedFootage215;
        gradedFileName215 = "UNDLM_00215_AVEC_POIGNEES.mov";
        gradedImportSuccess215 = true;
        gradingImportCount++;
        logImportSuccess(215, "GRADED", gradedFilePoignees215.fsName, gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED", gradedFilePoignees215.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess215 && gradedFileBis215.exists) {
    try {
        var gradedFootage215 = project.importFile(new ImportOptions(gradedFileBis215));
        gradedFootage215.parentFolder = fromGradingFolder;
        gradedFootage215.name = "UNDLM_00215";
        gradingSources[215] = gradedFootage215;
        gradedFileName215 = "UNDLM_00215bis.mov";
        gradedImportSuccess215 = true;
        gradingImportCount++;
        logImportSuccess(215, "GRADED", gradedFileBis215.fsName, gradedFileName215);
    } catch (e) {
        logImportError(215, "GRADED", gradedFileBis215.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess215) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00215 (normal)");
}

// Import plan GRADED 00216
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216.mov");
var gradedFilePoignees216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216_AVEC_POIGNEES.mov");
var gradedFileBis216 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00216bis.mov");

var gradedImportSuccess216 = false;
var gradedFileName216 = "";

// Tenter import standard
if (gradedFile216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFile216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216";
        gradingSources[216] = gradedFootage216;
        gradedFileName216 = "UNDLM_00216.mov";
        gradedImportSuccess216 = true;
        gradingImportCount++;
        logImportSuccess(216, "GRADED", gradedFile216.fsName, gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED", gradedFile216.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess216 && gradedFilePoignees216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFilePoignees216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216";
        gradingSources[216] = gradedFootage216;
        gradedFileName216 = "UNDLM_00216_AVEC_POIGNEES.mov";
        gradedImportSuccess216 = true;
        gradingImportCount++;
        logImportSuccess(216, "GRADED", gradedFilePoignees216.fsName, gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED", gradedFilePoignees216.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess216 && gradedFileBis216.exists) {
    try {
        var gradedFootage216 = project.importFile(new ImportOptions(gradedFileBis216));
        gradedFootage216.parentFolder = fromGradingFolder;
        gradedFootage216.name = "UNDLM_00216";
        gradingSources[216] = gradedFootage216;
        gradedFileName216 = "UNDLM_00216bis.mov";
        gradedImportSuccess216 = true;
        gradingImportCount++;
        logImportSuccess(216, "GRADED", gradedFileBis216.fsName, gradedFileName216);
    } catch (e) {
        logImportError(216, "GRADED", gradedFileBis216.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess216) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00216 (normal)");
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
        gradedFileName251 = "UNDLM_00251.mov";
        gradedImportSuccess251 = true;
        gradingImportCount++;
        logImportSuccess(251, "GRADED", gradedFile251.fsName, gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED", gradedFile251.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess251 && gradedFilePoignees251.exists) {
    try {
        var gradedFootage251 = project.importFile(new ImportOptions(gradedFilePoignees251));
        gradedFootage251.parentFolder = fromGradingFolder;
        gradedFootage251.name = "UNDLM_00251";
        gradingSources[251] = gradedFootage251;
        gradedFileName251 = "UNDLM_00251_AVEC_POIGNEES.mov";
        gradedImportSuccess251 = true;
        gradingImportCount++;
        logImportSuccess(251, "GRADED", gradedFilePoignees251.fsName, gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED", gradedFilePoignees251.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess251 && gradedFileBis251.exists) {
    try {
        var gradedFootage251 = project.importFile(new ImportOptions(gradedFileBis251));
        gradedFootage251.parentFolder = fromGradingFolder;
        gradedFootage251.name = "UNDLM_00251";
        gradingSources[251] = gradedFootage251;
        gradedFileName251 = "UNDLM_00251bis.mov";
        gradedImportSuccess251 = true;
        gradingImportCount++;
        logImportSuccess(251, "GRADED", gradedFileBis251.fsName, gradedFileName251);
    } catch (e) {
        logImportError(251, "GRADED", gradedFileBis251.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess251) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00251 (normal)");
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
        gradedFileName252 = "UNDLM_00252.mov";
        gradedImportSuccess252 = true;
        gradingImportCount++;
        logImportSuccess(252, "GRADED", gradedFile252.fsName, gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED", gradedFile252.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess252 && gradedFilePoignees252.exists) {
    try {
        var gradedFootage252 = project.importFile(new ImportOptions(gradedFilePoignees252));
        gradedFootage252.parentFolder = fromGradingFolder;
        gradedFootage252.name = "UNDLM_00252";
        gradingSources[252] = gradedFootage252;
        gradedFileName252 = "UNDLM_00252_AVEC_POIGNEES.mov";
        gradedImportSuccess252 = true;
        gradingImportCount++;
        logImportSuccess(252, "GRADED", gradedFilePoignees252.fsName, gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED", gradedFilePoignees252.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess252 && gradedFileBis252.exists) {
    try {
        var gradedFootage252 = project.importFile(new ImportOptions(gradedFileBis252));
        gradedFootage252.parentFolder = fromGradingFolder;
        gradedFootage252.name = "UNDLM_00252";
        gradingSources[252] = gradedFootage252;
        gradedFileName252 = "UNDLM_00252bis.mov";
        gradedImportSuccess252 = true;
        gradingImportCount++;
        logImportSuccess(252, "GRADED", gradedFileBis252.fsName, gradedFileName252);
    } catch (e) {
        logImportError(252, "GRADED", gradedFileBis252.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess252) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00252 (normal)");
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
        gradedFileName254 = "UNDLM_00254.mov";
        gradedImportSuccess254 = true;
        gradingImportCount++;
        logImportSuccess(254, "GRADED", gradedFile254.fsName, gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED", gradedFile254.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess254 && gradedFilePoignees254.exists) {
    try {
        var gradedFootage254 = project.importFile(new ImportOptions(gradedFilePoignees254));
        gradedFootage254.parentFolder = fromGradingFolder;
        gradedFootage254.name = "UNDLM_00254";
        gradingSources[254] = gradedFootage254;
        gradedFileName254 = "UNDLM_00254_AVEC_POIGNEES.mov";
        gradedImportSuccess254 = true;
        gradingImportCount++;
        logImportSuccess(254, "GRADED", gradedFilePoignees254.fsName, gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED", gradedFilePoignees254.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess254 && gradedFileBis254.exists) {
    try {
        var gradedFootage254 = project.importFile(new ImportOptions(gradedFileBis254));
        gradedFootage254.parentFolder = fromGradingFolder;
        gradedFootage254.name = "UNDLM_00254";
        gradingSources[254] = gradedFootage254;
        gradedFileName254 = "UNDLM_00254bis.mov";
        gradedImportSuccess254 = true;
        gradingImportCount++;
        logImportSuccess(254, "GRADED", gradedFileBis254.fsName, gradedFileName254);
    } catch (e) {
        logImportError(254, "GRADED", gradedFileBis254.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess254) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00254 (normal)");
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
        gradedFileName255 = "UNDLM_00255.mov";
        gradedImportSuccess255 = true;
        gradingImportCount++;
        logImportSuccess(255, "GRADED", gradedFile255.fsName, gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED", gradedFile255.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess255 && gradedFilePoignees255.exists) {
    try {
        var gradedFootage255 = project.importFile(new ImportOptions(gradedFilePoignees255));
        gradedFootage255.parentFolder = fromGradingFolder;
        gradedFootage255.name = "UNDLM_00255";
        gradingSources[255] = gradedFootage255;
        gradedFileName255 = "UNDLM_00255_AVEC_POIGNEES.mov";
        gradedImportSuccess255 = true;
        gradingImportCount++;
        logImportSuccess(255, "GRADED", gradedFilePoignees255.fsName, gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED", gradedFilePoignees255.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess255 && gradedFileBis255.exists) {
    try {
        var gradedFootage255 = project.importFile(new ImportOptions(gradedFileBis255));
        gradedFootage255.parentFolder = fromGradingFolder;
        gradedFootage255.name = "UNDLM_00255";
        gradingSources[255] = gradedFootage255;
        gradedFileName255 = "UNDLM_00255bis.mov";
        gradedImportSuccess255 = true;
        gradingImportCount++;
        logImportSuccess(255, "GRADED", gradedFileBis255.fsName, gradedFileName255);
    } catch (e) {
        logImportError(255, "GRADED", gradedFileBis255.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess255) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00255 (normal)");
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
        gradedFileName256 = "UNDLM_00256.mov";
        gradedImportSuccess256 = true;
        gradingImportCount++;
        logImportSuccess(256, "GRADED", gradedFile256.fsName, gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED", gradedFile256.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess256 && gradedFilePoignees256.exists) {
    try {
        var gradedFootage256 = project.importFile(new ImportOptions(gradedFilePoignees256));
        gradedFootage256.parentFolder = fromGradingFolder;
        gradedFootage256.name = "UNDLM_00256";
        gradingSources[256] = gradedFootage256;
        gradedFileName256 = "UNDLM_00256_AVEC_POIGNEES.mov";
        gradedImportSuccess256 = true;
        gradingImportCount++;
        logImportSuccess(256, "GRADED", gradedFilePoignees256.fsName, gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED", gradedFilePoignees256.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess256 && gradedFileBis256.exists) {
    try {
        var gradedFootage256 = project.importFile(new ImportOptions(gradedFileBis256));
        gradedFootage256.parentFolder = fromGradingFolder;
        gradedFootage256.name = "UNDLM_00256";
        gradingSources[256] = gradedFootage256;
        gradedFileName256 = "UNDLM_00256bis.mov";
        gradedImportSuccess256 = true;
        gradingImportCount++;
        logImportSuccess(256, "GRADED", gradedFileBis256.fsName, gradedFileName256);
    } catch (e) {
        logImportError(256, "GRADED", gradedFileBis256.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess256) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00256 (normal)");
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
        gradedFileName262 = "UNDLM_00262.mov";
        gradedImportSuccess262 = true;
        gradingImportCount++;
        logImportSuccess(262, "GRADED", gradedFile262.fsName, gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED", gradedFile262.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess262 && gradedFilePoignees262.exists) {
    try {
        var gradedFootage262 = project.importFile(new ImportOptions(gradedFilePoignees262));
        gradedFootage262.parentFolder = fromGradingFolder;
        gradedFootage262.name = "UNDLM_00262";
        gradingSources[262] = gradedFootage262;
        gradedFileName262 = "UNDLM_00262_AVEC_POIGNEES.mov";
        gradedImportSuccess262 = true;
        gradingImportCount++;
        logImportSuccess(262, "GRADED", gradedFilePoignees262.fsName, gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED", gradedFilePoignees262.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess262 && gradedFileBis262.exists) {
    try {
        var gradedFootage262 = project.importFile(new ImportOptions(gradedFileBis262));
        gradedFootage262.parentFolder = fromGradingFolder;
        gradedFootage262.name = "UNDLM_00262";
        gradingSources[262] = gradedFootage262;
        gradedFileName262 = "UNDLM_00262bis.mov";
        gradedImportSuccess262 = true;
        gradingImportCount++;
        logImportSuccess(262, "GRADED", gradedFileBis262.fsName, gradedFileName262);
    } catch (e) {
        logImportError(262, "GRADED", gradedFileBis262.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess262) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00262 (normal)");
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
        gradedFileName263 = "UNDLM_00263.mov";
        gradedImportSuccess263 = true;
        gradingImportCount++;
        logImportSuccess(263, "GRADED", gradedFile263.fsName, gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED", gradedFile263.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess263 && gradedFilePoignees263.exists) {
    try {
        var gradedFootage263 = project.importFile(new ImportOptions(gradedFilePoignees263));
        gradedFootage263.parentFolder = fromGradingFolder;
        gradedFootage263.name = "UNDLM_00263";
        gradingSources[263] = gradedFootage263;
        gradedFileName263 = "UNDLM_00263_AVEC_POIGNEES.mov";
        gradedImportSuccess263 = true;
        gradingImportCount++;
        logImportSuccess(263, "GRADED", gradedFilePoignees263.fsName, gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED", gradedFilePoignees263.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess263 && gradedFileBis263.exists) {
    try {
        var gradedFootage263 = project.importFile(new ImportOptions(gradedFileBis263));
        gradedFootage263.parentFolder = fromGradingFolder;
        gradedFootage263.name = "UNDLM_00263";
        gradingSources[263] = gradedFootage263;
        gradedFileName263 = "UNDLM_00263bis.mov";
        gradedImportSuccess263 = true;
        gradingImportCount++;
        logImportSuccess(263, "GRADED", gradedFileBis263.fsName, gradedFileName263);
    } catch (e) {
        logImportError(263, "GRADED", gradedFileBis263.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess263) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00263 (normal)");
}

// Import plan GRADED 00275
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275.mov");
var gradedFilePoignees275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275_AVEC_POIGNEES.mov");
var gradedFileBis275 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00275bis.mov");

var gradedImportSuccess275 = false;
var gradedFileName275 = "";

// Tenter import standard
if (gradedFile275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFile275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275";
        gradingSources[275] = gradedFootage275;
        gradedFileName275 = "UNDLM_00275.mov";
        gradedImportSuccess275 = true;
        gradingImportCount++;
        logImportSuccess(275, "GRADED", gradedFile275.fsName, gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED", gradedFile275.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess275 && gradedFilePoignees275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFilePoignees275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275";
        gradingSources[275] = gradedFootage275;
        gradedFileName275 = "UNDLM_00275_AVEC_POIGNEES.mov";
        gradedImportSuccess275 = true;
        gradingImportCount++;
        logImportSuccess(275, "GRADED", gradedFilePoignees275.fsName, gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED", gradedFilePoignees275.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess275 && gradedFileBis275.exists) {
    try {
        var gradedFootage275 = project.importFile(new ImportOptions(gradedFileBis275));
        gradedFootage275.parentFolder = fromGradingFolder;
        gradedFootage275.name = "UNDLM_00275";
        gradingSources[275] = gradedFootage275;
        gradedFileName275 = "UNDLM_00275bis.mov";
        gradedImportSuccess275 = true;
        gradingImportCount++;
        logImportSuccess(275, "GRADED", gradedFileBis275.fsName, gradedFileName275);
    } catch (e) {
        logImportError(275, "GRADED", gradedFileBis275.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess275) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00275 (normal)");
}

// Import plan GRADED 00276
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276.mov");
var gradedFilePoignees276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276_AVEC_POIGNEES.mov");
var gradedFileBis276 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00276bis.mov");

var gradedImportSuccess276 = false;
var gradedFileName276 = "";

// Tenter import standard
if (gradedFile276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFile276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276";
        gradingSources[276] = gradedFootage276;
        gradedFileName276 = "UNDLM_00276.mov";
        gradedImportSuccess276 = true;
        gradingImportCount++;
        logImportSuccess(276, "GRADED", gradedFile276.fsName, gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED", gradedFile276.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess276 && gradedFilePoignees276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFilePoignees276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276";
        gradingSources[276] = gradedFootage276;
        gradedFileName276 = "UNDLM_00276_AVEC_POIGNEES.mov";
        gradedImportSuccess276 = true;
        gradingImportCount++;
        logImportSuccess(276, "GRADED", gradedFilePoignees276.fsName, gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED", gradedFilePoignees276.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess276 && gradedFileBis276.exists) {
    try {
        var gradedFootage276 = project.importFile(new ImportOptions(gradedFileBis276));
        gradedFootage276.parentFolder = fromGradingFolder;
        gradedFootage276.name = "UNDLM_00276";
        gradingSources[276] = gradedFootage276;
        gradedFileName276 = "UNDLM_00276bis.mov";
        gradedImportSuccess276 = true;
        gradingImportCount++;
        logImportSuccess(276, "GRADED", gradedFileBis276.fsName, gradedFileName276);
    } catch (e) {
        logImportError(276, "GRADED", gradedFileBis276.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess276) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00276 (normal)");
}

// Import plan GRADED 00277
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277.mov");
var gradedFilePoignees277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277_AVEC_POIGNEES.mov");
var gradedFileBis277 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00277bis.mov");

var gradedImportSuccess277 = false;
var gradedFileName277 = "";

// Tenter import standard
if (gradedFile277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFile277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277";
        gradingSources[277] = gradedFootage277;
        gradedFileName277 = "UNDLM_00277.mov";
        gradedImportSuccess277 = true;
        gradingImportCount++;
        logImportSuccess(277, "GRADED", gradedFile277.fsName, gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED", gradedFile277.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess277 && gradedFilePoignees277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFilePoignees277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277";
        gradingSources[277] = gradedFootage277;
        gradedFileName277 = "UNDLM_00277_AVEC_POIGNEES.mov";
        gradedImportSuccess277 = true;
        gradingImportCount++;
        logImportSuccess(277, "GRADED", gradedFilePoignees277.fsName, gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED", gradedFilePoignees277.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess277 && gradedFileBis277.exists) {
    try {
        var gradedFootage277 = project.importFile(new ImportOptions(gradedFileBis277));
        gradedFootage277.parentFolder = fromGradingFolder;
        gradedFootage277.name = "UNDLM_00277";
        gradingSources[277] = gradedFootage277;
        gradedFileName277 = "UNDLM_00277bis.mov";
        gradedImportSuccess277 = true;
        gradingImportCount++;
        logImportSuccess(277, "GRADED", gradedFileBis277.fsName, gradedFileName277);
    } catch (e) {
        logImportError(277, "GRADED", gradedFileBis277.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess277) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00277 (normal)");
}

// Import plan GRADED 00279
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279.mov");
var gradedFilePoignees279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279_AVEC_POIGNEES.mov");
var gradedFileBis279 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00279bis.mov");

var gradedImportSuccess279 = false;
var gradedFileName279 = "";

// Tenter import standard
if (gradedFile279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFile279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279";
        gradingSources[279] = gradedFootage279;
        gradedFileName279 = "UNDLM_00279.mov";
        gradedImportSuccess279 = true;
        gradingImportCount++;
        logImportSuccess(279, "GRADED", gradedFile279.fsName, gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED", gradedFile279.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess279 && gradedFilePoignees279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFilePoignees279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279";
        gradingSources[279] = gradedFootage279;
        gradedFileName279 = "UNDLM_00279_AVEC_POIGNEES.mov";
        gradedImportSuccess279 = true;
        gradingImportCount++;
        logImportSuccess(279, "GRADED", gradedFilePoignees279.fsName, gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED", gradedFilePoignees279.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess279 && gradedFileBis279.exists) {
    try {
        var gradedFootage279 = project.importFile(new ImportOptions(gradedFileBis279));
        gradedFootage279.parentFolder = fromGradingFolder;
        gradedFootage279.name = "UNDLM_00279";
        gradingSources[279] = gradedFootage279;
        gradedFileName279 = "UNDLM_00279bis.mov";
        gradedImportSuccess279 = true;
        gradingImportCount++;
        logImportSuccess(279, "GRADED", gradedFileBis279.fsName, gradedFileName279);
    } catch (e) {
        logImportError(279, "GRADED", gradedFileBis279.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess279) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00279 (normal)");
}

// Import plan GRADED 00280
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280.mov");
var gradedFilePoignees280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280_AVEC_POIGNEES.mov");
var gradedFileBis280 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00280bis.mov");

var gradedImportSuccess280 = false;
var gradedFileName280 = "";

// Tenter import standard
if (gradedFile280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFile280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280";
        gradingSources[280] = gradedFootage280;
        gradedFileName280 = "UNDLM_00280.mov";
        gradedImportSuccess280 = true;
        gradingImportCount++;
        logImportSuccess(280, "GRADED", gradedFile280.fsName, gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED", gradedFile280.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess280 && gradedFilePoignees280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFilePoignees280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280";
        gradingSources[280] = gradedFootage280;
        gradedFileName280 = "UNDLM_00280_AVEC_POIGNEES.mov";
        gradedImportSuccess280 = true;
        gradingImportCount++;
        logImportSuccess(280, "GRADED", gradedFilePoignees280.fsName, gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED", gradedFilePoignees280.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess280 && gradedFileBis280.exists) {
    try {
        var gradedFootage280 = project.importFile(new ImportOptions(gradedFileBis280));
        gradedFootage280.parentFolder = fromGradingFolder;
        gradedFootage280.name = "UNDLM_00280";
        gradingSources[280] = gradedFootage280;
        gradedFileName280 = "UNDLM_00280bis.mov";
        gradedImportSuccess280 = true;
        gradingImportCount++;
        logImportSuccess(280, "GRADED", gradedFileBis280.fsName, gradedFileName280);
    } catch (e) {
        logImportError(280, "GRADED", gradedFileBis280.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess280) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00280 (normal)");
}

// Import plan GRADED 00282
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282.mov");
var gradedFilePoignees282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282_AVEC_POIGNEES.mov");
var gradedFileBis282 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00282bis.mov");

var gradedImportSuccess282 = false;
var gradedFileName282 = "";

// Tenter import standard
if (gradedFile282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFile282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282";
        gradingSources[282] = gradedFootage282;
        gradedFileName282 = "UNDLM_00282.mov";
        gradedImportSuccess282 = true;
        gradingImportCount++;
        logImportSuccess(282, "GRADED", gradedFile282.fsName, gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED", gradedFile282.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess282 && gradedFilePoignees282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFilePoignees282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282";
        gradingSources[282] = gradedFootage282;
        gradedFileName282 = "UNDLM_00282_AVEC_POIGNEES.mov";
        gradedImportSuccess282 = true;
        gradingImportCount++;
        logImportSuccess(282, "GRADED", gradedFilePoignees282.fsName, gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED", gradedFilePoignees282.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess282 && gradedFileBis282.exists) {
    try {
        var gradedFootage282 = project.importFile(new ImportOptions(gradedFileBis282));
        gradedFootage282.parentFolder = fromGradingFolder;
        gradedFootage282.name = "UNDLM_00282";
        gradingSources[282] = gradedFootage282;
        gradedFileName282 = "UNDLM_00282bis.mov";
        gradedImportSuccess282 = true;
        gradingImportCount++;
        logImportSuccess(282, "GRADED", gradedFileBis282.fsName, gradedFileName282);
    } catch (e) {
        logImportError(282, "GRADED", gradedFileBis282.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess282) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00282 (normal)");
}

// Import plan GRADED 00283
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283.mov");
var gradedFilePoignees283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283_AVEC_POIGNEES.mov");
var gradedFileBis283 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00283bis.mov");

var gradedImportSuccess283 = false;
var gradedFileName283 = "";

// Tenter import standard
if (gradedFile283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFile283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283";
        gradingSources[283] = gradedFootage283;
        gradedFileName283 = "UNDLM_00283.mov";
        gradedImportSuccess283 = true;
        gradingImportCount++;
        logImportSuccess(283, "GRADED", gradedFile283.fsName, gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED", gradedFile283.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess283 && gradedFilePoignees283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFilePoignees283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283";
        gradingSources[283] = gradedFootage283;
        gradedFileName283 = "UNDLM_00283_AVEC_POIGNEES.mov";
        gradedImportSuccess283 = true;
        gradingImportCount++;
        logImportSuccess(283, "GRADED", gradedFilePoignees283.fsName, gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED", gradedFilePoignees283.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess283 && gradedFileBis283.exists) {
    try {
        var gradedFootage283 = project.importFile(new ImportOptions(gradedFileBis283));
        gradedFootage283.parentFolder = fromGradingFolder;
        gradedFootage283.name = "UNDLM_00283";
        gradingSources[283] = gradedFootage283;
        gradedFileName283 = "UNDLM_00283bis.mov";
        gradedImportSuccess283 = true;
        gradingImportCount++;
        logImportSuccess(283, "GRADED", gradedFileBis283.fsName, gradedFileName283);
    } catch (e) {
        logImportError(283, "GRADED", gradedFileBis283.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess283) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00283 (normal)");
}

// Import plan GRADED 00285
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285.mov");
var gradedFilePoignees285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285_AVEC_POIGNEES.mov");
var gradedFileBis285 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00285bis.mov");

var gradedImportSuccess285 = false;
var gradedFileName285 = "";

// Tenter import standard
if (gradedFile285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFile285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285";
        gradingSources[285] = gradedFootage285;
        gradedFileName285 = "UNDLM_00285.mov";
        gradedImportSuccess285 = true;
        gradingImportCount++;
        logImportSuccess(285, "GRADED", gradedFile285.fsName, gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED", gradedFile285.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess285 && gradedFilePoignees285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFilePoignees285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285";
        gradingSources[285] = gradedFootage285;
        gradedFileName285 = "UNDLM_00285_AVEC_POIGNEES.mov";
        gradedImportSuccess285 = true;
        gradingImportCount++;
        logImportSuccess(285, "GRADED", gradedFilePoignees285.fsName, gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED", gradedFilePoignees285.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess285 && gradedFileBis285.exists) {
    try {
        var gradedFootage285 = project.importFile(new ImportOptions(gradedFileBis285));
        gradedFootage285.parentFolder = fromGradingFolder;
        gradedFootage285.name = "UNDLM_00285";
        gradingSources[285] = gradedFootage285;
        gradedFileName285 = "UNDLM_00285bis.mov";
        gradedImportSuccess285 = true;
        gradingImportCount++;
        logImportSuccess(285, "GRADED", gradedFileBis285.fsName, gradedFileName285);
    } catch (e) {
        logImportError(285, "GRADED", gradedFileBis285.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess285) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00285 (normal)");
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
        gradedFileName311 = "UNDLM_00311.mov";
        gradedImportSuccess311 = true;
        gradingImportCount++;
        logImportSuccess(311, "GRADED", gradedFile311.fsName, gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED", gradedFile311.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess311 && gradedFilePoignees311.exists) {
    try {
        var gradedFootage311 = project.importFile(new ImportOptions(gradedFilePoignees311));
        gradedFootage311.parentFolder = fromGradingFolder;
        gradedFootage311.name = "UNDLM_00311";
        gradingSources[311] = gradedFootage311;
        gradedFileName311 = "UNDLM_00311_AVEC_POIGNEES.mov";
        gradedImportSuccess311 = true;
        gradingImportCount++;
        logImportSuccess(311, "GRADED", gradedFilePoignees311.fsName, gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED", gradedFilePoignees311.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess311 && gradedFileBis311.exists) {
    try {
        var gradedFootage311 = project.importFile(new ImportOptions(gradedFileBis311));
        gradedFootage311.parentFolder = fromGradingFolder;
        gradedFootage311.name = "UNDLM_00311";
        gradingSources[311] = gradedFootage311;
        gradedFileName311 = "UNDLM_00311bis.mov";
        gradedImportSuccess311 = true;
        gradingImportCount++;
        logImportSuccess(311, "GRADED", gradedFileBis311.fsName, gradedFileName311);
    } catch (e) {
        logImportError(311, "GRADED", gradedFileBis311.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess311) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00311 (normal)");
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
        gradedFileName312 = "UNDLM_00312.mov";
        gradedImportSuccess312 = true;
        gradingImportCount++;
        logImportSuccess(312, "GRADED", gradedFile312.fsName, gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED", gradedFile312.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess312 && gradedFilePoignees312.exists) {
    try {
        var gradedFootage312 = project.importFile(new ImportOptions(gradedFilePoignees312));
        gradedFootage312.parentFolder = fromGradingFolder;
        gradedFootage312.name = "UNDLM_00312";
        gradingSources[312] = gradedFootage312;
        gradedFileName312 = "UNDLM_00312_AVEC_POIGNEES.mov";
        gradedImportSuccess312 = true;
        gradingImportCount++;
        logImportSuccess(312, "GRADED", gradedFilePoignees312.fsName, gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED", gradedFilePoignees312.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess312 && gradedFileBis312.exists) {
    try {
        var gradedFootage312 = project.importFile(new ImportOptions(gradedFileBis312));
        gradedFootage312.parentFolder = fromGradingFolder;
        gradedFootage312.name = "UNDLM_00312";
        gradingSources[312] = gradedFootage312;
        gradedFileName312 = "UNDLM_00312bis.mov";
        gradedImportSuccess312 = true;
        gradingImportCount++;
        logImportSuccess(312, "GRADED", gradedFileBis312.fsName, gradedFileName312);
    } catch (e) {
        logImportError(312, "GRADED", gradedFileBis312.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess312) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00312 (normal)");
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
        gradedFileName313 = "UNDLM_00313.mov";
        gradedImportSuccess313 = true;
        gradingImportCount++;
        logImportSuccess(313, "GRADED", gradedFile313.fsName, gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED", gradedFile313.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess313 && gradedFilePoignees313.exists) {
    try {
        var gradedFootage313 = project.importFile(new ImportOptions(gradedFilePoignees313));
        gradedFootage313.parentFolder = fromGradingFolder;
        gradedFootage313.name = "UNDLM_00313";
        gradingSources[313] = gradedFootage313;
        gradedFileName313 = "UNDLM_00313_AVEC_POIGNEES.mov";
        gradedImportSuccess313 = true;
        gradingImportCount++;
        logImportSuccess(313, "GRADED", gradedFilePoignees313.fsName, gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED", gradedFilePoignees313.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess313 && gradedFileBis313.exists) {
    try {
        var gradedFootage313 = project.importFile(new ImportOptions(gradedFileBis313));
        gradedFootage313.parentFolder = fromGradingFolder;
        gradedFootage313.name = "UNDLM_00313";
        gradingSources[313] = gradedFootage313;
        gradedFileName313 = "UNDLM_00313bis.mov";
        gradedImportSuccess313 = true;
        gradingImportCount++;
        logImportSuccess(313, "GRADED", gradedFileBis313.fsName, gradedFileName313);
    } catch (e) {
        logImportError(313, "GRADED", gradedFileBis313.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess313) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00313 (normal)");
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
        gradedFileName314 = "UNDLM_00314.mov";
        gradedImportSuccess314 = true;
        gradingImportCount++;
        logImportSuccess(314, "GRADED", gradedFile314.fsName, gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED", gradedFile314.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess314 && gradedFilePoignees314.exists) {
    try {
        var gradedFootage314 = project.importFile(new ImportOptions(gradedFilePoignees314));
        gradedFootage314.parentFolder = fromGradingFolder;
        gradedFootage314.name = "UNDLM_00314";
        gradingSources[314] = gradedFootage314;
        gradedFileName314 = "UNDLM_00314_AVEC_POIGNEES.mov";
        gradedImportSuccess314 = true;
        gradingImportCount++;
        logImportSuccess(314, "GRADED", gradedFilePoignees314.fsName, gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED", gradedFilePoignees314.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess314 && gradedFileBis314.exists) {
    try {
        var gradedFootage314 = project.importFile(new ImportOptions(gradedFileBis314));
        gradedFootage314.parentFolder = fromGradingFolder;
        gradedFootage314.name = "UNDLM_00314";
        gradingSources[314] = gradedFootage314;
        gradedFileName314 = "UNDLM_00314bis.mov";
        gradedImportSuccess314 = true;
        gradingImportCount++;
        logImportSuccess(314, "GRADED", gradedFileBis314.fsName, gradedFileName314);
    } catch (e) {
        logImportError(314, "GRADED", gradedFileBis314.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess314) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00314 (normal)");
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
        gradedFileName315 = "UNDLM_00315.mov";
        gradedImportSuccess315 = true;
        gradingImportCount++;
        logImportSuccess(315, "GRADED", gradedFile315.fsName, gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED", gradedFile315.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess315 && gradedFilePoignees315.exists) {
    try {
        var gradedFootage315 = project.importFile(new ImportOptions(gradedFilePoignees315));
        gradedFootage315.parentFolder = fromGradingFolder;
        gradedFootage315.name = "UNDLM_00315";
        gradingSources[315] = gradedFootage315;
        gradedFileName315 = "UNDLM_00315_AVEC_POIGNEES.mov";
        gradedImportSuccess315 = true;
        gradingImportCount++;
        logImportSuccess(315, "GRADED", gradedFilePoignees315.fsName, gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED", gradedFilePoignees315.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess315 && gradedFileBis315.exists) {
    try {
        var gradedFootage315 = project.importFile(new ImportOptions(gradedFileBis315));
        gradedFootage315.parentFolder = fromGradingFolder;
        gradedFootage315.name = "UNDLM_00315";
        gradingSources[315] = gradedFootage315;
        gradedFileName315 = "UNDLM_00315bis.mov";
        gradedImportSuccess315 = true;
        gradingImportCount++;
        logImportSuccess(315, "GRADED", gradedFileBis315.fsName, gradedFileName315);
    } catch (e) {
        logImportError(315, "GRADED", gradedFileBis315.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess315) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00315 (normal)");
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
        gradedFileName316 = "UNDLM_00316.mov";
        gradedImportSuccess316 = true;
        gradingImportCount++;
        logImportSuccess(316, "GRADED", gradedFile316.fsName, gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED", gradedFile316.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess316 && gradedFilePoignees316.exists) {
    try {
        var gradedFootage316 = project.importFile(new ImportOptions(gradedFilePoignees316));
        gradedFootage316.parentFolder = fromGradingFolder;
        gradedFootage316.name = "UNDLM_00316";
        gradingSources[316] = gradedFootage316;
        gradedFileName316 = "UNDLM_00316_AVEC_POIGNEES.mov";
        gradedImportSuccess316 = true;
        gradingImportCount++;
        logImportSuccess(316, "GRADED", gradedFilePoignees316.fsName, gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED", gradedFilePoignees316.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess316 && gradedFileBis316.exists) {
    try {
        var gradedFootage316 = project.importFile(new ImportOptions(gradedFileBis316));
        gradedFootage316.parentFolder = fromGradingFolder;
        gradedFootage316.name = "UNDLM_00316";
        gradingSources[316] = gradedFootage316;
        gradedFileName316 = "UNDLM_00316bis.mov";
        gradedImportSuccess316 = true;
        gradingImportCount++;
        logImportSuccess(316, "GRADED", gradedFileBis316.fsName, gradedFileName316);
    } catch (e) {
        logImportError(316, "GRADED", gradedFileBis316.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess316) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00316 (normal)");
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
        gradedFileName317 = "UNDLM_00317.mov";
        gradedImportSuccess317 = true;
        gradingImportCount++;
        logImportSuccess(317, "GRADED", gradedFile317.fsName, gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED", gradedFile317.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess317 && gradedFilePoignees317.exists) {
    try {
        var gradedFootage317 = project.importFile(new ImportOptions(gradedFilePoignees317));
        gradedFootage317.parentFolder = fromGradingFolder;
        gradedFootage317.name = "UNDLM_00317";
        gradingSources[317] = gradedFootage317;
        gradedFileName317 = "UNDLM_00317_AVEC_POIGNEES.mov";
        gradedImportSuccess317 = true;
        gradingImportCount++;
        logImportSuccess(317, "GRADED", gradedFilePoignees317.fsName, gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED", gradedFilePoignees317.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess317 && gradedFileBis317.exists) {
    try {
        var gradedFootage317 = project.importFile(new ImportOptions(gradedFileBis317));
        gradedFootage317.parentFolder = fromGradingFolder;
        gradedFootage317.name = "UNDLM_00317";
        gradingSources[317] = gradedFootage317;
        gradedFileName317 = "UNDLM_00317bis.mov";
        gradedImportSuccess317 = true;
        gradingImportCount++;
        logImportSuccess(317, "GRADED", gradedFileBis317.fsName, gradedFileName317);
    } catch (e) {
        logImportError(317, "GRADED", gradedFileBis317.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess317) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00317 (normal)");
}

// Import plan GRADED 00327
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327.mov");
var gradedFilePoignees327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327_AVEC_POIGNEES.mov");
var gradedFileBis327 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00327bis.mov");

var gradedImportSuccess327 = false;
var gradedFileName327 = "";

// Tenter import standard
if (gradedFile327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFile327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327";
        gradingSources[327] = gradedFootage327;
        gradedFileName327 = "UNDLM_00327.mov";
        gradedImportSuccess327 = true;
        gradingImportCount++;
        logImportSuccess(327, "GRADED", gradedFile327.fsName, gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED", gradedFile327.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess327 && gradedFilePoignees327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFilePoignees327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327";
        gradingSources[327] = gradedFootage327;
        gradedFileName327 = "UNDLM_00327_AVEC_POIGNEES.mov";
        gradedImportSuccess327 = true;
        gradingImportCount++;
        logImportSuccess(327, "GRADED", gradedFilePoignees327.fsName, gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED", gradedFilePoignees327.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess327 && gradedFileBis327.exists) {
    try {
        var gradedFootage327 = project.importFile(new ImportOptions(gradedFileBis327));
        gradedFootage327.parentFolder = fromGradingFolder;
        gradedFootage327.name = "UNDLM_00327";
        gradingSources[327] = gradedFootage327;
        gradedFileName327 = "UNDLM_00327bis.mov";
        gradedImportSuccess327 = true;
        gradingImportCount++;
        logImportSuccess(327, "GRADED", gradedFileBis327.fsName, gradedFileName327);
    } catch (e) {
        logImportError(327, "GRADED", gradedFileBis327.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess327) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00327 (normal)");
}

// Import plan GRADED 00328
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328.mov");
var gradedFilePoignees328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328_AVEC_POIGNEES.mov");
var gradedFileBis328 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00328bis.mov");

var gradedImportSuccess328 = false;
var gradedFileName328 = "";

// Tenter import standard
if (gradedFile328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFile328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328";
        gradingSources[328] = gradedFootage328;
        gradedFileName328 = "UNDLM_00328.mov";
        gradedImportSuccess328 = true;
        gradingImportCount++;
        logImportSuccess(328, "GRADED", gradedFile328.fsName, gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED", gradedFile328.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess328 && gradedFilePoignees328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFilePoignees328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328";
        gradingSources[328] = gradedFootage328;
        gradedFileName328 = "UNDLM_00328_AVEC_POIGNEES.mov";
        gradedImportSuccess328 = true;
        gradingImportCount++;
        logImportSuccess(328, "GRADED", gradedFilePoignees328.fsName, gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED", gradedFilePoignees328.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess328 && gradedFileBis328.exists) {
    try {
        var gradedFootage328 = project.importFile(new ImportOptions(gradedFileBis328));
        gradedFootage328.parentFolder = fromGradingFolder;
        gradedFootage328.name = "UNDLM_00328";
        gradingSources[328] = gradedFootage328;
        gradedFileName328 = "UNDLM_00328bis.mov";
        gradedImportSuccess328 = true;
        gradingImportCount++;
        logImportSuccess(328, "GRADED", gradedFileBis328.fsName, gradedFileName328);
    } catch (e) {
        logImportError(328, "GRADED", gradedFileBis328.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess328) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00328 (normal)");
}

// Import plan GRADED 00329
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329.mov");
var gradedFilePoignees329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329_AVEC_POIGNEES.mov");
var gradedFileBis329 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00329bis.mov");

var gradedImportSuccess329 = false;
var gradedFileName329 = "";

// Tenter import standard
if (gradedFile329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFile329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329";
        gradingSources[329] = gradedFootage329;
        gradedFileName329 = "UNDLM_00329.mov";
        gradedImportSuccess329 = true;
        gradingImportCount++;
        logImportSuccess(329, "GRADED", gradedFile329.fsName, gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED", gradedFile329.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess329 && gradedFilePoignees329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFilePoignees329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329";
        gradingSources[329] = gradedFootage329;
        gradedFileName329 = "UNDLM_00329_AVEC_POIGNEES.mov";
        gradedImportSuccess329 = true;
        gradingImportCount++;
        logImportSuccess(329, "GRADED", gradedFilePoignees329.fsName, gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED", gradedFilePoignees329.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess329 && gradedFileBis329.exists) {
    try {
        var gradedFootage329 = project.importFile(new ImportOptions(gradedFileBis329));
        gradedFootage329.parentFolder = fromGradingFolder;
        gradedFootage329.name = "UNDLM_00329";
        gradingSources[329] = gradedFootage329;
        gradedFileName329 = "UNDLM_00329bis.mov";
        gradedImportSuccess329 = true;
        gradingImportCount++;
        logImportSuccess(329, "GRADED", gradedFileBis329.fsName, gradedFileName329);
    } catch (e) {
        logImportError(329, "GRADED", gradedFileBis329.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess329) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00329 (normal)");
}

// Import plan GRADED 00330
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330.mov");
var gradedFilePoignees330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330_AVEC_POIGNEES.mov");
var gradedFileBis330 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00330bis.mov");

var gradedImportSuccess330 = false;
var gradedFileName330 = "";

// Tenter import standard
if (gradedFile330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFile330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330";
        gradingSources[330] = gradedFootage330;
        gradedFileName330 = "UNDLM_00330.mov";
        gradedImportSuccess330 = true;
        gradingImportCount++;
        logImportSuccess(330, "GRADED", gradedFile330.fsName, gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED", gradedFile330.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess330 && gradedFilePoignees330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFilePoignees330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330";
        gradingSources[330] = gradedFootage330;
        gradedFileName330 = "UNDLM_00330_AVEC_POIGNEES.mov";
        gradedImportSuccess330 = true;
        gradingImportCount++;
        logImportSuccess(330, "GRADED", gradedFilePoignees330.fsName, gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED", gradedFilePoignees330.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess330 && gradedFileBis330.exists) {
    try {
        var gradedFootage330 = project.importFile(new ImportOptions(gradedFileBis330));
        gradedFootage330.parentFolder = fromGradingFolder;
        gradedFootage330.name = "UNDLM_00330";
        gradingSources[330] = gradedFootage330;
        gradedFileName330 = "UNDLM_00330bis.mov";
        gradedImportSuccess330 = true;
        gradingImportCount++;
        logImportSuccess(330, "GRADED", gradedFileBis330.fsName, gradedFileName330);
    } catch (e) {
        logImportError(330, "GRADED", gradedFileBis330.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess330) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00330 (normal)");
}

// Import plan GRADED 00331
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331.mov");
var gradedFilePoignees331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331_AVEC_POIGNEES.mov");
var gradedFileBis331 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00331bis.mov");

var gradedImportSuccess331 = false;
var gradedFileName331 = "";

// Tenter import standard
if (gradedFile331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFile331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331";
        gradingSources[331] = gradedFootage331;
        gradedFileName331 = "UNDLM_00331.mov";
        gradedImportSuccess331 = true;
        gradingImportCount++;
        logImportSuccess(331, "GRADED", gradedFile331.fsName, gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED", gradedFile331.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess331 && gradedFilePoignees331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFilePoignees331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331";
        gradingSources[331] = gradedFootage331;
        gradedFileName331 = "UNDLM_00331_AVEC_POIGNEES.mov";
        gradedImportSuccess331 = true;
        gradingImportCount++;
        logImportSuccess(331, "GRADED", gradedFilePoignees331.fsName, gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED", gradedFilePoignees331.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess331 && gradedFileBis331.exists) {
    try {
        var gradedFootage331 = project.importFile(new ImportOptions(gradedFileBis331));
        gradedFootage331.parentFolder = fromGradingFolder;
        gradedFootage331.name = "UNDLM_00331";
        gradingSources[331] = gradedFootage331;
        gradedFileName331 = "UNDLM_00331bis.mov";
        gradedImportSuccess331 = true;
        gradingImportCount++;
        logImportSuccess(331, "GRADED", gradedFileBis331.fsName, gradedFileName331);
    } catch (e) {
        logImportError(331, "GRADED", gradedFileBis331.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess331) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00331 (normal)");
}

// Import plan GRADED 00384
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384.mov");
var gradedFilePoignees384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384_AVEC_POIGNEES.mov");
var gradedFileBis384 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00384bis.mov");

var gradedImportSuccess384 = false;
var gradedFileName384 = "";

// Tenter import standard
if (gradedFile384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFile384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384";
        gradingSources[384] = gradedFootage384;
        gradedFileName384 = "UNDLM_00384.mov";
        gradedImportSuccess384 = true;
        gradingImportCount++;
        logImportSuccess(384, "GRADED", gradedFile384.fsName, gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED", gradedFile384.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess384 && gradedFilePoignees384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFilePoignees384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384";
        gradingSources[384] = gradedFootage384;
        gradedFileName384 = "UNDLM_00384_AVEC_POIGNEES.mov";
        gradedImportSuccess384 = true;
        gradingImportCount++;
        logImportSuccess(384, "GRADED", gradedFilePoignees384.fsName, gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED", gradedFilePoignees384.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess384 && gradedFileBis384.exists) {
    try {
        var gradedFootage384 = project.importFile(new ImportOptions(gradedFileBis384));
        gradedFootage384.parentFolder = fromGradingFolder;
        gradedFootage384.name = "UNDLM_00384";
        gradingSources[384] = gradedFootage384;
        gradedFileName384 = "UNDLM_00384bis.mov";
        gradedImportSuccess384 = true;
        gradingImportCount++;
        logImportSuccess(384, "GRADED", gradedFileBis384.fsName, gradedFileName384);
    } catch (e) {
        logImportError(384, "GRADED", gradedFileBis384.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess384) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00384 (normal)");
}

// Import plan GRADED 00385
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385.mov");
var gradedFilePoignees385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385_AVEC_POIGNEES.mov");
var gradedFileBis385 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00385bis.mov");

var gradedImportSuccess385 = false;
var gradedFileName385 = "";

// Tenter import standard
if (gradedFile385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFile385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385";
        gradingSources[385] = gradedFootage385;
        gradedFileName385 = "UNDLM_00385.mov";
        gradedImportSuccess385 = true;
        gradingImportCount++;
        logImportSuccess(385, "GRADED", gradedFile385.fsName, gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED", gradedFile385.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess385 && gradedFilePoignees385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFilePoignees385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385";
        gradingSources[385] = gradedFootage385;
        gradedFileName385 = "UNDLM_00385_AVEC_POIGNEES.mov";
        gradedImportSuccess385 = true;
        gradingImportCount++;
        logImportSuccess(385, "GRADED", gradedFilePoignees385.fsName, gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED", gradedFilePoignees385.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess385 && gradedFileBis385.exists) {
    try {
        var gradedFootage385 = project.importFile(new ImportOptions(gradedFileBis385));
        gradedFootage385.parentFolder = fromGradingFolder;
        gradedFootage385.name = "UNDLM_00385";
        gradingSources[385] = gradedFootage385;
        gradedFileName385 = "UNDLM_00385bis.mov";
        gradedImportSuccess385 = true;
        gradingImportCount++;
        logImportSuccess(385, "GRADED", gradedFileBis385.fsName, gradedFileName385);
    } catch (e) {
        logImportError(385, "GRADED", gradedFileBis385.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess385) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00385 (normal)");
}

// Import plan GRADED 00386
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386.mov");
var gradedFilePoignees386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386_AVEC_POIGNEES.mov");
var gradedFileBis386 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00386bis.mov");

var gradedImportSuccess386 = false;
var gradedFileName386 = "";

// Tenter import standard
if (gradedFile386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFile386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386";
        gradingSources[386] = gradedFootage386;
        gradedFileName386 = "UNDLM_00386.mov";
        gradedImportSuccess386 = true;
        gradingImportCount++;
        logImportSuccess(386, "GRADED", gradedFile386.fsName, gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED", gradedFile386.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess386 && gradedFilePoignees386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFilePoignees386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386";
        gradingSources[386] = gradedFootage386;
        gradedFileName386 = "UNDLM_00386_AVEC_POIGNEES.mov";
        gradedImportSuccess386 = true;
        gradingImportCount++;
        logImportSuccess(386, "GRADED", gradedFilePoignees386.fsName, gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED", gradedFilePoignees386.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess386 && gradedFileBis386.exists) {
    try {
        var gradedFootage386 = project.importFile(new ImportOptions(gradedFileBis386));
        gradedFootage386.parentFolder = fromGradingFolder;
        gradedFootage386.name = "UNDLM_00386";
        gradingSources[386] = gradedFootage386;
        gradedFileName386 = "UNDLM_00386bis.mov";
        gradedImportSuccess386 = true;
        gradingImportCount++;
        logImportSuccess(386, "GRADED", gradedFileBis386.fsName, gradedFileName386);
    } catch (e) {
        logImportError(386, "GRADED", gradedFileBis386.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess386) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00386 (normal)");
}

// Import plan GRADED 00387
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387.mov");
var gradedFilePoignees387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387_AVEC_POIGNEES.mov");
var gradedFileBis387 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00387bis.mov");

var gradedImportSuccess387 = false;
var gradedFileName387 = "";

// Tenter import standard
if (gradedFile387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFile387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387";
        gradingSources[387] = gradedFootage387;
        gradedFileName387 = "UNDLM_00387.mov";
        gradedImportSuccess387 = true;
        gradingImportCount++;
        logImportSuccess(387, "GRADED", gradedFile387.fsName, gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED", gradedFile387.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess387 && gradedFilePoignees387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFilePoignees387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387";
        gradingSources[387] = gradedFootage387;
        gradedFileName387 = "UNDLM_00387_AVEC_POIGNEES.mov";
        gradedImportSuccess387 = true;
        gradingImportCount++;
        logImportSuccess(387, "GRADED", gradedFilePoignees387.fsName, gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED", gradedFilePoignees387.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess387 && gradedFileBis387.exists) {
    try {
        var gradedFootage387 = project.importFile(new ImportOptions(gradedFileBis387));
        gradedFootage387.parentFolder = fromGradingFolder;
        gradedFootage387.name = "UNDLM_00387";
        gradingSources[387] = gradedFootage387;
        gradedFileName387 = "UNDLM_00387bis.mov";
        gradedImportSuccess387 = true;
        gradingImportCount++;
        logImportSuccess(387, "GRADED", gradedFileBis387.fsName, gradedFileName387);
    } catch (e) {
        logImportError(387, "GRADED", gradedFileBis387.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess387) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00387 (normal)");
}

// Import plan GRADED 00391
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391.mov");
var gradedFilePoignees391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391_AVEC_POIGNEES.mov");
var gradedFileBis391 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00391bis.mov");

var gradedImportSuccess391 = false;
var gradedFileName391 = "";

// Tenter import standard
if (gradedFile391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFile391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391";
        gradingSources[391] = gradedFootage391;
        gradedFileName391 = "UNDLM_00391.mov";
        gradedImportSuccess391 = true;
        gradingImportCount++;
        logImportSuccess(391, "GRADED", gradedFile391.fsName, gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED", gradedFile391.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess391 && gradedFilePoignees391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFilePoignees391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391";
        gradingSources[391] = gradedFootage391;
        gradedFileName391 = "UNDLM_00391_AVEC_POIGNEES.mov";
        gradedImportSuccess391 = true;
        gradingImportCount++;
        logImportSuccess(391, "GRADED", gradedFilePoignees391.fsName, gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED", gradedFilePoignees391.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess391 && gradedFileBis391.exists) {
    try {
        var gradedFootage391 = project.importFile(new ImportOptions(gradedFileBis391));
        gradedFootage391.parentFolder = fromGradingFolder;
        gradedFootage391.name = "UNDLM_00391";
        gradingSources[391] = gradedFootage391;
        gradedFileName391 = "UNDLM_00391bis.mov";
        gradedImportSuccess391 = true;
        gradingImportCount++;
        logImportSuccess(391, "GRADED", gradedFileBis391.fsName, gradedFileName391);
    } catch (e) {
        logImportError(391, "GRADED", gradedFileBis391.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess391) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00391 (normal)");
}

// Import plan GRADED 00393
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393.mov");
var gradedFilePoignees393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393_AVEC_POIGNEES.mov");
var gradedFileBis393 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00393bis.mov");

var gradedImportSuccess393 = false;
var gradedFileName393 = "";

// Tenter import standard
if (gradedFile393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFile393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393";
        gradingSources[393] = gradedFootage393;
        gradedFileName393 = "UNDLM_00393.mov";
        gradedImportSuccess393 = true;
        gradingImportCount++;
        logImportSuccess(393, "GRADED", gradedFile393.fsName, gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED", gradedFile393.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess393 && gradedFilePoignees393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFilePoignees393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393";
        gradingSources[393] = gradedFootage393;
        gradedFileName393 = "UNDLM_00393_AVEC_POIGNEES.mov";
        gradedImportSuccess393 = true;
        gradingImportCount++;
        logImportSuccess(393, "GRADED", gradedFilePoignees393.fsName, gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED", gradedFilePoignees393.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess393 && gradedFileBis393.exists) {
    try {
        var gradedFootage393 = project.importFile(new ImportOptions(gradedFileBis393));
        gradedFootage393.parentFolder = fromGradingFolder;
        gradedFootage393.name = "UNDLM_00393";
        gradingSources[393] = gradedFootage393;
        gradedFileName393 = "UNDLM_00393bis.mov";
        gradedImportSuccess393 = true;
        gradingImportCount++;
        logImportSuccess(393, "GRADED", gradedFileBis393.fsName, gradedFileName393);
    } catch (e) {
        logImportError(393, "GRADED", gradedFileBis393.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess393) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00393 (normal)");
}

// Import plan GRADED 00394
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394.mov");
var gradedFilePoignees394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394_AVEC_POIGNEES.mov");
var gradedFileBis394 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00394bis.mov");

var gradedImportSuccess394 = false;
var gradedFileName394 = "";

// Tenter import standard
if (gradedFile394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFile394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394";
        gradingSources[394] = gradedFootage394;
        gradedFileName394 = "UNDLM_00394.mov";
        gradedImportSuccess394 = true;
        gradingImportCount++;
        logImportSuccess(394, "GRADED", gradedFile394.fsName, gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED", gradedFile394.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess394 && gradedFilePoignees394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFilePoignees394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394";
        gradingSources[394] = gradedFootage394;
        gradedFileName394 = "UNDLM_00394_AVEC_POIGNEES.mov";
        gradedImportSuccess394 = true;
        gradingImportCount++;
        logImportSuccess(394, "GRADED", gradedFilePoignees394.fsName, gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED", gradedFilePoignees394.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess394 && gradedFileBis394.exists) {
    try {
        var gradedFootage394 = project.importFile(new ImportOptions(gradedFileBis394));
        gradedFootage394.parentFolder = fromGradingFolder;
        gradedFootage394.name = "UNDLM_00394";
        gradingSources[394] = gradedFootage394;
        gradedFileName394 = "UNDLM_00394bis.mov";
        gradedImportSuccess394 = true;
        gradingImportCount++;
        logImportSuccess(394, "GRADED", gradedFileBis394.fsName, gradedFileName394);
    } catch (e) {
        logImportError(394, "GRADED", gradedFileBis394.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess394) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00394 (normal)");
}

// Import plan GRADED 00395
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395.mov");
var gradedFilePoignees395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395_AVEC_POIGNEES.mov");
var gradedFileBis395 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00395bis.mov");

var gradedImportSuccess395 = false;
var gradedFileName395 = "";

// Tenter import standard
if (gradedFile395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFile395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395";
        gradingSources[395] = gradedFootage395;
        gradedFileName395 = "UNDLM_00395.mov";
        gradedImportSuccess395 = true;
        gradingImportCount++;
        logImportSuccess(395, "GRADED", gradedFile395.fsName, gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED", gradedFile395.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess395 && gradedFilePoignees395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFilePoignees395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395";
        gradingSources[395] = gradedFootage395;
        gradedFileName395 = "UNDLM_00395_AVEC_POIGNEES.mov";
        gradedImportSuccess395 = true;
        gradingImportCount++;
        logImportSuccess(395, "GRADED", gradedFilePoignees395.fsName, gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED", gradedFilePoignees395.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess395 && gradedFileBis395.exists) {
    try {
        var gradedFootage395 = project.importFile(new ImportOptions(gradedFileBis395));
        gradedFootage395.parentFolder = fromGradingFolder;
        gradedFootage395.name = "UNDLM_00395";
        gradingSources[395] = gradedFootage395;
        gradedFileName395 = "UNDLM_00395bis.mov";
        gradedImportSuccess395 = true;
        gradingImportCount++;
        logImportSuccess(395, "GRADED", gradedFileBis395.fsName, gradedFileName395);
    } catch (e) {
        logImportError(395, "GRADED", gradedFileBis395.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess395) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00395 (normal)");
}

// Import plan GRADED 00396
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396.mov");
var gradedFilePoignees396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396_AVEC_POIGNEES.mov");
var gradedFileBis396 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00396bis.mov");

var gradedImportSuccess396 = false;
var gradedFileName396 = "";

// Tenter import standard
if (gradedFile396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFile396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396";
        gradingSources[396] = gradedFootage396;
        gradedFileName396 = "UNDLM_00396.mov";
        gradedImportSuccess396 = true;
        gradingImportCount++;
        logImportSuccess(396, "GRADED", gradedFile396.fsName, gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED", gradedFile396.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess396 && gradedFilePoignees396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFilePoignees396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396";
        gradingSources[396] = gradedFootage396;
        gradedFileName396 = "UNDLM_00396_AVEC_POIGNEES.mov";
        gradedImportSuccess396 = true;
        gradingImportCount++;
        logImportSuccess(396, "GRADED", gradedFilePoignees396.fsName, gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED", gradedFilePoignees396.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess396 && gradedFileBis396.exists) {
    try {
        var gradedFootage396 = project.importFile(new ImportOptions(gradedFileBis396));
        gradedFootage396.parentFolder = fromGradingFolder;
        gradedFootage396.name = "UNDLM_00396";
        gradingSources[396] = gradedFootage396;
        gradedFileName396 = "UNDLM_00396bis.mov";
        gradedImportSuccess396 = true;
        gradingImportCount++;
        logImportSuccess(396, "GRADED", gradedFileBis396.fsName, gradedFileName396);
    } catch (e) {
        logImportError(396, "GRADED", gradedFileBis396.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess396) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00396 (normal)");
}

// Import plan GRADED 00397
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397.mov");
var gradedFilePoignees397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397_AVEC_POIGNEES.mov");
var gradedFileBis397 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00397bis.mov");

var gradedImportSuccess397 = false;
var gradedFileName397 = "";

// Tenter import standard
if (gradedFile397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFile397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397";
        gradingSources[397] = gradedFootage397;
        gradedFileName397 = "UNDLM_00397.mov";
        gradedImportSuccess397 = true;
        gradingImportCount++;
        logImportSuccess(397, "GRADED", gradedFile397.fsName, gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED", gradedFile397.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess397 && gradedFilePoignees397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFilePoignees397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397";
        gradingSources[397] = gradedFootage397;
        gradedFileName397 = "UNDLM_00397_AVEC_POIGNEES.mov";
        gradedImportSuccess397 = true;
        gradingImportCount++;
        logImportSuccess(397, "GRADED", gradedFilePoignees397.fsName, gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED", gradedFilePoignees397.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess397 && gradedFileBis397.exists) {
    try {
        var gradedFootage397 = project.importFile(new ImportOptions(gradedFileBis397));
        gradedFootage397.parentFolder = fromGradingFolder;
        gradedFootage397.name = "UNDLM_00397";
        gradingSources[397] = gradedFootage397;
        gradedFileName397 = "UNDLM_00397bis.mov";
        gradedImportSuccess397 = true;
        gradingImportCount++;
        logImportSuccess(397, "GRADED", gradedFileBis397.fsName, gradedFileName397);
    } catch (e) {
        logImportError(397, "GRADED", gradedFileBis397.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess397) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00397 (normal)");
}

// Import plan GRADED 00398
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398.mov");
var gradedFilePoignees398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398_AVEC_POIGNEES.mov");
var gradedFileBis398 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00398bis.mov");

var gradedImportSuccess398 = false;
var gradedFileName398 = "";

// Tenter import standard
if (gradedFile398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFile398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398";
        gradingSources[398] = gradedFootage398;
        gradedFileName398 = "UNDLM_00398.mov";
        gradedImportSuccess398 = true;
        gradingImportCount++;
        logImportSuccess(398, "GRADED", gradedFile398.fsName, gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED", gradedFile398.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess398 && gradedFilePoignees398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFilePoignees398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398";
        gradingSources[398] = gradedFootage398;
        gradedFileName398 = "UNDLM_00398_AVEC_POIGNEES.mov";
        gradedImportSuccess398 = true;
        gradingImportCount++;
        logImportSuccess(398, "GRADED", gradedFilePoignees398.fsName, gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED", gradedFilePoignees398.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess398 && gradedFileBis398.exists) {
    try {
        var gradedFootage398 = project.importFile(new ImportOptions(gradedFileBis398));
        gradedFootage398.parentFolder = fromGradingFolder;
        gradedFootage398.name = "UNDLM_00398";
        gradingSources[398] = gradedFootage398;
        gradedFileName398 = "UNDLM_00398bis.mov";
        gradedImportSuccess398 = true;
        gradingImportCount++;
        logImportSuccess(398, "GRADED", gradedFileBis398.fsName, gradedFileName398);
    } catch (e) {
        logImportError(398, "GRADED", gradedFileBis398.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess398) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00398 (normal)");
}

// Import plan GRADED 00399
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399.mov");
var gradedFilePoignees399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399_AVEC_POIGNEES.mov");
var gradedFileBis399 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00399bis.mov");

var gradedImportSuccess399 = false;
var gradedFileName399 = "";

// Tenter import standard
if (gradedFile399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFile399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399";
        gradingSources[399] = gradedFootage399;
        gradedFileName399 = "UNDLM_00399.mov";
        gradedImportSuccess399 = true;
        gradingImportCount++;
        logImportSuccess(399, "GRADED", gradedFile399.fsName, gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED", gradedFile399.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess399 && gradedFilePoignees399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFilePoignees399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399";
        gradingSources[399] = gradedFootage399;
        gradedFileName399 = "UNDLM_00399_AVEC_POIGNEES.mov";
        gradedImportSuccess399 = true;
        gradingImportCount++;
        logImportSuccess(399, "GRADED", gradedFilePoignees399.fsName, gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED", gradedFilePoignees399.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess399 && gradedFileBis399.exists) {
    try {
        var gradedFootage399 = project.importFile(new ImportOptions(gradedFileBis399));
        gradedFootage399.parentFolder = fromGradingFolder;
        gradedFootage399.name = "UNDLM_00399";
        gradingSources[399] = gradedFootage399;
        gradedFileName399 = "UNDLM_00399bis.mov";
        gradedImportSuccess399 = true;
        gradingImportCount++;
        logImportSuccess(399, "GRADED", gradedFileBis399.fsName, gradedFileName399);
    } catch (e) {
        logImportError(399, "GRADED", gradedFileBis399.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess399) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00399 (normal)");
}

// Import plan GRADED 00400
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400.mov");
var gradedFilePoignees400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400_AVEC_POIGNEES.mov");
var gradedFileBis400 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00400bis.mov");

var gradedImportSuccess400 = false;
var gradedFileName400 = "";

// Tenter import standard
if (gradedFile400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFile400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400";
        gradingSources[400] = gradedFootage400;
        gradedFileName400 = "UNDLM_00400.mov";
        gradedImportSuccess400 = true;
        gradingImportCount++;
        logImportSuccess(400, "GRADED", gradedFile400.fsName, gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED", gradedFile400.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess400 && gradedFilePoignees400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFilePoignees400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400";
        gradingSources[400] = gradedFootage400;
        gradedFileName400 = "UNDLM_00400_AVEC_POIGNEES.mov";
        gradedImportSuccess400 = true;
        gradingImportCount++;
        logImportSuccess(400, "GRADED", gradedFilePoignees400.fsName, gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED", gradedFilePoignees400.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess400 && gradedFileBis400.exists) {
    try {
        var gradedFootage400 = project.importFile(new ImportOptions(gradedFileBis400));
        gradedFootage400.parentFolder = fromGradingFolder;
        gradedFootage400.name = "UNDLM_00400";
        gradingSources[400] = gradedFootage400;
        gradedFileName400 = "UNDLM_00400bis.mov";
        gradedImportSuccess400 = true;
        gradingImportCount++;
        logImportSuccess(400, "GRADED", gradedFileBis400.fsName, gradedFileName400);
    } catch (e) {
        logImportError(400, "GRADED", gradedFileBis400.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess400) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00400 (normal)");
}

// Import plan GRADED 00464
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464.mov");
var gradedFilePoignees464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464_AVEC_POIGNEES.mov");
var gradedFileBis464 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00464bis.mov");

var gradedImportSuccess464 = false;
var gradedFileName464 = "";

// Tenter import standard
if (gradedFile464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFile464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464";
        gradingSources[464] = gradedFootage464;
        gradedFileName464 = "UNDLM_00464.mov";
        gradedImportSuccess464 = true;
        gradingImportCount++;
        logImportSuccess(464, "GRADED", gradedFile464.fsName, gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED", gradedFile464.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess464 && gradedFilePoignees464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFilePoignees464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464";
        gradingSources[464] = gradedFootage464;
        gradedFileName464 = "UNDLM_00464_AVEC_POIGNEES.mov";
        gradedImportSuccess464 = true;
        gradingImportCount++;
        logImportSuccess(464, "GRADED", gradedFilePoignees464.fsName, gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED", gradedFilePoignees464.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess464 && gradedFileBis464.exists) {
    try {
        var gradedFootage464 = project.importFile(new ImportOptions(gradedFileBis464));
        gradedFootage464.parentFolder = fromGradingFolder;
        gradedFootage464.name = "UNDLM_00464";
        gradingSources[464] = gradedFootage464;
        gradedFileName464 = "UNDLM_00464bis.mov";
        gradedImportSuccess464 = true;
        gradingImportCount++;
        logImportSuccess(464, "GRADED", gradedFileBis464.fsName, gradedFileName464);
    } catch (e) {
        logImportError(464, "GRADED", gradedFileBis464.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess464) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00464 (normal)");
}

// Import plan GRADED 00465
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465.mov");
var gradedFilePoignees465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465_AVEC_POIGNEES.mov");
var gradedFileBis465 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00465bis.mov");

var gradedImportSuccess465 = false;
var gradedFileName465 = "";

// Tenter import standard
if (gradedFile465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFile465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465";
        gradingSources[465] = gradedFootage465;
        gradedFileName465 = "UNDLM_00465.mov";
        gradedImportSuccess465 = true;
        gradingImportCount++;
        logImportSuccess(465, "GRADED", gradedFile465.fsName, gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED", gradedFile465.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess465 && gradedFilePoignees465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFilePoignees465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465";
        gradingSources[465] = gradedFootage465;
        gradedFileName465 = "UNDLM_00465_AVEC_POIGNEES.mov";
        gradedImportSuccess465 = true;
        gradingImportCount++;
        logImportSuccess(465, "GRADED", gradedFilePoignees465.fsName, gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED", gradedFilePoignees465.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess465 && gradedFileBis465.exists) {
    try {
        var gradedFootage465 = project.importFile(new ImportOptions(gradedFileBis465));
        gradedFootage465.parentFolder = fromGradingFolder;
        gradedFootage465.name = "UNDLM_00465";
        gradingSources[465] = gradedFootage465;
        gradedFileName465 = "UNDLM_00465bis.mov";
        gradedImportSuccess465 = true;
        gradingImportCount++;
        logImportSuccess(465, "GRADED", gradedFileBis465.fsName, gradedFileName465);
    } catch (e) {
        logImportError(465, "GRADED", gradedFileBis465.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess465) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00465 (normal)");
}

// Import plan GRADED 00466
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466.mov");
var gradedFilePoignees466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466_AVEC_POIGNEES.mov");
var gradedFileBis466 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00466bis.mov");

var gradedImportSuccess466 = false;
var gradedFileName466 = "";

// Tenter import standard
if (gradedFile466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFile466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466";
        gradingSources[466] = gradedFootage466;
        gradedFileName466 = "UNDLM_00466.mov";
        gradedImportSuccess466 = true;
        gradingImportCount++;
        logImportSuccess(466, "GRADED", gradedFile466.fsName, gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED", gradedFile466.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess466 && gradedFilePoignees466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFilePoignees466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466";
        gradingSources[466] = gradedFootage466;
        gradedFileName466 = "UNDLM_00466_AVEC_POIGNEES.mov";
        gradedImportSuccess466 = true;
        gradingImportCount++;
        logImportSuccess(466, "GRADED", gradedFilePoignees466.fsName, gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED", gradedFilePoignees466.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess466 && gradedFileBis466.exists) {
    try {
        var gradedFootage466 = project.importFile(new ImportOptions(gradedFileBis466));
        gradedFootage466.parentFolder = fromGradingFolder;
        gradedFootage466.name = "UNDLM_00466";
        gradingSources[466] = gradedFootage466;
        gradedFileName466 = "UNDLM_00466bis.mov";
        gradedImportSuccess466 = true;
        gradingImportCount++;
        logImportSuccess(466, "GRADED", gradedFileBis466.fsName, gradedFileName466);
    } catch (e) {
        logImportError(466, "GRADED", gradedFileBis466.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess466) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00466 (normal)");
}

// Import plan GRADED 00467
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467.mov");
var gradedFilePoignees467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467_AVEC_POIGNEES.mov");
var gradedFileBis467 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00467bis.mov");

var gradedImportSuccess467 = false;
var gradedFileName467 = "";

// Tenter import standard
if (gradedFile467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFile467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467";
        gradingSources[467] = gradedFootage467;
        gradedFileName467 = "UNDLM_00467.mov";
        gradedImportSuccess467 = true;
        gradingImportCount++;
        logImportSuccess(467, "GRADED", gradedFile467.fsName, gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED", gradedFile467.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess467 && gradedFilePoignees467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFilePoignees467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467";
        gradingSources[467] = gradedFootage467;
        gradedFileName467 = "UNDLM_00467_AVEC_POIGNEES.mov";
        gradedImportSuccess467 = true;
        gradingImportCount++;
        logImportSuccess(467, "GRADED", gradedFilePoignees467.fsName, gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED", gradedFilePoignees467.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess467 && gradedFileBis467.exists) {
    try {
        var gradedFootage467 = project.importFile(new ImportOptions(gradedFileBis467));
        gradedFootage467.parentFolder = fromGradingFolder;
        gradedFootage467.name = "UNDLM_00467";
        gradingSources[467] = gradedFootage467;
        gradedFileName467 = "UNDLM_00467bis.mov";
        gradedImportSuccess467 = true;
        gradingImportCount++;
        logImportSuccess(467, "GRADED", gradedFileBis467.fsName, gradedFileName467);
    } catch (e) {
        logImportError(467, "GRADED", gradedFileBis467.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess467) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00467 (normal)");
}

// Import plan GRADED 00468
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468.mov");
var gradedFilePoignees468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468_AVEC_POIGNEES.mov");
var gradedFileBis468 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00468bis.mov");

var gradedImportSuccess468 = false;
var gradedFileName468 = "";

// Tenter import standard
if (gradedFile468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFile468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468";
        gradingSources[468] = gradedFootage468;
        gradedFileName468 = "UNDLM_00468.mov";
        gradedImportSuccess468 = true;
        gradingImportCount++;
        logImportSuccess(468, "GRADED", gradedFile468.fsName, gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED", gradedFile468.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess468 && gradedFilePoignees468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFilePoignees468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468";
        gradingSources[468] = gradedFootage468;
        gradedFileName468 = "UNDLM_00468_AVEC_POIGNEES.mov";
        gradedImportSuccess468 = true;
        gradingImportCount++;
        logImportSuccess(468, "GRADED", gradedFilePoignees468.fsName, gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED", gradedFilePoignees468.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess468 && gradedFileBis468.exists) {
    try {
        var gradedFootage468 = project.importFile(new ImportOptions(gradedFileBis468));
        gradedFootage468.parentFolder = fromGradingFolder;
        gradedFootage468.name = "UNDLM_00468";
        gradingSources[468] = gradedFootage468;
        gradedFileName468 = "UNDLM_00468bis.mov";
        gradedImportSuccess468 = true;
        gradingImportCount++;
        logImportSuccess(468, "GRADED", gradedFileBis468.fsName, gradedFileName468);
    } catch (e) {
        logImportError(468, "GRADED", gradedFileBis468.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess468) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00468 (normal)");
}

// Import plan GRADED 00469
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469.mov");
var gradedFilePoignees469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469_AVEC_POIGNEES.mov");
var gradedFileBis469 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00469bis.mov");

var gradedImportSuccess469 = false;
var gradedFileName469 = "";

// Tenter import standard
if (gradedFile469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFile469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469";
        gradingSources[469] = gradedFootage469;
        gradedFileName469 = "UNDLM_00469.mov";
        gradedImportSuccess469 = true;
        gradingImportCount++;
        logImportSuccess(469, "GRADED", gradedFile469.fsName, gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED", gradedFile469.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess469 && gradedFilePoignees469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFilePoignees469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469";
        gradingSources[469] = gradedFootage469;
        gradedFileName469 = "UNDLM_00469_AVEC_POIGNEES.mov";
        gradedImportSuccess469 = true;
        gradingImportCount++;
        logImportSuccess(469, "GRADED", gradedFilePoignees469.fsName, gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED", gradedFilePoignees469.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess469 && gradedFileBis469.exists) {
    try {
        var gradedFootage469 = project.importFile(new ImportOptions(gradedFileBis469));
        gradedFootage469.parentFolder = fromGradingFolder;
        gradedFootage469.name = "UNDLM_00469";
        gradingSources[469] = gradedFootage469;
        gradedFileName469 = "UNDLM_00469bis.mov";
        gradedImportSuccess469 = true;
        gradingImportCount++;
        logImportSuccess(469, "GRADED", gradedFileBis469.fsName, gradedFileName469);
    } catch (e) {
        logImportError(469, "GRADED", gradedFileBis469.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess469) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00469 (normal)");
}

// Import plan GRADED 00470
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470.mov");
var gradedFilePoignees470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470_AVEC_POIGNEES.mov");
var gradedFileBis470 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00470bis.mov");

var gradedImportSuccess470 = false;
var gradedFileName470 = "";

// Tenter import standard
if (gradedFile470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFile470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470";
        gradingSources[470] = gradedFootage470;
        gradedFileName470 = "UNDLM_00470.mov";
        gradedImportSuccess470 = true;
        gradingImportCount++;
        logImportSuccess(470, "GRADED", gradedFile470.fsName, gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED", gradedFile470.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess470 && gradedFilePoignees470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFilePoignees470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470";
        gradingSources[470] = gradedFootage470;
        gradedFileName470 = "UNDLM_00470_AVEC_POIGNEES.mov";
        gradedImportSuccess470 = true;
        gradingImportCount++;
        logImportSuccess(470, "GRADED", gradedFilePoignees470.fsName, gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED", gradedFilePoignees470.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess470 && gradedFileBis470.exists) {
    try {
        var gradedFootage470 = project.importFile(new ImportOptions(gradedFileBis470));
        gradedFootage470.parentFolder = fromGradingFolder;
        gradedFootage470.name = "UNDLM_00470";
        gradingSources[470] = gradedFootage470;
        gradedFileName470 = "UNDLM_00470bis.mov";
        gradedImportSuccess470 = true;
        gradingImportCount++;
        logImportSuccess(470, "GRADED", gradedFileBis470.fsName, gradedFileName470);
    } catch (e) {
        logImportError(470, "GRADED", gradedFileBis470.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess470) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00470 (normal)");
}

// Import plan GRADED 00471
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471.mov");
var gradedFilePoignees471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471_AVEC_POIGNEES.mov");
var gradedFileBis471 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00471bis.mov");

var gradedImportSuccess471 = false;
var gradedFileName471 = "";

// Tenter import standard
if (gradedFile471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFile471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471";
        gradingSources[471] = gradedFootage471;
        gradedFileName471 = "UNDLM_00471.mov";
        gradedImportSuccess471 = true;
        gradingImportCount++;
        logImportSuccess(471, "GRADED", gradedFile471.fsName, gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED", gradedFile471.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess471 && gradedFilePoignees471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFilePoignees471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471";
        gradingSources[471] = gradedFootage471;
        gradedFileName471 = "UNDLM_00471_AVEC_POIGNEES.mov";
        gradedImportSuccess471 = true;
        gradingImportCount++;
        logImportSuccess(471, "GRADED", gradedFilePoignees471.fsName, gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED", gradedFilePoignees471.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess471 && gradedFileBis471.exists) {
    try {
        var gradedFootage471 = project.importFile(new ImportOptions(gradedFileBis471));
        gradedFootage471.parentFolder = fromGradingFolder;
        gradedFootage471.name = "UNDLM_00471";
        gradingSources[471] = gradedFootage471;
        gradedFileName471 = "UNDLM_00471bis.mov";
        gradedImportSuccess471 = true;
        gradingImportCount++;
        logImportSuccess(471, "GRADED", gradedFileBis471.fsName, gradedFileName471);
    } catch (e) {
        logImportError(471, "GRADED", gradedFileBis471.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess471) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00471 (normal)");
}

// Import plan GRADED 00472
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472.mov");
var gradedFilePoignees472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472_AVEC_POIGNEES.mov");
var gradedFileBis472 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00472bis.mov");

var gradedImportSuccess472 = false;
var gradedFileName472 = "";

// Tenter import standard
if (gradedFile472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFile472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472";
        gradingSources[472] = gradedFootage472;
        gradedFileName472 = "UNDLM_00472.mov";
        gradedImportSuccess472 = true;
        gradingImportCount++;
        logImportSuccess(472, "GRADED", gradedFile472.fsName, gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED", gradedFile472.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess472 && gradedFilePoignees472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFilePoignees472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472";
        gradingSources[472] = gradedFootage472;
        gradedFileName472 = "UNDLM_00472_AVEC_POIGNEES.mov";
        gradedImportSuccess472 = true;
        gradingImportCount++;
        logImportSuccess(472, "GRADED", gradedFilePoignees472.fsName, gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED", gradedFilePoignees472.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess472 && gradedFileBis472.exists) {
    try {
        var gradedFootage472 = project.importFile(new ImportOptions(gradedFileBis472));
        gradedFootage472.parentFolder = fromGradingFolder;
        gradedFootage472.name = "UNDLM_00472";
        gradingSources[472] = gradedFootage472;
        gradedFileName472 = "UNDLM_00472bis.mov";
        gradedImportSuccess472 = true;
        gradingImportCount++;
        logImportSuccess(472, "GRADED", gradedFileBis472.fsName, gradedFileName472);
    } catch (e) {
        logImportError(472, "GRADED", gradedFileBis472.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess472) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00472 (normal)");
}

// Import plan GRADED 00473
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473.mov");
var gradedFilePoignees473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473_AVEC_POIGNEES.mov");
var gradedFileBis473 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00473bis.mov");

var gradedImportSuccess473 = false;
var gradedFileName473 = "";

// Tenter import standard
if (gradedFile473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFile473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473";
        gradingSources[473] = gradedFootage473;
        gradedFileName473 = "UNDLM_00473.mov";
        gradedImportSuccess473 = true;
        gradingImportCount++;
        logImportSuccess(473, "GRADED", gradedFile473.fsName, gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED", gradedFile473.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess473 && gradedFilePoignees473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFilePoignees473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473";
        gradingSources[473] = gradedFootage473;
        gradedFileName473 = "UNDLM_00473_AVEC_POIGNEES.mov";
        gradedImportSuccess473 = true;
        gradingImportCount++;
        logImportSuccess(473, "GRADED", gradedFilePoignees473.fsName, gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED", gradedFilePoignees473.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess473 && gradedFileBis473.exists) {
    try {
        var gradedFootage473 = project.importFile(new ImportOptions(gradedFileBis473));
        gradedFootage473.parentFolder = fromGradingFolder;
        gradedFootage473.name = "UNDLM_00473";
        gradingSources[473] = gradedFootage473;
        gradedFileName473 = "UNDLM_00473bis.mov";
        gradedImportSuccess473 = true;
        gradingImportCount++;
        logImportSuccess(473, "GRADED", gradedFileBis473.fsName, gradedFileName473);
    } catch (e) {
        logImportError(473, "GRADED", gradedFileBis473.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess473) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00473 (normal)");
}

// Import plan GRADED 00474
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474.mov");
var gradedFilePoignees474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474_AVEC_POIGNEES.mov");
var gradedFileBis474 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00474bis.mov");

var gradedImportSuccess474 = false;
var gradedFileName474 = "";

// Tenter import standard
if (gradedFile474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFile474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474";
        gradingSources[474] = gradedFootage474;
        gradedFileName474 = "UNDLM_00474.mov";
        gradedImportSuccess474 = true;
        gradingImportCount++;
        logImportSuccess(474, "GRADED", gradedFile474.fsName, gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED", gradedFile474.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess474 && gradedFilePoignees474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFilePoignees474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474";
        gradingSources[474] = gradedFootage474;
        gradedFileName474 = "UNDLM_00474_AVEC_POIGNEES.mov";
        gradedImportSuccess474 = true;
        gradingImportCount++;
        logImportSuccess(474, "GRADED", gradedFilePoignees474.fsName, gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED", gradedFilePoignees474.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess474 && gradedFileBis474.exists) {
    try {
        var gradedFootage474 = project.importFile(new ImportOptions(gradedFileBis474));
        gradedFootage474.parentFolder = fromGradingFolder;
        gradedFootage474.name = "UNDLM_00474";
        gradingSources[474] = gradedFootage474;
        gradedFileName474 = "UNDLM_00474bis.mov";
        gradedImportSuccess474 = true;
        gradingImportCount++;
        logImportSuccess(474, "GRADED", gradedFileBis474.fsName, gradedFileName474);
    } catch (e) {
        logImportError(474, "GRADED", gradedFileBis474.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess474) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00474 (normal)");
}

// Import plan GRADED 00475
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475.mov");
var gradedFilePoignees475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475_AVEC_POIGNEES.mov");
var gradedFileBis475 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00475bis.mov");

var gradedImportSuccess475 = false;
var gradedFileName475 = "";

// Tenter import standard
if (gradedFile475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFile475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475";
        gradingSources[475] = gradedFootage475;
        gradedFileName475 = "UNDLM_00475.mov";
        gradedImportSuccess475 = true;
        gradingImportCount++;
        logImportSuccess(475, "GRADED", gradedFile475.fsName, gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED", gradedFile475.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess475 && gradedFilePoignees475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFilePoignees475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475";
        gradingSources[475] = gradedFootage475;
        gradedFileName475 = "UNDLM_00475_AVEC_POIGNEES.mov";
        gradedImportSuccess475 = true;
        gradingImportCount++;
        logImportSuccess(475, "GRADED", gradedFilePoignees475.fsName, gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED", gradedFilePoignees475.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess475 && gradedFileBis475.exists) {
    try {
        var gradedFootage475 = project.importFile(new ImportOptions(gradedFileBis475));
        gradedFootage475.parentFolder = fromGradingFolder;
        gradedFootage475.name = "UNDLM_00475";
        gradingSources[475] = gradedFootage475;
        gradedFileName475 = "UNDLM_00475bis.mov";
        gradedImportSuccess475 = true;
        gradingImportCount++;
        logImportSuccess(475, "GRADED", gradedFileBis475.fsName, gradedFileName475);
    } catch (e) {
        logImportError(475, "GRADED", gradedFileBis475.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess475) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00475 (normal)");
}

// Import plan GRADED 00476
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476.mov");
var gradedFilePoignees476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476_AVEC_POIGNEES.mov");
var gradedFileBis476 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00476bis.mov");

var gradedImportSuccess476 = false;
var gradedFileName476 = "";

// Tenter import standard
if (gradedFile476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFile476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476";
        gradingSources[476] = gradedFootage476;
        gradedFileName476 = "UNDLM_00476.mov";
        gradedImportSuccess476 = true;
        gradingImportCount++;
        logImportSuccess(476, "GRADED", gradedFile476.fsName, gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED", gradedFile476.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess476 && gradedFilePoignees476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFilePoignees476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476";
        gradingSources[476] = gradedFootage476;
        gradedFileName476 = "UNDLM_00476_AVEC_POIGNEES.mov";
        gradedImportSuccess476 = true;
        gradingImportCount++;
        logImportSuccess(476, "GRADED", gradedFilePoignees476.fsName, gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED", gradedFilePoignees476.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess476 && gradedFileBis476.exists) {
    try {
        var gradedFootage476 = project.importFile(new ImportOptions(gradedFileBis476));
        gradedFootage476.parentFolder = fromGradingFolder;
        gradedFootage476.name = "UNDLM_00476";
        gradingSources[476] = gradedFootage476;
        gradedFileName476 = "UNDLM_00476bis.mov";
        gradedImportSuccess476 = true;
        gradingImportCount++;
        logImportSuccess(476, "GRADED", gradedFileBis476.fsName, gradedFileName476);
    } catch (e) {
        logImportError(476, "GRADED", gradedFileBis476.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess476) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00476 (normal)");
}

// Import plan GRADED 00477
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477.mov");
var gradedFilePoignees477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477_AVEC_POIGNEES.mov");
var gradedFileBis477 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00477bis.mov");

var gradedImportSuccess477 = false;
var gradedFileName477 = "";

// Tenter import standard
if (gradedFile477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFile477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477";
        gradingSources[477] = gradedFootage477;
        gradedFileName477 = "UNDLM_00477.mov";
        gradedImportSuccess477 = true;
        gradingImportCount++;
        logImportSuccess(477, "GRADED", gradedFile477.fsName, gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED", gradedFile477.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess477 && gradedFilePoignees477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFilePoignees477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477";
        gradingSources[477] = gradedFootage477;
        gradedFileName477 = "UNDLM_00477_AVEC_POIGNEES.mov";
        gradedImportSuccess477 = true;
        gradingImportCount++;
        logImportSuccess(477, "GRADED", gradedFilePoignees477.fsName, gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED", gradedFilePoignees477.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess477 && gradedFileBis477.exists) {
    try {
        var gradedFootage477 = project.importFile(new ImportOptions(gradedFileBis477));
        gradedFootage477.parentFolder = fromGradingFolder;
        gradedFootage477.name = "UNDLM_00477";
        gradingSources[477] = gradedFootage477;
        gradedFileName477 = "UNDLM_00477bis.mov";
        gradedImportSuccess477 = true;
        gradingImportCount++;
        logImportSuccess(477, "GRADED", gradedFileBis477.fsName, gradedFileName477);
    } catch (e) {
        logImportError(477, "GRADED", gradedFileBis477.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess477) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00477 (normal)");
}

// Import plan GRADED 00501
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501.mov");
var gradedFilePoignees501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501_AVEC_POIGNEES.mov");
var gradedFileBis501 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00501bis.mov");

var gradedImportSuccess501 = false;
var gradedFileName501 = "";

// Tenter import standard
if (gradedFile501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFile501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501";
        gradingSources[501] = gradedFootage501;
        gradedFileName501 = "UNDLM_00501.mov";
        gradedImportSuccess501 = true;
        gradingImportCount++;
        logImportSuccess(501, "GRADED", gradedFile501.fsName, gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED", gradedFile501.fsName, e.toString());
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess501 && gradedFilePoignees501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFilePoignees501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501";
        gradingSources[501] = gradedFootage501;
        gradedFileName501 = "UNDLM_00501_AVEC_POIGNEES.mov";
        gradedImportSuccess501 = true;
        gradingImportCount++;
        logImportSuccess(501, "GRADED", gradedFilePoignees501.fsName, gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED", gradedFilePoignees501.fsName, e.toString());
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess501 && gradedFileBis501.exists) {
    try {
        var gradedFootage501 = project.importFile(new ImportOptions(gradedFileBis501));
        gradedFootage501.parentFolder = fromGradingFolder;
        gradedFootage501.name = "UNDLM_00501";
        gradingSources[501] = gradedFootage501;
        gradedFileName501 = "UNDLM_00501bis.mov";
        gradedImportSuccess501 = true;
        gradingImportCount++;
        logImportSuccess(501, "GRADED", gradedFileBis501.fsName, gradedFileName501);
    } catch (e) {
        logImportError(501, "GRADED", gradedFileBis501.fsName, e.toString());
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess501) {
    missingGradingCount++;
    $.writeln("📝 Plan GRADED non disponible: UNDLM_00501 (normal)");
}

// Rapport final d'import
alert("📊 RAPPORT D'IMPORT FINAL:" + "\n" +
      "EDIT importés: " + editImportCount + "/71" + "\n" +
      "GRADED importés: " + gradingImportCount + "/71" + "\n" +
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


// Composition pour plan 00175
var planComp175 = project.items.addComp(
    "SQ08_UNDLM_00175",
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


// Composition pour plan 00176
var planComp176 = project.items.addComp(
    "SQ09_UNDLM_00176",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp176.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer176 = planComp176.layers.add(bgSolidComp);
bgLayer176.name = "BG_SOLID";
bgLayer176.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer176 = false;
if (gradingSources[176]) {
    var gradedLayer176 = planComp176.layers.add(gradingSources[176]);
    gradedLayer176.name = "UNDLM_00176_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer176.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer176.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer176 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer176 = false;
if (editSources[176]) {
    var editLayer176 = planComp176.layers.add(editSources[176]);
    editLayer176.name = "UNDLM_00176_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer176.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer176.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer176 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer176) {
    // EDIT toujours activé quand disponible
    editLayer176.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer176) {
        gradedLayer176.enabled = false;
    }
} else if (hasGradedLayer176) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer176.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText176 = planComp176.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText176.name = "WARNING_NO_EDIT";
    warningText176.property("Transform").property("Position").setValue([1280, 200]);
    warningText176.guideLayer = true;
    
    var warningTextDoc176 = warningText176.property("Source Text").value;
    warningTextDoc176.fontSize = 32;
    warningTextDoc176.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc176.font = "Arial-BoldMT";
    warningTextDoc176.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText176.property("Source Text").setValue(warningTextDoc176);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText176 = planComp176.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00176");
    errorText176.name = "ERROR_NO_SOURCE";
    errorText176.property("Transform").property("Position").setValue([1280, 720]);
    errorText176.guideLayer = true;
    
    var errorTextDoc176 = errorText176.property("Source Text").value;
    errorTextDoc176.fontSize = 48;
    errorTextDoc176.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc176.font = "Arial-BoldMT";
    errorTextDoc176.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText176.property("Source Text").setValue(errorTextDoc176);
}

planCompositions[176] = planComp176;


// Composition pour plan 00177
var planComp177 = project.items.addComp(
    "SQ09_UNDLM_00177",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp177.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer177 = planComp177.layers.add(bgSolidComp);
bgLayer177.name = "BG_SOLID";
bgLayer177.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer177 = false;
if (gradingSources[177]) {
    var gradedLayer177 = planComp177.layers.add(gradingSources[177]);
    gradedLayer177.name = "UNDLM_00177_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer177.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer177.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer177 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer177 = false;
if (editSources[177]) {
    var editLayer177 = planComp177.layers.add(editSources[177]);
    editLayer177.name = "UNDLM_00177_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer177.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer177.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer177 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer177) {
    // EDIT toujours activé quand disponible
    editLayer177.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer177) {
        gradedLayer177.enabled = false;
    }
} else if (hasGradedLayer177) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer177.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText177 = planComp177.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText177.name = "WARNING_NO_EDIT";
    warningText177.property("Transform").property("Position").setValue([1280, 200]);
    warningText177.guideLayer = true;
    
    var warningTextDoc177 = warningText177.property("Source Text").value;
    warningTextDoc177.fontSize = 32;
    warningTextDoc177.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc177.font = "Arial-BoldMT";
    warningTextDoc177.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText177.property("Source Text").setValue(warningTextDoc177);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText177 = planComp177.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00177");
    errorText177.name = "ERROR_NO_SOURCE";
    errorText177.property("Transform").property("Position").setValue([1280, 720]);
    errorText177.guideLayer = true;
    
    var errorTextDoc177 = errorText177.property("Source Text").value;
    errorTextDoc177.fontSize = 48;
    errorTextDoc177.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc177.font = "Arial-BoldMT";
    errorTextDoc177.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText177.property("Source Text").setValue(errorTextDoc177);
}

planCompositions[177] = planComp177;


// Composition pour plan 00193
var planComp193 = project.items.addComp(
    "SQ10_UNDLM_00193",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp193.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer193 = planComp193.layers.add(bgSolidComp);
bgLayer193.name = "BG_SOLID";
bgLayer193.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer193 = false;
if (gradingSources[193]) {
    var gradedLayer193 = planComp193.layers.add(gradingSources[193]);
    gradedLayer193.name = "UNDLM_00193_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer193.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer193.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer193 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer193 = false;
if (editSources[193]) {
    var editLayer193 = planComp193.layers.add(editSources[193]);
    editLayer193.name = "UNDLM_00193_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer193.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer193.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer193 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer193) {
    // EDIT toujours activé quand disponible
    editLayer193.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer193) {
        gradedLayer193.enabled = false;
    }
} else if (hasGradedLayer193) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer193.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText193 = planComp193.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText193.name = "WARNING_NO_EDIT";
    warningText193.property("Transform").property("Position").setValue([1280, 200]);
    warningText193.guideLayer = true;
    
    var warningTextDoc193 = warningText193.property("Source Text").value;
    warningTextDoc193.fontSize = 32;
    warningTextDoc193.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc193.font = "Arial-BoldMT";
    warningTextDoc193.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText193.property("Source Text").setValue(warningTextDoc193);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText193 = planComp193.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00193");
    errorText193.name = "ERROR_NO_SOURCE";
    errorText193.property("Transform").property("Position").setValue([1280, 720]);
    errorText193.guideLayer = true;
    
    var errorTextDoc193 = errorText193.property("Source Text").value;
    errorTextDoc193.fontSize = 48;
    errorTextDoc193.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc193.font = "Arial-BoldMT";
    errorTextDoc193.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText193.property("Source Text").setValue(errorTextDoc193);
}

planCompositions[193] = planComp193;


// Composition pour plan 00194
var planComp194 = project.items.addComp(
    "SQ10_UNDLM_00194",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp194.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer194 = planComp194.layers.add(bgSolidComp);
bgLayer194.name = "BG_SOLID";
bgLayer194.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer194 = false;
if (gradingSources[194]) {
    var gradedLayer194 = planComp194.layers.add(gradingSources[194]);
    gradedLayer194.name = "UNDLM_00194_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer194.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer194.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer194 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer194 = false;
if (editSources[194]) {
    var editLayer194 = planComp194.layers.add(editSources[194]);
    editLayer194.name = "UNDLM_00194_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer194.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer194.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer194 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer194) {
    // EDIT toujours activé quand disponible
    editLayer194.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer194) {
        gradedLayer194.enabled = false;
    }
} else if (hasGradedLayer194) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer194.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText194 = planComp194.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText194.name = "WARNING_NO_EDIT";
    warningText194.property("Transform").property("Position").setValue([1280, 200]);
    warningText194.guideLayer = true;
    
    var warningTextDoc194 = warningText194.property("Source Text").value;
    warningTextDoc194.fontSize = 32;
    warningTextDoc194.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc194.font = "Arial-BoldMT";
    warningTextDoc194.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText194.property("Source Text").setValue(warningTextDoc194);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText194 = planComp194.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00194");
    errorText194.name = "ERROR_NO_SOURCE";
    errorText194.property("Transform").property("Position").setValue([1280, 720]);
    errorText194.guideLayer = true;
    
    var errorTextDoc194 = errorText194.property("Source Text").value;
    errorTextDoc194.fontSize = 48;
    errorTextDoc194.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc194.font = "Arial-BoldMT";
    errorTextDoc194.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText194.property("Source Text").setValue(errorTextDoc194);
}

planCompositions[194] = planComp194;


// Composition pour plan 00195
var planComp195 = project.items.addComp(
    "SQ10_UNDLM_00195",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp195.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer195 = planComp195.layers.add(bgSolidComp);
bgLayer195.name = "BG_SOLID";
bgLayer195.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer195 = false;
if (gradingSources[195]) {
    var gradedLayer195 = planComp195.layers.add(gradingSources[195]);
    gradedLayer195.name = "UNDLM_00195_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer195.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer195.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer195 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer195 = false;
if (editSources[195]) {
    var editLayer195 = planComp195.layers.add(editSources[195]);
    editLayer195.name = "UNDLM_00195_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer195.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer195.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer195 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer195) {
    // EDIT toujours activé quand disponible
    editLayer195.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer195) {
        gradedLayer195.enabled = false;
    }
} else if (hasGradedLayer195) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer195.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText195 = planComp195.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText195.name = "WARNING_NO_EDIT";
    warningText195.property("Transform").property("Position").setValue([1280, 200]);
    warningText195.guideLayer = true;
    
    var warningTextDoc195 = warningText195.property("Source Text").value;
    warningTextDoc195.fontSize = 32;
    warningTextDoc195.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc195.font = "Arial-BoldMT";
    warningTextDoc195.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText195.property("Source Text").setValue(warningTextDoc195);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText195 = planComp195.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00195");
    errorText195.name = "ERROR_NO_SOURCE";
    errorText195.property("Transform").property("Position").setValue([1280, 720]);
    errorText195.guideLayer = true;
    
    var errorTextDoc195 = errorText195.property("Source Text").value;
    errorTextDoc195.fontSize = 48;
    errorTextDoc195.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc195.font = "Arial-BoldMT";
    errorTextDoc195.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText195.property("Source Text").setValue(errorTextDoc195);
}

planCompositions[195] = planComp195;


// Composition pour plan 00196
var planComp196 = project.items.addComp(
    "SQ10_UNDLM_00196",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp196.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer196 = planComp196.layers.add(bgSolidComp);
bgLayer196.name = "BG_SOLID";
bgLayer196.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer196 = false;
if (gradingSources[196]) {
    var gradedLayer196 = planComp196.layers.add(gradingSources[196]);
    gradedLayer196.name = "UNDLM_00196_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer196.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer196.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer196 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer196 = false;
if (editSources[196]) {
    var editLayer196 = planComp196.layers.add(editSources[196]);
    editLayer196.name = "UNDLM_00196_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer196.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer196.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer196 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer196) {
    // EDIT toujours activé quand disponible
    editLayer196.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer196) {
        gradedLayer196.enabled = false;
    }
} else if (hasGradedLayer196) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer196.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText196 = planComp196.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText196.name = "WARNING_NO_EDIT";
    warningText196.property("Transform").property("Position").setValue([1280, 200]);
    warningText196.guideLayer = true;
    
    var warningTextDoc196 = warningText196.property("Source Text").value;
    warningTextDoc196.fontSize = 32;
    warningTextDoc196.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc196.font = "Arial-BoldMT";
    warningTextDoc196.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText196.property("Source Text").setValue(warningTextDoc196);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText196 = planComp196.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00196");
    errorText196.name = "ERROR_NO_SOURCE";
    errorText196.property("Transform").property("Position").setValue([1280, 720]);
    errorText196.guideLayer = true;
    
    var errorTextDoc196 = errorText196.property("Source Text").value;
    errorTextDoc196.fontSize = 48;
    errorTextDoc196.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc196.font = "Arial-BoldMT";
    errorTextDoc196.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText196.property("Source Text").setValue(errorTextDoc196);
}

planCompositions[196] = planComp196;


// Composition pour plan 00197
var planComp197 = project.items.addComp(
    "SQ10_UNDLM_00197",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp197.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer197 = planComp197.layers.add(bgSolidComp);
bgLayer197.name = "BG_SOLID";
bgLayer197.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer197 = false;
if (gradingSources[197]) {
    var gradedLayer197 = planComp197.layers.add(gradingSources[197]);
    gradedLayer197.name = "UNDLM_00197_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer197.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer197.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer197 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer197 = false;
if (editSources[197]) {
    var editLayer197 = planComp197.layers.add(editSources[197]);
    editLayer197.name = "UNDLM_00197_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer197.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer197.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer197 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer197) {
    // EDIT toujours activé quand disponible
    editLayer197.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer197) {
        gradedLayer197.enabled = false;
    }
} else if (hasGradedLayer197) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer197.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText197 = planComp197.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText197.name = "WARNING_NO_EDIT";
    warningText197.property("Transform").property("Position").setValue([1280, 200]);
    warningText197.guideLayer = true;
    
    var warningTextDoc197 = warningText197.property("Source Text").value;
    warningTextDoc197.fontSize = 32;
    warningTextDoc197.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc197.font = "Arial-BoldMT";
    warningTextDoc197.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText197.property("Source Text").setValue(warningTextDoc197);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText197 = planComp197.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00197");
    errorText197.name = "ERROR_NO_SOURCE";
    errorText197.property("Transform").property("Position").setValue([1280, 720]);
    errorText197.guideLayer = true;
    
    var errorTextDoc197 = errorText197.property("Source Text").value;
    errorTextDoc197.fontSize = 48;
    errorTextDoc197.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc197.font = "Arial-BoldMT";
    errorTextDoc197.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText197.property("Source Text").setValue(errorTextDoc197);
}

planCompositions[197] = planComp197;


// Composition pour plan 00198
var planComp198 = project.items.addComp(
    "SQ10_UNDLM_00198",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp198.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer198 = planComp198.layers.add(bgSolidComp);
bgLayer198.name = "BG_SOLID";
bgLayer198.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer198 = false;
if (gradingSources[198]) {
    var gradedLayer198 = planComp198.layers.add(gradingSources[198]);
    gradedLayer198.name = "UNDLM_00198_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer198.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer198.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer198 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer198 = false;
if (editSources[198]) {
    var editLayer198 = planComp198.layers.add(editSources[198]);
    editLayer198.name = "UNDLM_00198_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer198.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer198.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer198 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer198) {
    // EDIT toujours activé quand disponible
    editLayer198.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer198) {
        gradedLayer198.enabled = false;
    }
} else if (hasGradedLayer198) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer198.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText198 = planComp198.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText198.name = "WARNING_NO_EDIT";
    warningText198.property("Transform").property("Position").setValue([1280, 200]);
    warningText198.guideLayer = true;
    
    var warningTextDoc198 = warningText198.property("Source Text").value;
    warningTextDoc198.fontSize = 32;
    warningTextDoc198.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc198.font = "Arial-BoldMT";
    warningTextDoc198.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText198.property("Source Text").setValue(warningTextDoc198);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText198 = planComp198.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00198");
    errorText198.name = "ERROR_NO_SOURCE";
    errorText198.property("Transform").property("Position").setValue([1280, 720]);
    errorText198.guideLayer = true;
    
    var errorTextDoc198 = errorText198.property("Source Text").value;
    errorTextDoc198.fontSize = 48;
    errorTextDoc198.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc198.font = "Arial-BoldMT";
    errorTextDoc198.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText198.property("Source Text").setValue(errorTextDoc198);
}

planCompositions[198] = planComp198;


// Composition pour plan 00199
var planComp199 = project.items.addComp(
    "SQ10_UNDLM_00199",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp199.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer199 = planComp199.layers.add(bgSolidComp);
bgLayer199.name = "BG_SOLID";
bgLayer199.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer199 = false;
if (gradingSources[199]) {
    var gradedLayer199 = planComp199.layers.add(gradingSources[199]);
    gradedLayer199.name = "UNDLM_00199_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer199.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer199.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer199 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer199 = false;
if (editSources[199]) {
    var editLayer199 = planComp199.layers.add(editSources[199]);
    editLayer199.name = "UNDLM_00199_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer199.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer199.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer199 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer199) {
    // EDIT toujours activé quand disponible
    editLayer199.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer199) {
        gradedLayer199.enabled = false;
    }
} else if (hasGradedLayer199) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer199.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText199 = planComp199.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText199.name = "WARNING_NO_EDIT";
    warningText199.property("Transform").property("Position").setValue([1280, 200]);
    warningText199.guideLayer = true;
    
    var warningTextDoc199 = warningText199.property("Source Text").value;
    warningTextDoc199.fontSize = 32;
    warningTextDoc199.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc199.font = "Arial-BoldMT";
    warningTextDoc199.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText199.property("Source Text").setValue(warningTextDoc199);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText199 = planComp199.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00199");
    errorText199.name = "ERROR_NO_SOURCE";
    errorText199.property("Transform").property("Position").setValue([1280, 720]);
    errorText199.guideLayer = true;
    
    var errorTextDoc199 = errorText199.property("Source Text").value;
    errorTextDoc199.fontSize = 48;
    errorTextDoc199.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc199.font = "Arial-BoldMT";
    errorTextDoc199.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText199.property("Source Text").setValue(errorTextDoc199);
}

planCompositions[199] = planComp199;


// Composition pour plan 00200
var planComp200 = project.items.addComp(
    "SQ10_UNDLM_00200",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp200.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer200 = planComp200.layers.add(bgSolidComp);
bgLayer200.name = "BG_SOLID";
bgLayer200.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer200 = false;
if (gradingSources[200]) {
    var gradedLayer200 = planComp200.layers.add(gradingSources[200]);
    gradedLayer200.name = "UNDLM_00200_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer200.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer200.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer200 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer200 = false;
if (editSources[200]) {
    var editLayer200 = planComp200.layers.add(editSources[200]);
    editLayer200.name = "UNDLM_00200_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer200.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer200.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer200 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer200) {
    // EDIT toujours activé quand disponible
    editLayer200.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer200) {
        gradedLayer200.enabled = false;
    }
} else if (hasGradedLayer200) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer200.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText200 = planComp200.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText200.name = "WARNING_NO_EDIT";
    warningText200.property("Transform").property("Position").setValue([1280, 200]);
    warningText200.guideLayer = true;
    
    var warningTextDoc200 = warningText200.property("Source Text").value;
    warningTextDoc200.fontSize = 32;
    warningTextDoc200.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc200.font = "Arial-BoldMT";
    warningTextDoc200.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText200.property("Source Text").setValue(warningTextDoc200);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText200 = planComp200.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00200");
    errorText200.name = "ERROR_NO_SOURCE";
    errorText200.property("Transform").property("Position").setValue([1280, 720]);
    errorText200.guideLayer = true;
    
    var errorTextDoc200 = errorText200.property("Source Text").value;
    errorTextDoc200.fontSize = 48;
    errorTextDoc200.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc200.font = "Arial-BoldMT";
    errorTextDoc200.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText200.property("Source Text").setValue(errorTextDoc200);
}

planCompositions[200] = planComp200;


// Composition pour plan 00201
var planComp201 = project.items.addComp(
    "SQ10_UNDLM_00201",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp201.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer201 = planComp201.layers.add(bgSolidComp);
bgLayer201.name = "BG_SOLID";
bgLayer201.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer201 = false;
if (gradingSources[201]) {
    var gradedLayer201 = planComp201.layers.add(gradingSources[201]);
    gradedLayer201.name = "UNDLM_00201_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer201.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer201.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer201 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer201 = false;
if (editSources[201]) {
    var editLayer201 = planComp201.layers.add(editSources[201]);
    editLayer201.name = "UNDLM_00201_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer201.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer201.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer201 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer201) {
    // EDIT toujours activé quand disponible
    editLayer201.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer201) {
        gradedLayer201.enabled = false;
    }
} else if (hasGradedLayer201) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer201.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText201 = planComp201.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText201.name = "WARNING_NO_EDIT";
    warningText201.property("Transform").property("Position").setValue([1280, 200]);
    warningText201.guideLayer = true;
    
    var warningTextDoc201 = warningText201.property("Source Text").value;
    warningTextDoc201.fontSize = 32;
    warningTextDoc201.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc201.font = "Arial-BoldMT";
    warningTextDoc201.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText201.property("Source Text").setValue(warningTextDoc201);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText201 = planComp201.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00201");
    errorText201.name = "ERROR_NO_SOURCE";
    errorText201.property("Transform").property("Position").setValue([1280, 720]);
    errorText201.guideLayer = true;
    
    var errorTextDoc201 = errorText201.property("Source Text").value;
    errorTextDoc201.fontSize = 48;
    errorTextDoc201.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc201.font = "Arial-BoldMT";
    errorTextDoc201.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText201.property("Source Text").setValue(errorTextDoc201);
}

planCompositions[201] = planComp201;


// Composition pour plan 00212
var planComp212 = project.items.addComp(
    "SQ12_UNDLM_00212",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp212.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer212 = planComp212.layers.add(bgSolidComp);
bgLayer212.name = "BG_SOLID";
bgLayer212.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer212 = false;
if (gradingSources[212]) {
    var gradedLayer212 = planComp212.layers.add(gradingSources[212]);
    gradedLayer212.name = "UNDLM_00212_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer212.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer212.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer212 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer212 = false;
if (editSources[212]) {
    var editLayer212 = planComp212.layers.add(editSources[212]);
    editLayer212.name = "UNDLM_00212_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer212.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer212.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer212 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer212) {
    // EDIT toujours activé quand disponible
    editLayer212.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer212) {
        gradedLayer212.enabled = false;
    }
} else if (hasGradedLayer212) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer212.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText212 = planComp212.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText212.name = "WARNING_NO_EDIT";
    warningText212.property("Transform").property("Position").setValue([1280, 200]);
    warningText212.guideLayer = true;
    
    var warningTextDoc212 = warningText212.property("Source Text").value;
    warningTextDoc212.fontSize = 32;
    warningTextDoc212.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc212.font = "Arial-BoldMT";
    warningTextDoc212.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText212.property("Source Text").setValue(warningTextDoc212);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText212 = planComp212.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00212");
    errorText212.name = "ERROR_NO_SOURCE";
    errorText212.property("Transform").property("Position").setValue([1280, 720]);
    errorText212.guideLayer = true;
    
    var errorTextDoc212 = errorText212.property("Source Text").value;
    errorTextDoc212.fontSize = 48;
    errorTextDoc212.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc212.font = "Arial-BoldMT";
    errorTextDoc212.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText212.property("Source Text").setValue(errorTextDoc212);
}

planCompositions[212] = planComp212;


// Composition pour plan 00213
var planComp213 = project.items.addComp(
    "SQ12_UNDLM_00213",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp213.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer213 = planComp213.layers.add(bgSolidComp);
bgLayer213.name = "BG_SOLID";
bgLayer213.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer213 = false;
if (gradingSources[213]) {
    var gradedLayer213 = planComp213.layers.add(gradingSources[213]);
    gradedLayer213.name = "UNDLM_00213_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer213.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer213.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer213 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer213 = false;
if (editSources[213]) {
    var editLayer213 = planComp213.layers.add(editSources[213]);
    editLayer213.name = "UNDLM_00213_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer213.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer213.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer213 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer213) {
    // EDIT toujours activé quand disponible
    editLayer213.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer213) {
        gradedLayer213.enabled = false;
    }
} else if (hasGradedLayer213) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer213.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText213 = planComp213.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText213.name = "WARNING_NO_EDIT";
    warningText213.property("Transform").property("Position").setValue([1280, 200]);
    warningText213.guideLayer = true;
    
    var warningTextDoc213 = warningText213.property("Source Text").value;
    warningTextDoc213.fontSize = 32;
    warningTextDoc213.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc213.font = "Arial-BoldMT";
    warningTextDoc213.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText213.property("Source Text").setValue(warningTextDoc213);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText213 = planComp213.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00213");
    errorText213.name = "ERROR_NO_SOURCE";
    errorText213.property("Transform").property("Position").setValue([1280, 720]);
    errorText213.guideLayer = true;
    
    var errorTextDoc213 = errorText213.property("Source Text").value;
    errorTextDoc213.fontSize = 48;
    errorTextDoc213.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc213.font = "Arial-BoldMT";
    errorTextDoc213.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText213.property("Source Text").setValue(errorTextDoc213);
}

planCompositions[213] = planComp213;


// Composition pour plan 00215
var planComp215 = project.items.addComp(
    "SQ12_UNDLM_00215",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp215.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer215 = planComp215.layers.add(bgSolidComp);
bgLayer215.name = "BG_SOLID";
bgLayer215.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer215 = false;
if (gradingSources[215]) {
    var gradedLayer215 = planComp215.layers.add(gradingSources[215]);
    gradedLayer215.name = "UNDLM_00215_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer215.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer215.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer215 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer215 = false;
if (editSources[215]) {
    var editLayer215 = planComp215.layers.add(editSources[215]);
    editLayer215.name = "UNDLM_00215_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer215.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer215.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer215 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer215) {
    // EDIT toujours activé quand disponible
    editLayer215.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer215) {
        gradedLayer215.enabled = false;
    }
} else if (hasGradedLayer215) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer215.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText215 = planComp215.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText215.name = "WARNING_NO_EDIT";
    warningText215.property("Transform").property("Position").setValue([1280, 200]);
    warningText215.guideLayer = true;
    
    var warningTextDoc215 = warningText215.property("Source Text").value;
    warningTextDoc215.fontSize = 32;
    warningTextDoc215.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc215.font = "Arial-BoldMT";
    warningTextDoc215.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText215.property("Source Text").setValue(warningTextDoc215);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText215 = planComp215.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00215");
    errorText215.name = "ERROR_NO_SOURCE";
    errorText215.property("Transform").property("Position").setValue([1280, 720]);
    errorText215.guideLayer = true;
    
    var errorTextDoc215 = errorText215.property("Source Text").value;
    errorTextDoc215.fontSize = 48;
    errorTextDoc215.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc215.font = "Arial-BoldMT";
    errorTextDoc215.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText215.property("Source Text").setValue(errorTextDoc215);
}

planCompositions[215] = planComp215;


// Composition pour plan 00216
var planComp216 = project.items.addComp(
    "SQ12_UNDLM_00216",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp216.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer216 = planComp216.layers.add(bgSolidComp);
bgLayer216.name = "BG_SOLID";
bgLayer216.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer216 = false;
if (gradingSources[216]) {
    var gradedLayer216 = planComp216.layers.add(gradingSources[216]);
    gradedLayer216.name = "UNDLM_00216_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer216.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer216.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer216 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer216 = false;
if (editSources[216]) {
    var editLayer216 = planComp216.layers.add(editSources[216]);
    editLayer216.name = "UNDLM_00216_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer216.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer216.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer216 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer216) {
    // EDIT toujours activé quand disponible
    editLayer216.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer216) {
        gradedLayer216.enabled = false;
    }
} else if (hasGradedLayer216) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer216.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText216 = planComp216.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText216.name = "WARNING_NO_EDIT";
    warningText216.property("Transform").property("Position").setValue([1280, 200]);
    warningText216.guideLayer = true;
    
    var warningTextDoc216 = warningText216.property("Source Text").value;
    warningTextDoc216.fontSize = 32;
    warningTextDoc216.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc216.font = "Arial-BoldMT";
    warningTextDoc216.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText216.property("Source Text").setValue(warningTextDoc216);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText216 = planComp216.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00216");
    errorText216.name = "ERROR_NO_SOURCE";
    errorText216.property("Transform").property("Position").setValue([1280, 720]);
    errorText216.guideLayer = true;
    
    var errorTextDoc216 = errorText216.property("Source Text").value;
    errorTextDoc216.fontSize = 48;
    errorTextDoc216.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc216.font = "Arial-BoldMT";
    errorTextDoc216.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText216.property("Source Text").setValue(errorTextDoc216);
}

planCompositions[216] = planComp216;


// Composition pour plan 00251
var planComp251 = project.items.addComp(
    "SQ14_UNDLM_00251",
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
    "SQ14_UNDLM_00252",
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


// Composition pour plan 00254
var planComp254 = project.items.addComp(
    "SQ14_UNDLM_00254",
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
    "SQ14_UNDLM_00255",
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
    "SQ14_UNDLM_00256",
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


// Composition pour plan 00262
var planComp262 = project.items.addComp(
    "SQ14_UNDLM_00262",
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
    "SQ14_UNDLM_00263",
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


// Composition pour plan 00275
var planComp275 = project.items.addComp(
    "SQ15_UNDLM_00275",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp275.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer275 = planComp275.layers.add(bgSolidComp);
bgLayer275.name = "BG_SOLID";
bgLayer275.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer275 = false;
if (gradingSources[275]) {
    var gradedLayer275 = planComp275.layers.add(gradingSources[275]);
    gradedLayer275.name = "UNDLM_00275_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer275.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer275.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer275 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer275 = false;
if (editSources[275]) {
    var editLayer275 = planComp275.layers.add(editSources[275]);
    editLayer275.name = "UNDLM_00275_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer275.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer275.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer275 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer275) {
    // EDIT toujours activé quand disponible
    editLayer275.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer275) {
        gradedLayer275.enabled = false;
    }
} else if (hasGradedLayer275) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer275.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText275 = planComp275.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText275.name = "WARNING_NO_EDIT";
    warningText275.property("Transform").property("Position").setValue([1280, 200]);
    warningText275.guideLayer = true;
    
    var warningTextDoc275 = warningText275.property("Source Text").value;
    warningTextDoc275.fontSize = 32;
    warningTextDoc275.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc275.font = "Arial-BoldMT";
    warningTextDoc275.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText275.property("Source Text").setValue(warningTextDoc275);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText275 = planComp275.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00275");
    errorText275.name = "ERROR_NO_SOURCE";
    errorText275.property("Transform").property("Position").setValue([1280, 720]);
    errorText275.guideLayer = true;
    
    var errorTextDoc275 = errorText275.property("Source Text").value;
    errorTextDoc275.fontSize = 48;
    errorTextDoc275.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc275.font = "Arial-BoldMT";
    errorTextDoc275.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText275.property("Source Text").setValue(errorTextDoc275);
}

planCompositions[275] = planComp275;


// Composition pour plan 00276
var planComp276 = project.items.addComp(
    "SQ15_UNDLM_00276",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp276.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer276 = planComp276.layers.add(bgSolidComp);
bgLayer276.name = "BG_SOLID";
bgLayer276.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer276 = false;
if (gradingSources[276]) {
    var gradedLayer276 = planComp276.layers.add(gradingSources[276]);
    gradedLayer276.name = "UNDLM_00276_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer276.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer276.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer276 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer276 = false;
if (editSources[276]) {
    var editLayer276 = planComp276.layers.add(editSources[276]);
    editLayer276.name = "UNDLM_00276_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer276.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer276.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer276 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer276) {
    // EDIT toujours activé quand disponible
    editLayer276.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer276) {
        gradedLayer276.enabled = false;
    }
} else if (hasGradedLayer276) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer276.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText276 = planComp276.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText276.name = "WARNING_NO_EDIT";
    warningText276.property("Transform").property("Position").setValue([1280, 200]);
    warningText276.guideLayer = true;
    
    var warningTextDoc276 = warningText276.property("Source Text").value;
    warningTextDoc276.fontSize = 32;
    warningTextDoc276.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc276.font = "Arial-BoldMT";
    warningTextDoc276.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText276.property("Source Text").setValue(warningTextDoc276);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText276 = planComp276.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00276");
    errorText276.name = "ERROR_NO_SOURCE";
    errorText276.property("Transform").property("Position").setValue([1280, 720]);
    errorText276.guideLayer = true;
    
    var errorTextDoc276 = errorText276.property("Source Text").value;
    errorTextDoc276.fontSize = 48;
    errorTextDoc276.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc276.font = "Arial-BoldMT";
    errorTextDoc276.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText276.property("Source Text").setValue(errorTextDoc276);
}

planCompositions[276] = planComp276;


// Composition pour plan 00277
var planComp277 = project.items.addComp(
    "SQ15_UNDLM_00277",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp277.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer277 = planComp277.layers.add(bgSolidComp);
bgLayer277.name = "BG_SOLID";
bgLayer277.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer277 = false;
if (gradingSources[277]) {
    var gradedLayer277 = planComp277.layers.add(gradingSources[277]);
    gradedLayer277.name = "UNDLM_00277_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer277.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer277.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer277 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer277 = false;
if (editSources[277]) {
    var editLayer277 = planComp277.layers.add(editSources[277]);
    editLayer277.name = "UNDLM_00277_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer277.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer277.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer277 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer277) {
    // EDIT toujours activé quand disponible
    editLayer277.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer277) {
        gradedLayer277.enabled = false;
    }
} else if (hasGradedLayer277) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer277.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText277 = planComp277.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText277.name = "WARNING_NO_EDIT";
    warningText277.property("Transform").property("Position").setValue([1280, 200]);
    warningText277.guideLayer = true;
    
    var warningTextDoc277 = warningText277.property("Source Text").value;
    warningTextDoc277.fontSize = 32;
    warningTextDoc277.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc277.font = "Arial-BoldMT";
    warningTextDoc277.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText277.property("Source Text").setValue(warningTextDoc277);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText277 = planComp277.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00277");
    errorText277.name = "ERROR_NO_SOURCE";
    errorText277.property("Transform").property("Position").setValue([1280, 720]);
    errorText277.guideLayer = true;
    
    var errorTextDoc277 = errorText277.property("Source Text").value;
    errorTextDoc277.fontSize = 48;
    errorTextDoc277.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc277.font = "Arial-BoldMT";
    errorTextDoc277.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText277.property("Source Text").setValue(errorTextDoc277);
}

planCompositions[277] = planComp277;


// Composition pour plan 00279
var planComp279 = project.items.addComp(
    "SQ15_UNDLM_00279",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp279.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer279 = planComp279.layers.add(bgSolidComp);
bgLayer279.name = "BG_SOLID";
bgLayer279.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer279 = false;
if (gradingSources[279]) {
    var gradedLayer279 = planComp279.layers.add(gradingSources[279]);
    gradedLayer279.name = "UNDLM_00279_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer279.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer279.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer279 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer279 = false;
if (editSources[279]) {
    var editLayer279 = planComp279.layers.add(editSources[279]);
    editLayer279.name = "UNDLM_00279_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer279.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer279.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer279 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer279) {
    // EDIT toujours activé quand disponible
    editLayer279.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer279) {
        gradedLayer279.enabled = false;
    }
} else if (hasGradedLayer279) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer279.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText279 = planComp279.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText279.name = "WARNING_NO_EDIT";
    warningText279.property("Transform").property("Position").setValue([1280, 200]);
    warningText279.guideLayer = true;
    
    var warningTextDoc279 = warningText279.property("Source Text").value;
    warningTextDoc279.fontSize = 32;
    warningTextDoc279.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc279.font = "Arial-BoldMT";
    warningTextDoc279.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText279.property("Source Text").setValue(warningTextDoc279);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText279 = planComp279.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00279");
    errorText279.name = "ERROR_NO_SOURCE";
    errorText279.property("Transform").property("Position").setValue([1280, 720]);
    errorText279.guideLayer = true;
    
    var errorTextDoc279 = errorText279.property("Source Text").value;
    errorTextDoc279.fontSize = 48;
    errorTextDoc279.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc279.font = "Arial-BoldMT";
    errorTextDoc279.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText279.property("Source Text").setValue(errorTextDoc279);
}

planCompositions[279] = planComp279;


// Composition pour plan 00280
var planComp280 = project.items.addComp(
    "SQ15_UNDLM_00280",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp280.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer280 = planComp280.layers.add(bgSolidComp);
bgLayer280.name = "BG_SOLID";
bgLayer280.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer280 = false;
if (gradingSources[280]) {
    var gradedLayer280 = planComp280.layers.add(gradingSources[280]);
    gradedLayer280.name = "UNDLM_00280_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer280.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer280.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer280 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer280 = false;
if (editSources[280]) {
    var editLayer280 = planComp280.layers.add(editSources[280]);
    editLayer280.name = "UNDLM_00280_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer280.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer280.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer280 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer280) {
    // EDIT toujours activé quand disponible
    editLayer280.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer280) {
        gradedLayer280.enabled = false;
    }
} else if (hasGradedLayer280) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer280.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText280 = planComp280.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText280.name = "WARNING_NO_EDIT";
    warningText280.property("Transform").property("Position").setValue([1280, 200]);
    warningText280.guideLayer = true;
    
    var warningTextDoc280 = warningText280.property("Source Text").value;
    warningTextDoc280.fontSize = 32;
    warningTextDoc280.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc280.font = "Arial-BoldMT";
    warningTextDoc280.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText280.property("Source Text").setValue(warningTextDoc280);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText280 = planComp280.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00280");
    errorText280.name = "ERROR_NO_SOURCE";
    errorText280.property("Transform").property("Position").setValue([1280, 720]);
    errorText280.guideLayer = true;
    
    var errorTextDoc280 = errorText280.property("Source Text").value;
    errorTextDoc280.fontSize = 48;
    errorTextDoc280.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc280.font = "Arial-BoldMT";
    errorTextDoc280.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText280.property("Source Text").setValue(errorTextDoc280);
}

planCompositions[280] = planComp280;


// Composition pour plan 00282
var planComp282 = project.items.addComp(
    "SQ15_UNDLM_00282",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp282.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer282 = planComp282.layers.add(bgSolidComp);
bgLayer282.name = "BG_SOLID";
bgLayer282.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer282 = false;
if (gradingSources[282]) {
    var gradedLayer282 = planComp282.layers.add(gradingSources[282]);
    gradedLayer282.name = "UNDLM_00282_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer282.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer282.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer282 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer282 = false;
if (editSources[282]) {
    var editLayer282 = planComp282.layers.add(editSources[282]);
    editLayer282.name = "UNDLM_00282_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer282.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer282.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer282 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer282) {
    // EDIT toujours activé quand disponible
    editLayer282.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer282) {
        gradedLayer282.enabled = false;
    }
} else if (hasGradedLayer282) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer282.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText282 = planComp282.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText282.name = "WARNING_NO_EDIT";
    warningText282.property("Transform").property("Position").setValue([1280, 200]);
    warningText282.guideLayer = true;
    
    var warningTextDoc282 = warningText282.property("Source Text").value;
    warningTextDoc282.fontSize = 32;
    warningTextDoc282.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc282.font = "Arial-BoldMT";
    warningTextDoc282.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText282.property("Source Text").setValue(warningTextDoc282);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText282 = planComp282.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00282");
    errorText282.name = "ERROR_NO_SOURCE";
    errorText282.property("Transform").property("Position").setValue([1280, 720]);
    errorText282.guideLayer = true;
    
    var errorTextDoc282 = errorText282.property("Source Text").value;
    errorTextDoc282.fontSize = 48;
    errorTextDoc282.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc282.font = "Arial-BoldMT";
    errorTextDoc282.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText282.property("Source Text").setValue(errorTextDoc282);
}

planCompositions[282] = planComp282;


// Composition pour plan 00283
var planComp283 = project.items.addComp(
    "SQ15_UNDLM_00283",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp283.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer283 = planComp283.layers.add(bgSolidComp);
bgLayer283.name = "BG_SOLID";
bgLayer283.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer283 = false;
if (gradingSources[283]) {
    var gradedLayer283 = planComp283.layers.add(gradingSources[283]);
    gradedLayer283.name = "UNDLM_00283_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer283.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer283.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer283 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer283 = false;
if (editSources[283]) {
    var editLayer283 = planComp283.layers.add(editSources[283]);
    editLayer283.name = "UNDLM_00283_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer283.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer283.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer283 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer283) {
    // EDIT toujours activé quand disponible
    editLayer283.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer283) {
        gradedLayer283.enabled = false;
    }
} else if (hasGradedLayer283) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer283.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText283 = planComp283.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText283.name = "WARNING_NO_EDIT";
    warningText283.property("Transform").property("Position").setValue([1280, 200]);
    warningText283.guideLayer = true;
    
    var warningTextDoc283 = warningText283.property("Source Text").value;
    warningTextDoc283.fontSize = 32;
    warningTextDoc283.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc283.font = "Arial-BoldMT";
    warningTextDoc283.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText283.property("Source Text").setValue(warningTextDoc283);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText283 = planComp283.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00283");
    errorText283.name = "ERROR_NO_SOURCE";
    errorText283.property("Transform").property("Position").setValue([1280, 720]);
    errorText283.guideLayer = true;
    
    var errorTextDoc283 = errorText283.property("Source Text").value;
    errorTextDoc283.fontSize = 48;
    errorTextDoc283.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc283.font = "Arial-BoldMT";
    errorTextDoc283.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText283.property("Source Text").setValue(errorTextDoc283);
}

planCompositions[283] = planComp283;


// Composition pour plan 00285
var planComp285 = project.items.addComp(
    "SQ15_UNDLM_00285",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp285.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer285 = planComp285.layers.add(bgSolidComp);
bgLayer285.name = "BG_SOLID";
bgLayer285.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer285 = false;
if (gradingSources[285]) {
    var gradedLayer285 = planComp285.layers.add(gradingSources[285]);
    gradedLayer285.name = "UNDLM_00285_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer285.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer285.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer285 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer285 = false;
if (editSources[285]) {
    var editLayer285 = planComp285.layers.add(editSources[285]);
    editLayer285.name = "UNDLM_00285_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer285.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer285.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer285 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer285) {
    // EDIT toujours activé quand disponible
    editLayer285.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer285) {
        gradedLayer285.enabled = false;
    }
} else if (hasGradedLayer285) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer285.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText285 = planComp285.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText285.name = "WARNING_NO_EDIT";
    warningText285.property("Transform").property("Position").setValue([1280, 200]);
    warningText285.guideLayer = true;
    
    var warningTextDoc285 = warningText285.property("Source Text").value;
    warningTextDoc285.fontSize = 32;
    warningTextDoc285.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc285.font = "Arial-BoldMT";
    warningTextDoc285.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText285.property("Source Text").setValue(warningTextDoc285);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText285 = planComp285.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00285");
    errorText285.name = "ERROR_NO_SOURCE";
    errorText285.property("Transform").property("Position").setValue([1280, 720]);
    errorText285.guideLayer = true;
    
    var errorTextDoc285 = errorText285.property("Source Text").value;
    errorTextDoc285.fontSize = 48;
    errorTextDoc285.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc285.font = "Arial-BoldMT";
    errorTextDoc285.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText285.property("Source Text").setValue(errorTextDoc285);
}

planCompositions[285] = planComp285;


// Composition pour plan 00311
var planComp311 = project.items.addComp(
    "SQ18_UNDLM_00311",
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
    "SQ18_UNDLM_00312",
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
    "SQ18_UNDLM_00313",
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
    "SQ18_UNDLM_00314",
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
    "SQ18_UNDLM_00315",
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
    "SQ18_UNDLM_00316",
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
    "SQ18_UNDLM_00317",
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


// Composition pour plan 00327
var planComp327 = project.items.addComp(
    "SQ19_UNDLM_00327",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.72,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp327.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer327 = planComp327.layers.add(bgSolidComp);
bgLayer327.name = "BG_SOLID";
bgLayer327.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer327 = false;
if (gradingSources[327]) {
    var gradedLayer327 = planComp327.layers.add(gradingSources[327]);
    gradedLayer327.name = "UNDLM_00327_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer327.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer327.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer327 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer327 = false;
if (editSources[327]) {
    var editLayer327 = planComp327.layers.add(editSources[327]);
    editLayer327.name = "UNDLM_00327_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer327.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer327.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer327 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer327) {
    // EDIT toujours activé quand disponible
    editLayer327.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer327) {
        gradedLayer327.enabled = false;
    }
} else if (hasGradedLayer327) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer327.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText327 = planComp327.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText327.name = "WARNING_NO_EDIT";
    warningText327.property("Transform").property("Position").setValue([1280, 200]);
    warningText327.guideLayer = true;
    
    var warningTextDoc327 = warningText327.property("Source Text").value;
    warningTextDoc327.fontSize = 32;
    warningTextDoc327.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc327.font = "Arial-BoldMT";
    warningTextDoc327.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText327.property("Source Text").setValue(warningTextDoc327);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText327 = planComp327.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00327");
    errorText327.name = "ERROR_NO_SOURCE";
    errorText327.property("Transform").property("Position").setValue([1280, 720]);
    errorText327.guideLayer = true;
    
    var errorTextDoc327 = errorText327.property("Source Text").value;
    errorTextDoc327.fontSize = 48;
    errorTextDoc327.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc327.font = "Arial-BoldMT";
    errorTextDoc327.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText327.property("Source Text").setValue(errorTextDoc327);
}

planCompositions[327] = planComp327;


// Composition pour plan 00328
var planComp328 = project.items.addComp(
    "SQ19_UNDLM_00328",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp328.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer328 = planComp328.layers.add(bgSolidComp);
bgLayer328.name = "BG_SOLID";
bgLayer328.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer328 = false;
if (gradingSources[328]) {
    var gradedLayer328 = planComp328.layers.add(gradingSources[328]);
    gradedLayer328.name = "UNDLM_00328_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer328.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer328.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer328 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer328 = false;
if (editSources[328]) {
    var editLayer328 = planComp328.layers.add(editSources[328]);
    editLayer328.name = "UNDLM_00328_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer328.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer328.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer328 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer328) {
    // EDIT toujours activé quand disponible
    editLayer328.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer328) {
        gradedLayer328.enabled = false;
    }
} else if (hasGradedLayer328) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer328.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText328 = planComp328.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText328.name = "WARNING_NO_EDIT";
    warningText328.property("Transform").property("Position").setValue([1280, 200]);
    warningText328.guideLayer = true;
    
    var warningTextDoc328 = warningText328.property("Source Text").value;
    warningTextDoc328.fontSize = 32;
    warningTextDoc328.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc328.font = "Arial-BoldMT";
    warningTextDoc328.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText328.property("Source Text").setValue(warningTextDoc328);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText328 = planComp328.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00328");
    errorText328.name = "ERROR_NO_SOURCE";
    errorText328.property("Transform").property("Position").setValue([1280, 720]);
    errorText328.guideLayer = true;
    
    var errorTextDoc328 = errorText328.property("Source Text").value;
    errorTextDoc328.fontSize = 48;
    errorTextDoc328.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc328.font = "Arial-BoldMT";
    errorTextDoc328.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText328.property("Source Text").setValue(errorTextDoc328);
}

planCompositions[328] = planComp328;


// Composition pour plan 00329
var planComp329 = project.items.addComp(
    "SQ19_UNDLM_00329",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp329.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer329 = planComp329.layers.add(bgSolidComp);
bgLayer329.name = "BG_SOLID";
bgLayer329.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer329 = false;
if (gradingSources[329]) {
    var gradedLayer329 = planComp329.layers.add(gradingSources[329]);
    gradedLayer329.name = "UNDLM_00329_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer329.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer329.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer329 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer329 = false;
if (editSources[329]) {
    var editLayer329 = planComp329.layers.add(editSources[329]);
    editLayer329.name = "UNDLM_00329_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer329.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer329.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer329 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer329) {
    // EDIT toujours activé quand disponible
    editLayer329.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer329) {
        gradedLayer329.enabled = false;
    }
} else if (hasGradedLayer329) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer329.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText329 = planComp329.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText329.name = "WARNING_NO_EDIT";
    warningText329.property("Transform").property("Position").setValue([1280, 200]);
    warningText329.guideLayer = true;
    
    var warningTextDoc329 = warningText329.property("Source Text").value;
    warningTextDoc329.fontSize = 32;
    warningTextDoc329.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc329.font = "Arial-BoldMT";
    warningTextDoc329.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText329.property("Source Text").setValue(warningTextDoc329);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText329 = planComp329.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00329");
    errorText329.name = "ERROR_NO_SOURCE";
    errorText329.property("Transform").property("Position").setValue([1280, 720]);
    errorText329.guideLayer = true;
    
    var errorTextDoc329 = errorText329.property("Source Text").value;
    errorTextDoc329.fontSize = 48;
    errorTextDoc329.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc329.font = "Arial-BoldMT";
    errorTextDoc329.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText329.property("Source Text").setValue(errorTextDoc329);
}

planCompositions[329] = planComp329;


// Composition pour plan 00330
var planComp330 = project.items.addComp(
    "SQ19_UNDLM_00330",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    17.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp330.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer330 = planComp330.layers.add(bgSolidComp);
bgLayer330.name = "BG_SOLID";
bgLayer330.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer330 = false;
if (gradingSources[330]) {
    var gradedLayer330 = planComp330.layers.add(gradingSources[330]);
    gradedLayer330.name = "UNDLM_00330_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer330.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer330.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer330 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer330 = false;
if (editSources[330]) {
    var editLayer330 = planComp330.layers.add(editSources[330]);
    editLayer330.name = "UNDLM_00330_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer330.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer330.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer330 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer330) {
    // EDIT toujours activé quand disponible
    editLayer330.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer330) {
        gradedLayer330.enabled = false;
    }
} else if (hasGradedLayer330) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer330.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText330 = planComp330.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText330.name = "WARNING_NO_EDIT";
    warningText330.property("Transform").property("Position").setValue([1280, 200]);
    warningText330.guideLayer = true;
    
    var warningTextDoc330 = warningText330.property("Source Text").value;
    warningTextDoc330.fontSize = 32;
    warningTextDoc330.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc330.font = "Arial-BoldMT";
    warningTextDoc330.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText330.property("Source Text").setValue(warningTextDoc330);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText330 = planComp330.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00330");
    errorText330.name = "ERROR_NO_SOURCE";
    errorText330.property("Transform").property("Position").setValue([1280, 720]);
    errorText330.guideLayer = true;
    
    var errorTextDoc330 = errorText330.property("Source Text").value;
    errorTextDoc330.fontSize = 48;
    errorTextDoc330.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc330.font = "Arial-BoldMT";
    errorTextDoc330.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText330.property("Source Text").setValue(errorTextDoc330);
}

planCompositions[330] = planComp330;


// Composition pour plan 00331
var planComp331 = project.items.addComp(
    "SQ19_UNDLM_00331",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    26.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp331.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer331 = planComp331.layers.add(bgSolidComp);
bgLayer331.name = "BG_SOLID";
bgLayer331.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer331 = false;
if (gradingSources[331]) {
    var gradedLayer331 = planComp331.layers.add(gradingSources[331]);
    gradedLayer331.name = "UNDLM_00331_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer331.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer331.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer331 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer331 = false;
if (editSources[331]) {
    var editLayer331 = planComp331.layers.add(editSources[331]);
    editLayer331.name = "UNDLM_00331_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer331.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer331.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer331 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer331) {
    // EDIT toujours activé quand disponible
    editLayer331.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer331) {
        gradedLayer331.enabled = false;
    }
} else if (hasGradedLayer331) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer331.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText331 = planComp331.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText331.name = "WARNING_NO_EDIT";
    warningText331.property("Transform").property("Position").setValue([1280, 200]);
    warningText331.guideLayer = true;
    
    var warningTextDoc331 = warningText331.property("Source Text").value;
    warningTextDoc331.fontSize = 32;
    warningTextDoc331.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc331.font = "Arial-BoldMT";
    warningTextDoc331.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText331.property("Source Text").setValue(warningTextDoc331);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText331 = planComp331.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00331");
    errorText331.name = "ERROR_NO_SOURCE";
    errorText331.property("Transform").property("Position").setValue([1280, 720]);
    errorText331.guideLayer = true;
    
    var errorTextDoc331 = errorText331.property("Source Text").value;
    errorTextDoc331.fontSize = 48;
    errorTextDoc331.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc331.font = "Arial-BoldMT";
    errorTextDoc331.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText331.property("Source Text").setValue(errorTextDoc331);
}

planCompositions[331] = planComp331;


// Composition pour plan 00384
var planComp384 = project.items.addComp(
    "SQ22_UNDLM_00384",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp384.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer384 = planComp384.layers.add(bgSolidComp);
bgLayer384.name = "BG_SOLID";
bgLayer384.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer384 = false;
if (gradingSources[384]) {
    var gradedLayer384 = planComp384.layers.add(gradingSources[384]);
    gradedLayer384.name = "UNDLM_00384_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer384.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer384.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer384 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer384 = false;
if (editSources[384]) {
    var editLayer384 = planComp384.layers.add(editSources[384]);
    editLayer384.name = "UNDLM_00384_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer384.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer384.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer384 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer384) {
    // EDIT toujours activé quand disponible
    editLayer384.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer384) {
        gradedLayer384.enabled = false;
    }
} else if (hasGradedLayer384) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer384.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText384 = planComp384.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText384.name = "WARNING_NO_EDIT";
    warningText384.property("Transform").property("Position").setValue([1280, 200]);
    warningText384.guideLayer = true;
    
    var warningTextDoc384 = warningText384.property("Source Text").value;
    warningTextDoc384.fontSize = 32;
    warningTextDoc384.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc384.font = "Arial-BoldMT";
    warningTextDoc384.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText384.property("Source Text").setValue(warningTextDoc384);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText384 = planComp384.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00384");
    errorText384.name = "ERROR_NO_SOURCE";
    errorText384.property("Transform").property("Position").setValue([1280, 720]);
    errorText384.guideLayer = true;
    
    var errorTextDoc384 = errorText384.property("Source Text").value;
    errorTextDoc384.fontSize = 48;
    errorTextDoc384.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc384.font = "Arial-BoldMT";
    errorTextDoc384.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText384.property("Source Text").setValue(errorTextDoc384);
}

planCompositions[384] = planComp384;


// Composition pour plan 00385
var planComp385 = project.items.addComp(
    "SQ22_UNDLM_00385",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    12.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp385.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer385 = planComp385.layers.add(bgSolidComp);
bgLayer385.name = "BG_SOLID";
bgLayer385.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer385 = false;
if (gradingSources[385]) {
    var gradedLayer385 = planComp385.layers.add(gradingSources[385]);
    gradedLayer385.name = "UNDLM_00385_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer385.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer385.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer385 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer385 = false;
if (editSources[385]) {
    var editLayer385 = planComp385.layers.add(editSources[385]);
    editLayer385.name = "UNDLM_00385_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer385.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer385.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer385 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer385) {
    // EDIT toujours activé quand disponible
    editLayer385.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer385) {
        gradedLayer385.enabled = false;
    }
} else if (hasGradedLayer385) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer385.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText385 = planComp385.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText385.name = "WARNING_NO_EDIT";
    warningText385.property("Transform").property("Position").setValue([1280, 200]);
    warningText385.guideLayer = true;
    
    var warningTextDoc385 = warningText385.property("Source Text").value;
    warningTextDoc385.fontSize = 32;
    warningTextDoc385.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc385.font = "Arial-BoldMT";
    warningTextDoc385.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText385.property("Source Text").setValue(warningTextDoc385);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText385 = planComp385.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00385");
    errorText385.name = "ERROR_NO_SOURCE";
    errorText385.property("Transform").property("Position").setValue([1280, 720]);
    errorText385.guideLayer = true;
    
    var errorTextDoc385 = errorText385.property("Source Text").value;
    errorTextDoc385.fontSize = 48;
    errorTextDoc385.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc385.font = "Arial-BoldMT";
    errorTextDoc385.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText385.property("Source Text").setValue(errorTextDoc385);
}

planCompositions[385] = planComp385;


// Composition pour plan 00386
var planComp386 = project.items.addComp(
    "SQ22_UNDLM_00386",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    16.56,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp386.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer386 = planComp386.layers.add(bgSolidComp);
bgLayer386.name = "BG_SOLID";
bgLayer386.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer386 = false;
if (gradingSources[386]) {
    var gradedLayer386 = planComp386.layers.add(gradingSources[386]);
    gradedLayer386.name = "UNDLM_00386_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer386.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer386.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer386 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer386 = false;
if (editSources[386]) {
    var editLayer386 = planComp386.layers.add(editSources[386]);
    editLayer386.name = "UNDLM_00386_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer386.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer386.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer386 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer386) {
    // EDIT toujours activé quand disponible
    editLayer386.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer386) {
        gradedLayer386.enabled = false;
    }
} else if (hasGradedLayer386) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer386.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText386 = planComp386.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText386.name = "WARNING_NO_EDIT";
    warningText386.property("Transform").property("Position").setValue([1280, 200]);
    warningText386.guideLayer = true;
    
    var warningTextDoc386 = warningText386.property("Source Text").value;
    warningTextDoc386.fontSize = 32;
    warningTextDoc386.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc386.font = "Arial-BoldMT";
    warningTextDoc386.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText386.property("Source Text").setValue(warningTextDoc386);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText386 = planComp386.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00386");
    errorText386.name = "ERROR_NO_SOURCE";
    errorText386.property("Transform").property("Position").setValue([1280, 720]);
    errorText386.guideLayer = true;
    
    var errorTextDoc386 = errorText386.property("Source Text").value;
    errorTextDoc386.fontSize = 48;
    errorTextDoc386.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc386.font = "Arial-BoldMT";
    errorTextDoc386.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText386.property("Source Text").setValue(errorTextDoc386);
}

planCompositions[386] = planComp386;


// Composition pour plan 00387
var planComp387 = project.items.addComp(
    "SQ22_UNDLM_00387",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp387.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer387 = planComp387.layers.add(bgSolidComp);
bgLayer387.name = "BG_SOLID";
bgLayer387.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer387 = false;
if (gradingSources[387]) {
    var gradedLayer387 = planComp387.layers.add(gradingSources[387]);
    gradedLayer387.name = "UNDLM_00387_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer387.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer387.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer387 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer387 = false;
if (editSources[387]) {
    var editLayer387 = planComp387.layers.add(editSources[387]);
    editLayer387.name = "UNDLM_00387_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer387.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer387.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer387 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer387) {
    // EDIT toujours activé quand disponible
    editLayer387.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer387) {
        gradedLayer387.enabled = false;
    }
} else if (hasGradedLayer387) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer387.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText387 = planComp387.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText387.name = "WARNING_NO_EDIT";
    warningText387.property("Transform").property("Position").setValue([1280, 200]);
    warningText387.guideLayer = true;
    
    var warningTextDoc387 = warningText387.property("Source Text").value;
    warningTextDoc387.fontSize = 32;
    warningTextDoc387.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc387.font = "Arial-BoldMT";
    warningTextDoc387.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText387.property("Source Text").setValue(warningTextDoc387);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText387 = planComp387.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00387");
    errorText387.name = "ERROR_NO_SOURCE";
    errorText387.property("Transform").property("Position").setValue([1280, 720]);
    errorText387.guideLayer = true;
    
    var errorTextDoc387 = errorText387.property("Source Text").value;
    errorTextDoc387.fontSize = 48;
    errorTextDoc387.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc387.font = "Arial-BoldMT";
    errorTextDoc387.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText387.property("Source Text").setValue(errorTextDoc387);
}

planCompositions[387] = planComp387;


// Composition pour plan 00391
var planComp391 = project.items.addComp(
    "SQ22_UNDLM_00391",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp391.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer391 = planComp391.layers.add(bgSolidComp);
bgLayer391.name = "BG_SOLID";
bgLayer391.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer391 = false;
if (gradingSources[391]) {
    var gradedLayer391 = planComp391.layers.add(gradingSources[391]);
    gradedLayer391.name = "UNDLM_00391_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer391.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer391.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer391 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer391 = false;
if (editSources[391]) {
    var editLayer391 = planComp391.layers.add(editSources[391]);
    editLayer391.name = "UNDLM_00391_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer391.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer391.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer391 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer391) {
    // EDIT toujours activé quand disponible
    editLayer391.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer391) {
        gradedLayer391.enabled = false;
    }
} else if (hasGradedLayer391) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer391.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText391 = planComp391.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText391.name = "WARNING_NO_EDIT";
    warningText391.property("Transform").property("Position").setValue([1280, 200]);
    warningText391.guideLayer = true;
    
    var warningTextDoc391 = warningText391.property("Source Text").value;
    warningTextDoc391.fontSize = 32;
    warningTextDoc391.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc391.font = "Arial-BoldMT";
    warningTextDoc391.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText391.property("Source Text").setValue(warningTextDoc391);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText391 = planComp391.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00391");
    errorText391.name = "ERROR_NO_SOURCE";
    errorText391.property("Transform").property("Position").setValue([1280, 720]);
    errorText391.guideLayer = true;
    
    var errorTextDoc391 = errorText391.property("Source Text").value;
    errorTextDoc391.fontSize = 48;
    errorTextDoc391.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc391.font = "Arial-BoldMT";
    errorTextDoc391.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText391.property("Source Text").setValue(errorTextDoc391);
}

planCompositions[391] = planComp391;


// Composition pour plan 00393
var planComp393 = project.items.addComp(
    "SQ22_UNDLM_00393",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp393.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer393 = planComp393.layers.add(bgSolidComp);
bgLayer393.name = "BG_SOLID";
bgLayer393.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer393 = false;
if (gradingSources[393]) {
    var gradedLayer393 = planComp393.layers.add(gradingSources[393]);
    gradedLayer393.name = "UNDLM_00393_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer393.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer393.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer393 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer393 = false;
if (editSources[393]) {
    var editLayer393 = planComp393.layers.add(editSources[393]);
    editLayer393.name = "UNDLM_00393_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer393.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer393.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer393 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer393) {
    // EDIT toujours activé quand disponible
    editLayer393.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer393) {
        gradedLayer393.enabled = false;
    }
} else if (hasGradedLayer393) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer393.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText393 = planComp393.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText393.name = "WARNING_NO_EDIT";
    warningText393.property("Transform").property("Position").setValue([1280, 200]);
    warningText393.guideLayer = true;
    
    var warningTextDoc393 = warningText393.property("Source Text").value;
    warningTextDoc393.fontSize = 32;
    warningTextDoc393.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc393.font = "Arial-BoldMT";
    warningTextDoc393.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText393.property("Source Text").setValue(warningTextDoc393);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText393 = planComp393.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00393");
    errorText393.name = "ERROR_NO_SOURCE";
    errorText393.property("Transform").property("Position").setValue([1280, 720]);
    errorText393.guideLayer = true;
    
    var errorTextDoc393 = errorText393.property("Source Text").value;
    errorTextDoc393.fontSize = 48;
    errorTextDoc393.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc393.font = "Arial-BoldMT";
    errorTextDoc393.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText393.property("Source Text").setValue(errorTextDoc393);
}

planCompositions[393] = planComp393;


// Composition pour plan 00394
var planComp394 = project.items.addComp(
    "SQ22_UNDLM_00394",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp394.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer394 = planComp394.layers.add(bgSolidComp);
bgLayer394.name = "BG_SOLID";
bgLayer394.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer394 = false;
if (gradingSources[394]) {
    var gradedLayer394 = planComp394.layers.add(gradingSources[394]);
    gradedLayer394.name = "UNDLM_00394_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer394.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer394.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer394 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer394 = false;
if (editSources[394]) {
    var editLayer394 = planComp394.layers.add(editSources[394]);
    editLayer394.name = "UNDLM_00394_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer394.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer394.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer394 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer394) {
    // EDIT toujours activé quand disponible
    editLayer394.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer394) {
        gradedLayer394.enabled = false;
    }
} else if (hasGradedLayer394) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer394.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText394 = planComp394.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText394.name = "WARNING_NO_EDIT";
    warningText394.property("Transform").property("Position").setValue([1280, 200]);
    warningText394.guideLayer = true;
    
    var warningTextDoc394 = warningText394.property("Source Text").value;
    warningTextDoc394.fontSize = 32;
    warningTextDoc394.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc394.font = "Arial-BoldMT";
    warningTextDoc394.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText394.property("Source Text").setValue(warningTextDoc394);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText394 = planComp394.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00394");
    errorText394.name = "ERROR_NO_SOURCE";
    errorText394.property("Transform").property("Position").setValue([1280, 720]);
    errorText394.guideLayer = true;
    
    var errorTextDoc394 = errorText394.property("Source Text").value;
    errorTextDoc394.fontSize = 48;
    errorTextDoc394.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc394.font = "Arial-BoldMT";
    errorTextDoc394.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText394.property("Source Text").setValue(errorTextDoc394);
}

planCompositions[394] = planComp394;


// Composition pour plan 00395
var planComp395 = project.items.addComp(
    "SQ22_UNDLM_00395",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp395.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer395 = planComp395.layers.add(bgSolidComp);
bgLayer395.name = "BG_SOLID";
bgLayer395.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer395 = false;
if (gradingSources[395]) {
    var gradedLayer395 = planComp395.layers.add(gradingSources[395]);
    gradedLayer395.name = "UNDLM_00395_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer395.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer395.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer395 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer395 = false;
if (editSources[395]) {
    var editLayer395 = planComp395.layers.add(editSources[395]);
    editLayer395.name = "UNDLM_00395_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer395.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer395.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer395 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer395) {
    // EDIT toujours activé quand disponible
    editLayer395.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer395) {
        gradedLayer395.enabled = false;
    }
} else if (hasGradedLayer395) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer395.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText395 = planComp395.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText395.name = "WARNING_NO_EDIT";
    warningText395.property("Transform").property("Position").setValue([1280, 200]);
    warningText395.guideLayer = true;
    
    var warningTextDoc395 = warningText395.property("Source Text").value;
    warningTextDoc395.fontSize = 32;
    warningTextDoc395.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc395.font = "Arial-BoldMT";
    warningTextDoc395.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText395.property("Source Text").setValue(warningTextDoc395);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText395 = planComp395.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00395");
    errorText395.name = "ERROR_NO_SOURCE";
    errorText395.property("Transform").property("Position").setValue([1280, 720]);
    errorText395.guideLayer = true;
    
    var errorTextDoc395 = errorText395.property("Source Text").value;
    errorTextDoc395.fontSize = 48;
    errorTextDoc395.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc395.font = "Arial-BoldMT";
    errorTextDoc395.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText395.property("Source Text").setValue(errorTextDoc395);
}

planCompositions[395] = planComp395;


// Composition pour plan 00396
var planComp396 = project.items.addComp(
    "SQ22_UNDLM_00396",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp396.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer396 = planComp396.layers.add(bgSolidComp);
bgLayer396.name = "BG_SOLID";
bgLayer396.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer396 = false;
if (gradingSources[396]) {
    var gradedLayer396 = planComp396.layers.add(gradingSources[396]);
    gradedLayer396.name = "UNDLM_00396_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer396.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer396.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer396 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer396 = false;
if (editSources[396]) {
    var editLayer396 = planComp396.layers.add(editSources[396]);
    editLayer396.name = "UNDLM_00396_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer396.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer396.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer396 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer396) {
    // EDIT toujours activé quand disponible
    editLayer396.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer396) {
        gradedLayer396.enabled = false;
    }
} else if (hasGradedLayer396) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer396.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText396 = planComp396.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText396.name = "WARNING_NO_EDIT";
    warningText396.property("Transform").property("Position").setValue([1280, 200]);
    warningText396.guideLayer = true;
    
    var warningTextDoc396 = warningText396.property("Source Text").value;
    warningTextDoc396.fontSize = 32;
    warningTextDoc396.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc396.font = "Arial-BoldMT";
    warningTextDoc396.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText396.property("Source Text").setValue(warningTextDoc396);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText396 = planComp396.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00396");
    errorText396.name = "ERROR_NO_SOURCE";
    errorText396.property("Transform").property("Position").setValue([1280, 720]);
    errorText396.guideLayer = true;
    
    var errorTextDoc396 = errorText396.property("Source Text").value;
    errorTextDoc396.fontSize = 48;
    errorTextDoc396.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc396.font = "Arial-BoldMT";
    errorTextDoc396.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText396.property("Source Text").setValue(errorTextDoc396);
}

planCompositions[396] = planComp396;


// Composition pour plan 00397
var planComp397 = project.items.addComp(
    "SQ22_UNDLM_00397",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.52,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp397.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer397 = planComp397.layers.add(bgSolidComp);
bgLayer397.name = "BG_SOLID";
bgLayer397.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer397 = false;
if (gradingSources[397]) {
    var gradedLayer397 = planComp397.layers.add(gradingSources[397]);
    gradedLayer397.name = "UNDLM_00397_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer397.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer397.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer397 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer397 = false;
if (editSources[397]) {
    var editLayer397 = planComp397.layers.add(editSources[397]);
    editLayer397.name = "UNDLM_00397_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer397.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer397.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer397 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer397) {
    // EDIT toujours activé quand disponible
    editLayer397.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer397) {
        gradedLayer397.enabled = false;
    }
} else if (hasGradedLayer397) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer397.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText397 = planComp397.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText397.name = "WARNING_NO_EDIT";
    warningText397.property("Transform").property("Position").setValue([1280, 200]);
    warningText397.guideLayer = true;
    
    var warningTextDoc397 = warningText397.property("Source Text").value;
    warningTextDoc397.fontSize = 32;
    warningTextDoc397.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc397.font = "Arial-BoldMT";
    warningTextDoc397.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText397.property("Source Text").setValue(warningTextDoc397);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText397 = planComp397.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00397");
    errorText397.name = "ERROR_NO_SOURCE";
    errorText397.property("Transform").property("Position").setValue([1280, 720]);
    errorText397.guideLayer = true;
    
    var errorTextDoc397 = errorText397.property("Source Text").value;
    errorTextDoc397.fontSize = 48;
    errorTextDoc397.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc397.font = "Arial-BoldMT";
    errorTextDoc397.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText397.property("Source Text").setValue(errorTextDoc397);
}

planCompositions[397] = planComp397;


// Composition pour plan 00398
var planComp398 = project.items.addComp(
    "SQ22_UNDLM_00398",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp398.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer398 = planComp398.layers.add(bgSolidComp);
bgLayer398.name = "BG_SOLID";
bgLayer398.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer398 = false;
if (gradingSources[398]) {
    var gradedLayer398 = planComp398.layers.add(gradingSources[398]);
    gradedLayer398.name = "UNDLM_00398_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer398.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer398.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer398 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer398 = false;
if (editSources[398]) {
    var editLayer398 = planComp398.layers.add(editSources[398]);
    editLayer398.name = "UNDLM_00398_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer398.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer398.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer398 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer398) {
    // EDIT toujours activé quand disponible
    editLayer398.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer398) {
        gradedLayer398.enabled = false;
    }
} else if (hasGradedLayer398) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer398.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText398 = planComp398.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText398.name = "WARNING_NO_EDIT";
    warningText398.property("Transform").property("Position").setValue([1280, 200]);
    warningText398.guideLayer = true;
    
    var warningTextDoc398 = warningText398.property("Source Text").value;
    warningTextDoc398.fontSize = 32;
    warningTextDoc398.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc398.font = "Arial-BoldMT";
    warningTextDoc398.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText398.property("Source Text").setValue(warningTextDoc398);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText398 = planComp398.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00398");
    errorText398.name = "ERROR_NO_SOURCE";
    errorText398.property("Transform").property("Position").setValue([1280, 720]);
    errorText398.guideLayer = true;
    
    var errorTextDoc398 = errorText398.property("Source Text").value;
    errorTextDoc398.fontSize = 48;
    errorTextDoc398.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc398.font = "Arial-BoldMT";
    errorTextDoc398.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText398.property("Source Text").setValue(errorTextDoc398);
}

planCompositions[398] = planComp398;


// Composition pour plan 00399
var planComp399 = project.items.addComp(
    "SQ22_UNDLM_00399",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp399.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer399 = planComp399.layers.add(bgSolidComp);
bgLayer399.name = "BG_SOLID";
bgLayer399.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer399 = false;
if (gradingSources[399]) {
    var gradedLayer399 = planComp399.layers.add(gradingSources[399]);
    gradedLayer399.name = "UNDLM_00399_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer399.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer399.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer399 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer399 = false;
if (editSources[399]) {
    var editLayer399 = planComp399.layers.add(editSources[399]);
    editLayer399.name = "UNDLM_00399_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer399.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer399.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer399 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer399) {
    // EDIT toujours activé quand disponible
    editLayer399.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer399) {
        gradedLayer399.enabled = false;
    }
} else if (hasGradedLayer399) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer399.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText399 = planComp399.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText399.name = "WARNING_NO_EDIT";
    warningText399.property("Transform").property("Position").setValue([1280, 200]);
    warningText399.guideLayer = true;
    
    var warningTextDoc399 = warningText399.property("Source Text").value;
    warningTextDoc399.fontSize = 32;
    warningTextDoc399.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc399.font = "Arial-BoldMT";
    warningTextDoc399.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText399.property("Source Text").setValue(warningTextDoc399);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText399 = planComp399.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00399");
    errorText399.name = "ERROR_NO_SOURCE";
    errorText399.property("Transform").property("Position").setValue([1280, 720]);
    errorText399.guideLayer = true;
    
    var errorTextDoc399 = errorText399.property("Source Text").value;
    errorTextDoc399.fontSize = 48;
    errorTextDoc399.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc399.font = "Arial-BoldMT";
    errorTextDoc399.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText399.property("Source Text").setValue(errorTextDoc399);
}

planCompositions[399] = planComp399;


// Composition pour plan 00400
var planComp400 = project.items.addComp(
    "SQ22_UNDLM_00400",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp400.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer400 = planComp400.layers.add(bgSolidComp);
bgLayer400.name = "BG_SOLID";
bgLayer400.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer400 = false;
if (gradingSources[400]) {
    var gradedLayer400 = planComp400.layers.add(gradingSources[400]);
    gradedLayer400.name = "UNDLM_00400_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer400.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer400.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer400 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer400 = false;
if (editSources[400]) {
    var editLayer400 = planComp400.layers.add(editSources[400]);
    editLayer400.name = "UNDLM_00400_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer400.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer400.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer400 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer400) {
    // EDIT toujours activé quand disponible
    editLayer400.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer400) {
        gradedLayer400.enabled = false;
    }
} else if (hasGradedLayer400) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer400.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText400 = planComp400.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText400.name = "WARNING_NO_EDIT";
    warningText400.property("Transform").property("Position").setValue([1280, 200]);
    warningText400.guideLayer = true;
    
    var warningTextDoc400 = warningText400.property("Source Text").value;
    warningTextDoc400.fontSize = 32;
    warningTextDoc400.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc400.font = "Arial-BoldMT";
    warningTextDoc400.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText400.property("Source Text").setValue(warningTextDoc400);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText400 = planComp400.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00400");
    errorText400.name = "ERROR_NO_SOURCE";
    errorText400.property("Transform").property("Position").setValue([1280, 720]);
    errorText400.guideLayer = true;
    
    var errorTextDoc400 = errorText400.property("Source Text").value;
    errorTextDoc400.fontSize = 48;
    errorTextDoc400.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc400.font = "Arial-BoldMT";
    errorTextDoc400.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText400.property("Source Text").setValue(errorTextDoc400);
}

planCompositions[400] = planComp400;


// Composition pour plan 00464
var planComp464 = project.items.addComp(
    "SQ26_UNDLM_00464",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp464.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer464 = planComp464.layers.add(bgSolidComp);
bgLayer464.name = "BG_SOLID";
bgLayer464.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer464 = false;
if (gradingSources[464]) {
    var gradedLayer464 = planComp464.layers.add(gradingSources[464]);
    gradedLayer464.name = "UNDLM_00464_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer464.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer464.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer464 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer464 = false;
if (editSources[464]) {
    var editLayer464 = planComp464.layers.add(editSources[464]);
    editLayer464.name = "UNDLM_00464_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer464.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer464.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer464 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer464) {
    // EDIT toujours activé quand disponible
    editLayer464.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer464) {
        gradedLayer464.enabled = false;
    }
} else if (hasGradedLayer464) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer464.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText464 = planComp464.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText464.name = "WARNING_NO_EDIT";
    warningText464.property("Transform").property("Position").setValue([1280, 200]);
    warningText464.guideLayer = true;
    
    var warningTextDoc464 = warningText464.property("Source Text").value;
    warningTextDoc464.fontSize = 32;
    warningTextDoc464.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc464.font = "Arial-BoldMT";
    warningTextDoc464.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText464.property("Source Text").setValue(warningTextDoc464);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText464 = planComp464.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00464");
    errorText464.name = "ERROR_NO_SOURCE";
    errorText464.property("Transform").property("Position").setValue([1280, 720]);
    errorText464.guideLayer = true;
    
    var errorTextDoc464 = errorText464.property("Source Text").value;
    errorTextDoc464.fontSize = 48;
    errorTextDoc464.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc464.font = "Arial-BoldMT";
    errorTextDoc464.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText464.property("Source Text").setValue(errorTextDoc464);
}

planCompositions[464] = planComp464;


// Composition pour plan 00465
var planComp465 = project.items.addComp(
    "SQ26_UNDLM_00465",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp465.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer465 = planComp465.layers.add(bgSolidComp);
bgLayer465.name = "BG_SOLID";
bgLayer465.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer465 = false;
if (gradingSources[465]) {
    var gradedLayer465 = planComp465.layers.add(gradingSources[465]);
    gradedLayer465.name = "UNDLM_00465_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer465.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer465.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer465 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer465 = false;
if (editSources[465]) {
    var editLayer465 = planComp465.layers.add(editSources[465]);
    editLayer465.name = "UNDLM_00465_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer465.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer465.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer465 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer465) {
    // EDIT toujours activé quand disponible
    editLayer465.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer465) {
        gradedLayer465.enabled = false;
    }
} else if (hasGradedLayer465) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer465.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText465 = planComp465.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText465.name = "WARNING_NO_EDIT";
    warningText465.property("Transform").property("Position").setValue([1280, 200]);
    warningText465.guideLayer = true;
    
    var warningTextDoc465 = warningText465.property("Source Text").value;
    warningTextDoc465.fontSize = 32;
    warningTextDoc465.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc465.font = "Arial-BoldMT";
    warningTextDoc465.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText465.property("Source Text").setValue(warningTextDoc465);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText465 = planComp465.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00465");
    errorText465.name = "ERROR_NO_SOURCE";
    errorText465.property("Transform").property("Position").setValue([1280, 720]);
    errorText465.guideLayer = true;
    
    var errorTextDoc465 = errorText465.property("Source Text").value;
    errorTextDoc465.fontSize = 48;
    errorTextDoc465.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc465.font = "Arial-BoldMT";
    errorTextDoc465.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText465.property("Source Text").setValue(errorTextDoc465);
}

planCompositions[465] = planComp465;


// Composition pour plan 00466
var planComp466 = project.items.addComp(
    "SQ26_UNDLM_00466",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    37.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp466.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer466 = planComp466.layers.add(bgSolidComp);
bgLayer466.name = "BG_SOLID";
bgLayer466.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer466 = false;
if (gradingSources[466]) {
    var gradedLayer466 = planComp466.layers.add(gradingSources[466]);
    gradedLayer466.name = "UNDLM_00466_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer466.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer466.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer466 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer466 = false;
if (editSources[466]) {
    var editLayer466 = planComp466.layers.add(editSources[466]);
    editLayer466.name = "UNDLM_00466_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer466.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer466.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer466 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer466) {
    // EDIT toujours activé quand disponible
    editLayer466.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer466) {
        gradedLayer466.enabled = false;
    }
} else if (hasGradedLayer466) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer466.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText466 = planComp466.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText466.name = "WARNING_NO_EDIT";
    warningText466.property("Transform").property("Position").setValue([1280, 200]);
    warningText466.guideLayer = true;
    
    var warningTextDoc466 = warningText466.property("Source Text").value;
    warningTextDoc466.fontSize = 32;
    warningTextDoc466.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc466.font = "Arial-BoldMT";
    warningTextDoc466.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText466.property("Source Text").setValue(warningTextDoc466);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText466 = planComp466.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00466");
    errorText466.name = "ERROR_NO_SOURCE";
    errorText466.property("Transform").property("Position").setValue([1280, 720]);
    errorText466.guideLayer = true;
    
    var errorTextDoc466 = errorText466.property("Source Text").value;
    errorTextDoc466.fontSize = 48;
    errorTextDoc466.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc466.font = "Arial-BoldMT";
    errorTextDoc466.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText466.property("Source Text").setValue(errorTextDoc466);
}

planCompositions[466] = planComp466;


// Composition pour plan 00467
var planComp467 = project.items.addComp(
    "SQ26_UNDLM_00467",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.32,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp467.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer467 = planComp467.layers.add(bgSolidComp);
bgLayer467.name = "BG_SOLID";
bgLayer467.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer467 = false;
if (gradingSources[467]) {
    var gradedLayer467 = planComp467.layers.add(gradingSources[467]);
    gradedLayer467.name = "UNDLM_00467_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer467.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer467.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer467 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer467 = false;
if (editSources[467]) {
    var editLayer467 = planComp467.layers.add(editSources[467]);
    editLayer467.name = "UNDLM_00467_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer467.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer467.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer467 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer467) {
    // EDIT toujours activé quand disponible
    editLayer467.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer467) {
        gradedLayer467.enabled = false;
    }
} else if (hasGradedLayer467) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer467.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText467 = planComp467.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText467.name = "WARNING_NO_EDIT";
    warningText467.property("Transform").property("Position").setValue([1280, 200]);
    warningText467.guideLayer = true;
    
    var warningTextDoc467 = warningText467.property("Source Text").value;
    warningTextDoc467.fontSize = 32;
    warningTextDoc467.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc467.font = "Arial-BoldMT";
    warningTextDoc467.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText467.property("Source Text").setValue(warningTextDoc467);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText467 = planComp467.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00467");
    errorText467.name = "ERROR_NO_SOURCE";
    errorText467.property("Transform").property("Position").setValue([1280, 720]);
    errorText467.guideLayer = true;
    
    var errorTextDoc467 = errorText467.property("Source Text").value;
    errorTextDoc467.fontSize = 48;
    errorTextDoc467.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc467.font = "Arial-BoldMT";
    errorTextDoc467.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText467.property("Source Text").setValue(errorTextDoc467);
}

planCompositions[467] = planComp467;


// Composition pour plan 00468
var planComp468 = project.items.addComp(
    "SQ26_UNDLM_00468",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp468.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer468 = planComp468.layers.add(bgSolidComp);
bgLayer468.name = "BG_SOLID";
bgLayer468.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer468 = false;
if (gradingSources[468]) {
    var gradedLayer468 = planComp468.layers.add(gradingSources[468]);
    gradedLayer468.name = "UNDLM_00468_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer468.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer468.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer468 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer468 = false;
if (editSources[468]) {
    var editLayer468 = planComp468.layers.add(editSources[468]);
    editLayer468.name = "UNDLM_00468_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer468.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer468.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer468 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer468) {
    // EDIT toujours activé quand disponible
    editLayer468.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer468) {
        gradedLayer468.enabled = false;
    }
} else if (hasGradedLayer468) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer468.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText468 = planComp468.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText468.name = "WARNING_NO_EDIT";
    warningText468.property("Transform").property("Position").setValue([1280, 200]);
    warningText468.guideLayer = true;
    
    var warningTextDoc468 = warningText468.property("Source Text").value;
    warningTextDoc468.fontSize = 32;
    warningTextDoc468.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc468.font = "Arial-BoldMT";
    warningTextDoc468.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText468.property("Source Text").setValue(warningTextDoc468);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText468 = planComp468.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00468");
    errorText468.name = "ERROR_NO_SOURCE";
    errorText468.property("Transform").property("Position").setValue([1280, 720]);
    errorText468.guideLayer = true;
    
    var errorTextDoc468 = errorText468.property("Source Text").value;
    errorTextDoc468.fontSize = 48;
    errorTextDoc468.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc468.font = "Arial-BoldMT";
    errorTextDoc468.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText468.property("Source Text").setValue(errorTextDoc468);
}

planCompositions[468] = planComp468;


// Composition pour plan 00469
var planComp469 = project.items.addComp(
    "SQ26_UNDLM_00469",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp469.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer469 = planComp469.layers.add(bgSolidComp);
bgLayer469.name = "BG_SOLID";
bgLayer469.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer469 = false;
if (gradingSources[469]) {
    var gradedLayer469 = planComp469.layers.add(gradingSources[469]);
    gradedLayer469.name = "UNDLM_00469_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer469.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer469.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer469 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer469 = false;
if (editSources[469]) {
    var editLayer469 = planComp469.layers.add(editSources[469]);
    editLayer469.name = "UNDLM_00469_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer469.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer469.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer469 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer469) {
    // EDIT toujours activé quand disponible
    editLayer469.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer469) {
        gradedLayer469.enabled = false;
    }
} else if (hasGradedLayer469) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer469.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText469 = planComp469.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText469.name = "WARNING_NO_EDIT";
    warningText469.property("Transform").property("Position").setValue([1280, 200]);
    warningText469.guideLayer = true;
    
    var warningTextDoc469 = warningText469.property("Source Text").value;
    warningTextDoc469.fontSize = 32;
    warningTextDoc469.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc469.font = "Arial-BoldMT";
    warningTextDoc469.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText469.property("Source Text").setValue(warningTextDoc469);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText469 = planComp469.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00469");
    errorText469.name = "ERROR_NO_SOURCE";
    errorText469.property("Transform").property("Position").setValue([1280, 720]);
    errorText469.guideLayer = true;
    
    var errorTextDoc469 = errorText469.property("Source Text").value;
    errorTextDoc469.fontSize = 48;
    errorTextDoc469.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc469.font = "Arial-BoldMT";
    errorTextDoc469.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText469.property("Source Text").setValue(errorTextDoc469);
}

planCompositions[469] = planComp469;


// Composition pour plan 00470
var planComp470 = project.items.addComp(
    "SQ26_UNDLM_00470",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp470.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer470 = planComp470.layers.add(bgSolidComp);
bgLayer470.name = "BG_SOLID";
bgLayer470.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer470 = false;
if (gradingSources[470]) {
    var gradedLayer470 = planComp470.layers.add(gradingSources[470]);
    gradedLayer470.name = "UNDLM_00470_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer470.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer470.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer470 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer470 = false;
if (editSources[470]) {
    var editLayer470 = planComp470.layers.add(editSources[470]);
    editLayer470.name = "UNDLM_00470_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer470.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer470.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer470 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer470) {
    // EDIT toujours activé quand disponible
    editLayer470.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer470) {
        gradedLayer470.enabled = false;
    }
} else if (hasGradedLayer470) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer470.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText470 = planComp470.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText470.name = "WARNING_NO_EDIT";
    warningText470.property("Transform").property("Position").setValue([1280, 200]);
    warningText470.guideLayer = true;
    
    var warningTextDoc470 = warningText470.property("Source Text").value;
    warningTextDoc470.fontSize = 32;
    warningTextDoc470.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc470.font = "Arial-BoldMT";
    warningTextDoc470.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText470.property("Source Text").setValue(warningTextDoc470);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText470 = planComp470.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00470");
    errorText470.name = "ERROR_NO_SOURCE";
    errorText470.property("Transform").property("Position").setValue([1280, 720]);
    errorText470.guideLayer = true;
    
    var errorTextDoc470 = errorText470.property("Source Text").value;
    errorTextDoc470.fontSize = 48;
    errorTextDoc470.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc470.font = "Arial-BoldMT";
    errorTextDoc470.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText470.property("Source Text").setValue(errorTextDoc470);
}

planCompositions[470] = planComp470;


// Composition pour plan 00471
var planComp471 = project.items.addComp(
    "SQ26_UNDLM_00471",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp471.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer471 = planComp471.layers.add(bgSolidComp);
bgLayer471.name = "BG_SOLID";
bgLayer471.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer471 = false;
if (gradingSources[471]) {
    var gradedLayer471 = planComp471.layers.add(gradingSources[471]);
    gradedLayer471.name = "UNDLM_00471_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer471.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer471.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer471 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer471 = false;
if (editSources[471]) {
    var editLayer471 = planComp471.layers.add(editSources[471]);
    editLayer471.name = "UNDLM_00471_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer471.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer471.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer471 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer471) {
    // EDIT toujours activé quand disponible
    editLayer471.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer471) {
        gradedLayer471.enabled = false;
    }
} else if (hasGradedLayer471) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer471.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText471 = planComp471.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText471.name = "WARNING_NO_EDIT";
    warningText471.property("Transform").property("Position").setValue([1280, 200]);
    warningText471.guideLayer = true;
    
    var warningTextDoc471 = warningText471.property("Source Text").value;
    warningTextDoc471.fontSize = 32;
    warningTextDoc471.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc471.font = "Arial-BoldMT";
    warningTextDoc471.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText471.property("Source Text").setValue(warningTextDoc471);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText471 = planComp471.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00471");
    errorText471.name = "ERROR_NO_SOURCE";
    errorText471.property("Transform").property("Position").setValue([1280, 720]);
    errorText471.guideLayer = true;
    
    var errorTextDoc471 = errorText471.property("Source Text").value;
    errorTextDoc471.fontSize = 48;
    errorTextDoc471.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc471.font = "Arial-BoldMT";
    errorTextDoc471.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText471.property("Source Text").setValue(errorTextDoc471);
}

planCompositions[471] = planComp471;


// Composition pour plan 00472
var planComp472 = project.items.addComp(
    "SQ26_UNDLM_00472",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp472.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer472 = planComp472.layers.add(bgSolidComp);
bgLayer472.name = "BG_SOLID";
bgLayer472.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer472 = false;
if (gradingSources[472]) {
    var gradedLayer472 = planComp472.layers.add(gradingSources[472]);
    gradedLayer472.name = "UNDLM_00472_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer472.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer472.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer472 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer472 = false;
if (editSources[472]) {
    var editLayer472 = planComp472.layers.add(editSources[472]);
    editLayer472.name = "UNDLM_00472_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer472.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer472.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer472 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer472) {
    // EDIT toujours activé quand disponible
    editLayer472.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer472) {
        gradedLayer472.enabled = false;
    }
} else if (hasGradedLayer472) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer472.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText472 = planComp472.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText472.name = "WARNING_NO_EDIT";
    warningText472.property("Transform").property("Position").setValue([1280, 200]);
    warningText472.guideLayer = true;
    
    var warningTextDoc472 = warningText472.property("Source Text").value;
    warningTextDoc472.fontSize = 32;
    warningTextDoc472.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc472.font = "Arial-BoldMT";
    warningTextDoc472.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText472.property("Source Text").setValue(warningTextDoc472);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText472 = planComp472.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00472");
    errorText472.name = "ERROR_NO_SOURCE";
    errorText472.property("Transform").property("Position").setValue([1280, 720]);
    errorText472.guideLayer = true;
    
    var errorTextDoc472 = errorText472.property("Source Text").value;
    errorTextDoc472.fontSize = 48;
    errorTextDoc472.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc472.font = "Arial-BoldMT";
    errorTextDoc472.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText472.property("Source Text").setValue(errorTextDoc472);
}

planCompositions[472] = planComp472;


// Composition pour plan 00473
var planComp473 = project.items.addComp(
    "SQ26_UNDLM_00473",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp473.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer473 = planComp473.layers.add(bgSolidComp);
bgLayer473.name = "BG_SOLID";
bgLayer473.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer473 = false;
if (gradingSources[473]) {
    var gradedLayer473 = planComp473.layers.add(gradingSources[473]);
    gradedLayer473.name = "UNDLM_00473_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer473.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer473.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer473 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer473 = false;
if (editSources[473]) {
    var editLayer473 = planComp473.layers.add(editSources[473]);
    editLayer473.name = "UNDLM_00473_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer473.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer473.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer473 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer473) {
    // EDIT toujours activé quand disponible
    editLayer473.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer473) {
        gradedLayer473.enabled = false;
    }
} else if (hasGradedLayer473) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer473.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText473 = planComp473.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText473.name = "WARNING_NO_EDIT";
    warningText473.property("Transform").property("Position").setValue([1280, 200]);
    warningText473.guideLayer = true;
    
    var warningTextDoc473 = warningText473.property("Source Text").value;
    warningTextDoc473.fontSize = 32;
    warningTextDoc473.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc473.font = "Arial-BoldMT";
    warningTextDoc473.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText473.property("Source Text").setValue(warningTextDoc473);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText473 = planComp473.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00473");
    errorText473.name = "ERROR_NO_SOURCE";
    errorText473.property("Transform").property("Position").setValue([1280, 720]);
    errorText473.guideLayer = true;
    
    var errorTextDoc473 = errorText473.property("Source Text").value;
    errorTextDoc473.fontSize = 48;
    errorTextDoc473.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc473.font = "Arial-BoldMT";
    errorTextDoc473.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText473.property("Source Text").setValue(errorTextDoc473);
}

planCompositions[473] = planComp473;


// Composition pour plan 00474
var planComp474 = project.items.addComp(
    "SQ26_UNDLM_00474",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp474.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer474 = planComp474.layers.add(bgSolidComp);
bgLayer474.name = "BG_SOLID";
bgLayer474.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer474 = false;
if (gradingSources[474]) {
    var gradedLayer474 = planComp474.layers.add(gradingSources[474]);
    gradedLayer474.name = "UNDLM_00474_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer474.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer474.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer474 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer474 = false;
if (editSources[474]) {
    var editLayer474 = planComp474.layers.add(editSources[474]);
    editLayer474.name = "UNDLM_00474_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer474.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer474.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer474 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer474) {
    // EDIT toujours activé quand disponible
    editLayer474.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer474) {
        gradedLayer474.enabled = false;
    }
} else if (hasGradedLayer474) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer474.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText474 = planComp474.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText474.name = "WARNING_NO_EDIT";
    warningText474.property("Transform").property("Position").setValue([1280, 200]);
    warningText474.guideLayer = true;
    
    var warningTextDoc474 = warningText474.property("Source Text").value;
    warningTextDoc474.fontSize = 32;
    warningTextDoc474.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc474.font = "Arial-BoldMT";
    warningTextDoc474.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText474.property("Source Text").setValue(warningTextDoc474);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText474 = planComp474.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00474");
    errorText474.name = "ERROR_NO_SOURCE";
    errorText474.property("Transform").property("Position").setValue([1280, 720]);
    errorText474.guideLayer = true;
    
    var errorTextDoc474 = errorText474.property("Source Text").value;
    errorTextDoc474.fontSize = 48;
    errorTextDoc474.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc474.font = "Arial-BoldMT";
    errorTextDoc474.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText474.property("Source Text").setValue(errorTextDoc474);
}

planCompositions[474] = planComp474;


// Composition pour plan 00475
var planComp475 = project.items.addComp(
    "SQ26_UNDLM_00475",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp475.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer475 = planComp475.layers.add(bgSolidComp);
bgLayer475.name = "BG_SOLID";
bgLayer475.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer475 = false;
if (gradingSources[475]) {
    var gradedLayer475 = planComp475.layers.add(gradingSources[475]);
    gradedLayer475.name = "UNDLM_00475_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer475.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer475.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer475 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer475 = false;
if (editSources[475]) {
    var editLayer475 = planComp475.layers.add(editSources[475]);
    editLayer475.name = "UNDLM_00475_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer475.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer475.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer475 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer475) {
    // EDIT toujours activé quand disponible
    editLayer475.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer475) {
        gradedLayer475.enabled = false;
    }
} else if (hasGradedLayer475) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer475.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText475 = planComp475.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText475.name = "WARNING_NO_EDIT";
    warningText475.property("Transform").property("Position").setValue([1280, 200]);
    warningText475.guideLayer = true;
    
    var warningTextDoc475 = warningText475.property("Source Text").value;
    warningTextDoc475.fontSize = 32;
    warningTextDoc475.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc475.font = "Arial-BoldMT";
    warningTextDoc475.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText475.property("Source Text").setValue(warningTextDoc475);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText475 = planComp475.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00475");
    errorText475.name = "ERROR_NO_SOURCE";
    errorText475.property("Transform").property("Position").setValue([1280, 720]);
    errorText475.guideLayer = true;
    
    var errorTextDoc475 = errorText475.property("Source Text").value;
    errorTextDoc475.fontSize = 48;
    errorTextDoc475.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc475.font = "Arial-BoldMT";
    errorTextDoc475.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText475.property("Source Text").setValue(errorTextDoc475);
}

planCompositions[475] = planComp475;


// Composition pour plan 00476
var planComp476 = project.items.addComp(
    "SQ26_UNDLM_00476",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp476.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer476 = planComp476.layers.add(bgSolidComp);
bgLayer476.name = "BG_SOLID";
bgLayer476.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer476 = false;
if (gradingSources[476]) {
    var gradedLayer476 = planComp476.layers.add(gradingSources[476]);
    gradedLayer476.name = "UNDLM_00476_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer476.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer476.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer476 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer476 = false;
if (editSources[476]) {
    var editLayer476 = planComp476.layers.add(editSources[476]);
    editLayer476.name = "UNDLM_00476_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer476.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer476.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer476 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer476) {
    // EDIT toujours activé quand disponible
    editLayer476.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer476) {
        gradedLayer476.enabled = false;
    }
} else if (hasGradedLayer476) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer476.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText476 = planComp476.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText476.name = "WARNING_NO_EDIT";
    warningText476.property("Transform").property("Position").setValue([1280, 200]);
    warningText476.guideLayer = true;
    
    var warningTextDoc476 = warningText476.property("Source Text").value;
    warningTextDoc476.fontSize = 32;
    warningTextDoc476.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc476.font = "Arial-BoldMT";
    warningTextDoc476.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText476.property("Source Text").setValue(warningTextDoc476);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText476 = planComp476.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00476");
    errorText476.name = "ERROR_NO_SOURCE";
    errorText476.property("Transform").property("Position").setValue([1280, 720]);
    errorText476.guideLayer = true;
    
    var errorTextDoc476 = errorText476.property("Source Text").value;
    errorTextDoc476.fontSize = 48;
    errorTextDoc476.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc476.font = "Arial-BoldMT";
    errorTextDoc476.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText476.property("Source Text").setValue(errorTextDoc476);
}

planCompositions[476] = planComp476;


// Composition pour plan 00477
var planComp477 = project.items.addComp(
    "SQ26_UNDLM_00477",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp477.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer477 = planComp477.layers.add(bgSolidComp);
bgLayer477.name = "BG_SOLID";
bgLayer477.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer477 = false;
if (gradingSources[477]) {
    var gradedLayer477 = planComp477.layers.add(gradingSources[477]);
    gradedLayer477.name = "UNDLM_00477_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer477.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer477.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer477 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer477 = false;
if (editSources[477]) {
    var editLayer477 = planComp477.layers.add(editSources[477]);
    editLayer477.name = "UNDLM_00477_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer477.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer477.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer477 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer477) {
    // EDIT toujours activé quand disponible
    editLayer477.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer477) {
        gradedLayer477.enabled = false;
    }
} else if (hasGradedLayer477) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer477.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText477 = planComp477.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText477.name = "WARNING_NO_EDIT";
    warningText477.property("Transform").property("Position").setValue([1280, 200]);
    warningText477.guideLayer = true;
    
    var warningTextDoc477 = warningText477.property("Source Text").value;
    warningTextDoc477.fontSize = 32;
    warningTextDoc477.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc477.font = "Arial-BoldMT";
    warningTextDoc477.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText477.property("Source Text").setValue(warningTextDoc477);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText477 = planComp477.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00477");
    errorText477.name = "ERROR_NO_SOURCE";
    errorText477.property("Transform").property("Position").setValue([1280, 720]);
    errorText477.guideLayer = true;
    
    var errorTextDoc477 = errorText477.property("Source Text").value;
    errorTextDoc477.fontSize = 48;
    errorTextDoc477.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc477.font = "Arial-BoldMT";
    errorTextDoc477.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText477.property("Source Text").setValue(errorTextDoc477);
}

planCompositions[477] = planComp477;


// Composition pour plan 00501
var planComp501 = project.items.addComp(
    "SQ27_UNDLM_00501",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp501.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer501 = planComp501.layers.add(bgSolidComp);
bgLayer501.name = "BG_SOLID";
bgLayer501.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer501 = false;
if (gradingSources[501]) {
    var gradedLayer501 = planComp501.layers.add(gradingSources[501]);
    gradedLayer501.name = "UNDLM_00501_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer501.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer501.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer501 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer501 = false;
if (editSources[501]) {
    var editLayer501 = planComp501.layers.add(editSources[501]);
    editLayer501.name = "UNDLM_00501_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer501.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer501.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer501 = true;
}

// 4. Gestion de l'activation des layers
if (hasEditLayer501) {
    // EDIT toujours activé quand disponible
    editLayer501.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer501) {
        gradedLayer501.enabled = false;
    }
} else if (hasGradedLayer501) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer501.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText501 = planComp501.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText501.name = "WARNING_NO_EDIT";
    warningText501.property("Transform").property("Position").setValue([1280, 200]);
    warningText501.guideLayer = true;
    
    var warningTextDoc501 = warningText501.property("Source Text").value;
    warningTextDoc501.fontSize = 32;
    warningTextDoc501.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc501.font = "Arial-BoldMT";
    warningTextDoc501.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText501.property("Source Text").setValue(warningTextDoc501);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText501 = planComp501.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00501");
    errorText501.name = "ERROR_NO_SOURCE";
    errorText501.property("Transform").property("Position").setValue([1280, 720]);
    errorText501.guideLayer = true;
    
    var errorTextDoc501 = errorText501.property("Source Text").value;
    errorTextDoc501.fontSize = 48;
    errorTextDoc501.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc501.font = "Arial-BoldMT";
    errorTextDoc501.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText501.property("Source Text").setValue(errorTextDoc501);
}

planCompositions[501] = planComp501;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "P02_ALL_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    582.0, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00175 à la timeline master
if (planCompositions[175]) {
    var masterLayer175 = masterComp.layers.add(planCompositions[175]);
    masterLayer175.startTime = 0;
    masterLayer175.name = "UNDLM_00175";
    masterLayer175.label = 1; // Couleurs alternées
}

// Ajouter plan 00176 à la timeline master
if (planCompositions[176]) {
    var masterLayer176 = masterComp.layers.add(planCompositions[176]);
    masterLayer176.startTime = 4.76;
    masterLayer176.name = "UNDLM_00176";
    masterLayer176.label = 2; // Couleurs alternées
}

// Ajouter plan 00177 à la timeline master
if (planCompositions[177]) {
    var masterLayer177 = masterComp.layers.add(planCompositions[177]);
    masterLayer177.startTime = 12.76;
    masterLayer177.name = "UNDLM_00177";
    masterLayer177.label = 3; // Couleurs alternées
}

// Ajouter plan 00193 à la timeline master
if (planCompositions[193]) {
    var masterLayer193 = masterComp.layers.add(planCompositions[193]);
    masterLayer193.startTime = 17.2;
    masterLayer193.name = "UNDLM_00193";
    masterLayer193.label = 4; // Couleurs alternées
}

// Ajouter plan 00194 à la timeline master
if (planCompositions[194]) {
    var masterLayer194 = masterComp.layers.add(planCompositions[194]);
    masterLayer194.startTime = 22.6;
    masterLayer194.name = "UNDLM_00194";
    masterLayer194.label = 5; // Couleurs alternées
}

// Ajouter plan 00195 à la timeline master
if (planCompositions[195]) {
    var masterLayer195 = masterComp.layers.add(planCompositions[195]);
    masterLayer195.startTime = 32.96;
    masterLayer195.name = "UNDLM_00195";
    masterLayer195.label = 6; // Couleurs alternées
}

// Ajouter plan 00196 à la timeline master
if (planCompositions[196]) {
    var masterLayer196 = masterComp.layers.add(planCompositions[196]);
    masterLayer196.startTime = 45.760000000000005;
    masterLayer196.name = "UNDLM_00196";
    masterLayer196.label = 7; // Couleurs alternées
}

// Ajouter plan 00197 à la timeline master
if (planCompositions[197]) {
    var masterLayer197 = masterComp.layers.add(planCompositions[197]);
    masterLayer197.startTime = 49.56;
    masterLayer197.name = "UNDLM_00197";
    masterLayer197.label = 8; // Couleurs alternées
}

// Ajouter plan 00198 à la timeline master
if (planCompositions[198]) {
    var masterLayer198 = masterComp.layers.add(planCompositions[198]);
    masterLayer198.startTime = 55.760000000000005;
    masterLayer198.name = "UNDLM_00198";
    masterLayer198.label = 9; // Couleurs alternées
}

// Ajouter plan 00199 à la timeline master
if (planCompositions[199]) {
    var masterLayer199 = masterComp.layers.add(planCompositions[199]);
    masterLayer199.startTime = 61.440000000000005;
    masterLayer199.name = "UNDLM_00199";
    masterLayer199.label = 10; // Couleurs alternées
}

// Ajouter plan 00200 à la timeline master
if (planCompositions[200]) {
    var masterLayer200 = masterComp.layers.add(planCompositions[200]);
    masterLayer200.startTime = 66.36;
    masterLayer200.name = "UNDLM_00200";
    masterLayer200.label = 11; // Couleurs alternées
}

// Ajouter plan 00201 à la timeline master
if (planCompositions[201]) {
    var masterLayer201 = masterComp.layers.add(planCompositions[201]);
    masterLayer201.startTime = 68.56;
    masterLayer201.name = "UNDLM_00201";
    masterLayer201.label = 12; // Couleurs alternées
}

// Ajouter plan 00212 à la timeline master
if (planCompositions[212]) {
    var masterLayer212 = masterComp.layers.add(planCompositions[212]);
    masterLayer212.startTime = 72.72;
    masterLayer212.name = "UNDLM_00212";
    masterLayer212.label = 13; // Couleurs alternées
}

// Ajouter plan 00213 à la timeline master
if (planCompositions[213]) {
    var masterLayer213 = masterComp.layers.add(planCompositions[213]);
    masterLayer213.startTime = 80.2;
    masterLayer213.name = "UNDLM_00213";
    masterLayer213.label = 14; // Couleurs alternées
}

// Ajouter plan 00215 à la timeline master
if (planCompositions[215]) {
    var masterLayer215 = masterComp.layers.add(planCompositions[215]);
    masterLayer215.startTime = 90.16;
    masterLayer215.name = "UNDLM_00215";
    masterLayer215.label = 15; // Couleurs alternées
}

// Ajouter plan 00216 à la timeline master
if (planCompositions[216]) {
    var masterLayer216 = masterComp.layers.add(planCompositions[216]);
    masterLayer216.startTime = 98.0;
    masterLayer216.name = "UNDLM_00216";
    masterLayer216.label = 16; // Couleurs alternées
}

// Ajouter plan 00251 à la timeline master
if (planCompositions[251]) {
    var masterLayer251 = masterComp.layers.add(planCompositions[251]);
    masterLayer251.startTime = 104.52;
    masterLayer251.name = "UNDLM_00251";
    masterLayer251.label = 1; // Couleurs alternées
}

// Ajouter plan 00252 à la timeline master
if (planCompositions[252]) {
    var masterLayer252 = masterComp.layers.add(planCompositions[252]);
    masterLayer252.startTime = 115.64;
    masterLayer252.name = "UNDLM_00252";
    masterLayer252.label = 2; // Couleurs alternées
}

// Ajouter plan 00254 à la timeline master
if (planCompositions[254]) {
    var masterLayer254 = masterComp.layers.add(planCompositions[254]);
    masterLayer254.startTime = 128.64;
    masterLayer254.name = "UNDLM_00254";
    masterLayer254.label = 3; // Couleurs alternées
}

// Ajouter plan 00255 à la timeline master
if (planCompositions[255]) {
    var masterLayer255 = masterComp.layers.add(planCompositions[255]);
    masterLayer255.startTime = 137.04;
    masterLayer255.name = "UNDLM_00255";
    masterLayer255.label = 4; // Couleurs alternées
}

// Ajouter plan 00256 à la timeline master
if (planCompositions[256]) {
    var masterLayer256 = masterComp.layers.add(planCompositions[256]);
    masterLayer256.startTime = 140.56;
    masterLayer256.name = "UNDLM_00256";
    masterLayer256.label = 5; // Couleurs alternées
}

// Ajouter plan 00262 à la timeline master
if (planCompositions[262]) {
    var masterLayer262 = masterComp.layers.add(planCompositions[262]);
    masterLayer262.startTime = 142.2;
    masterLayer262.name = "UNDLM_00262";
    masterLayer262.label = 6; // Couleurs alternées
}

// Ajouter plan 00263 à la timeline master
if (planCompositions[263]) {
    var masterLayer263 = masterComp.layers.add(planCompositions[263]);
    masterLayer263.startTime = 159.16;
    masterLayer263.name = "UNDLM_00263";
    masterLayer263.label = 7; // Couleurs alternées
}

// Ajouter plan 00275 à la timeline master
if (planCompositions[275]) {
    var masterLayer275 = masterComp.layers.add(planCompositions[275]);
    masterLayer275.startTime = 174.0;
    masterLayer275.name = "UNDLM_00275";
    masterLayer275.label = 8; // Couleurs alternées
}

// Ajouter plan 00276 à la timeline master
if (planCompositions[276]) {
    var masterLayer276 = masterComp.layers.add(planCompositions[276]);
    masterLayer276.startTime = 178.24;
    masterLayer276.name = "UNDLM_00276";
    masterLayer276.label = 9; // Couleurs alternées
}

// Ajouter plan 00277 à la timeline master
if (planCompositions[277]) {
    var masterLayer277 = masterComp.layers.add(planCompositions[277]);
    masterLayer277.startTime = 179.4;
    masterLayer277.name = "UNDLM_00277";
    masterLayer277.label = 10; // Couleurs alternées
}

// Ajouter plan 00279 à la timeline master
if (planCompositions[279]) {
    var masterLayer279 = masterComp.layers.add(planCompositions[279]);
    masterLayer279.startTime = 182.92000000000002;
    masterLayer279.name = "UNDLM_00279";
    masterLayer279.label = 11; // Couleurs alternées
}

// Ajouter plan 00280 à la timeline master
if (planCompositions[280]) {
    var masterLayer280 = masterComp.layers.add(planCompositions[280]);
    masterLayer280.startTime = 191.56;
    masterLayer280.name = "UNDLM_00280";
    masterLayer280.label = 12; // Couleurs alternées
}

// Ajouter plan 00282 à la timeline master
if (planCompositions[282]) {
    var masterLayer282 = masterComp.layers.add(planCompositions[282]);
    masterLayer282.startTime = 198.0;
    masterLayer282.name = "UNDLM_00282";
    masterLayer282.label = 13; // Couleurs alternées
}

// Ajouter plan 00283 à la timeline master
if (planCompositions[283]) {
    var masterLayer283 = masterComp.layers.add(planCompositions[283]);
    masterLayer283.startTime = 205.04;
    masterLayer283.name = "UNDLM_00283";
    masterLayer283.label = 14; // Couleurs alternées
}

// Ajouter plan 00285 à la timeline master
if (planCompositions[285]) {
    var masterLayer285 = masterComp.layers.add(planCompositions[285]);
    masterLayer285.startTime = 209.72;
    masterLayer285.name = "UNDLM_00285";
    masterLayer285.label = 15; // Couleurs alternées
}

// Ajouter plan 00311 à la timeline master
if (planCompositions[311]) {
    var masterLayer311 = masterComp.layers.add(planCompositions[311]);
    masterLayer311.startTime = 212.24;
    masterLayer311.name = "UNDLM_00311";
    masterLayer311.label = 16; // Couleurs alternées
}

// Ajouter plan 00312 à la timeline master
if (planCompositions[312]) {
    var masterLayer312 = masterComp.layers.add(planCompositions[312]);
    masterLayer312.startTime = 216.20000000000002;
    masterLayer312.name = "UNDLM_00312";
    masterLayer312.label = 1; // Couleurs alternées
}

// Ajouter plan 00313 à la timeline master
if (planCompositions[313]) {
    var masterLayer313 = masterComp.layers.add(planCompositions[313]);
    masterLayer313.startTime = 235.52;
    masterLayer313.name = "UNDLM_00313";
    masterLayer313.label = 2; // Couleurs alternées
}

// Ajouter plan 00314 à la timeline master
if (planCompositions[314]) {
    var masterLayer314 = masterComp.layers.add(planCompositions[314]);
    masterLayer314.startTime = 244.08;
    masterLayer314.name = "UNDLM_00314";
    masterLayer314.label = 3; // Couleurs alternées
}

// Ajouter plan 00315 à la timeline master
if (planCompositions[315]) {
    var masterLayer315 = masterComp.layers.add(planCompositions[315]);
    masterLayer315.startTime = 254.8;
    masterLayer315.name = "UNDLM_00315";
    masterLayer315.label = 4; // Couleurs alternées
}

// Ajouter plan 00316 à la timeline master
if (planCompositions[316]) {
    var masterLayer316 = masterComp.layers.add(planCompositions[316]);
    masterLayer316.startTime = 267.40000000000003;
    masterLayer316.name = "UNDLM_00316";
    masterLayer316.label = 5; // Couleurs alternées
}

// Ajouter plan 00317 à la timeline master
if (planCompositions[317]) {
    var masterLayer317 = masterComp.layers.add(planCompositions[317]);
    masterLayer317.startTime = 294.12;
    masterLayer317.name = "UNDLM_00317";
    masterLayer317.label = 6; // Couleurs alternées
}

// Ajouter plan 00327 à la timeline master
if (planCompositions[327]) {
    var masterLayer327 = masterComp.layers.add(planCompositions[327]);
    masterLayer327.startTime = 300.12;
    masterLayer327.name = "UNDLM_00327";
    masterLayer327.label = 7; // Couleurs alternées
}

// Ajouter plan 00328 à la timeline master
if (planCompositions[328]) {
    var masterLayer328 = masterComp.layers.add(planCompositions[328]);
    masterLayer328.startTime = 304.84000000000003;
    masterLayer328.name = "UNDLM_00328";
    masterLayer328.label = 8; // Couleurs alternées
}

// Ajouter plan 00329 à la timeline master
if (planCompositions[329]) {
    var masterLayer329 = masterComp.layers.add(planCompositions[329]);
    masterLayer329.startTime = 313.16;
    masterLayer329.name = "UNDLM_00329";
    masterLayer329.label = 9; // Couleurs alternées
}

// Ajouter plan 00330 à la timeline master
if (planCompositions[330]) {
    var masterLayer330 = masterComp.layers.add(planCompositions[330]);
    masterLayer330.startTime = 324.40000000000003;
    masterLayer330.name = "UNDLM_00330";
    masterLayer330.label = 10; // Couleurs alternées
}

// Ajouter plan 00331 à la timeline master
if (planCompositions[331]) {
    var masterLayer331 = masterComp.layers.add(planCompositions[331]);
    masterLayer331.startTime = 342.08000000000004;
    masterLayer331.name = "UNDLM_00331";
    masterLayer331.label = 11; // Couleurs alternées
}

// Ajouter plan 00384 à la timeline master
if (planCompositions[384]) {
    var masterLayer384 = masterComp.layers.add(planCompositions[384]);
    masterLayer384.startTime = 368.72;
    masterLayer384.name = "UNDLM_00384";
    masterLayer384.label = 12; // Couleurs alternées
}

// Ajouter plan 00385 à la timeline master
if (planCompositions[385]) {
    var masterLayer385 = masterComp.layers.add(planCompositions[385]);
    masterLayer385.startTime = 377.8;
    masterLayer385.name = "UNDLM_00385";
    masterLayer385.label = 13; // Couleurs alternées
}

// Ajouter plan 00386 à la timeline master
if (planCompositions[386]) {
    var masterLayer386 = masterComp.layers.add(planCompositions[386]);
    masterLayer386.startTime = 390.56;
    masterLayer386.name = "UNDLM_00386";
    masterLayer386.label = 14; // Couleurs alternées
}

// Ajouter plan 00387 à la timeline master
if (planCompositions[387]) {
    var masterLayer387 = masterComp.layers.add(planCompositions[387]);
    masterLayer387.startTime = 407.12;
    masterLayer387.name = "UNDLM_00387";
    masterLayer387.label = 15; // Couleurs alternées
}

// Ajouter plan 00391 à la timeline master
if (planCompositions[391]) {
    var masterLayer391 = masterComp.layers.add(planCompositions[391]);
    masterLayer391.startTime = 411.24;
    masterLayer391.name = "UNDLM_00391";
    masterLayer391.label = 16; // Couleurs alternées
}

// Ajouter plan 00393 à la timeline master
if (planCompositions[393]) {
    var masterLayer393 = masterComp.layers.add(planCompositions[393]);
    masterLayer393.startTime = 420.44;
    masterLayer393.name = "UNDLM_00393";
    masterLayer393.label = 1; // Couleurs alternées
}

// Ajouter plan 00394 à la timeline master
if (planCompositions[394]) {
    var masterLayer394 = masterComp.layers.add(planCompositions[394]);
    masterLayer394.startTime = 428.48;
    masterLayer394.name = "UNDLM_00394";
    masterLayer394.label = 2; // Couleurs alternées
}

// Ajouter plan 00395 à la timeline master
if (planCompositions[395]) {
    var masterLayer395 = masterComp.layers.add(planCompositions[395]);
    masterLayer395.startTime = 430.92;
    masterLayer395.name = "UNDLM_00395";
    masterLayer395.label = 3; // Couleurs alternées
}

// Ajouter plan 00396 à la timeline master
if (planCompositions[396]) {
    var masterLayer396 = masterComp.layers.add(planCompositions[396]);
    masterLayer396.startTime = 440.72;
    masterLayer396.name = "UNDLM_00396";
    masterLayer396.label = 4; // Couleurs alternées
}

// Ajouter plan 00397 à la timeline master
if (planCompositions[397]) {
    var masterLayer397 = masterComp.layers.add(planCompositions[397]);
    masterLayer397.startTime = 452.0;
    masterLayer397.name = "UNDLM_00397";
    masterLayer397.label = 5; // Couleurs alternées
}

// Ajouter plan 00398 à la timeline master
if (planCompositions[398]) {
    var masterLayer398 = masterComp.layers.add(planCompositions[398]);
    masterLayer398.startTime = 462.52;
    masterLayer398.name = "UNDLM_00398";
    masterLayer398.label = 6; // Couleurs alternées
}

// Ajouter plan 00399 à la timeline master
if (planCompositions[399]) {
    var masterLayer399 = masterComp.layers.add(planCompositions[399]);
    masterLayer399.startTime = 467.15999999999997;
    masterLayer399.name = "UNDLM_00399";
    masterLayer399.label = 7; // Couleurs alternées
}

// Ajouter plan 00400 à la timeline master
if (planCompositions[400]) {
    var masterLayer400 = masterComp.layers.add(planCompositions[400]);
    masterLayer400.startTime = 470.2;
    masterLayer400.name = "UNDLM_00400";
    masterLayer400.label = 8; // Couleurs alternées
}

// Ajouter plan 00464 à la timeline master
if (planCompositions[464]) {
    var masterLayer464 = masterComp.layers.add(planCompositions[464]);
    masterLayer464.startTime = 476.4;
    masterLayer464.name = "UNDLM_00464";
    masterLayer464.label = 9; // Couleurs alternées
}

// Ajouter plan 00465 à la timeline master
if (planCompositions[465]) {
    var masterLayer465 = masterComp.layers.add(planCompositions[465]);
    masterLayer465.startTime = 479.56;
    masterLayer465.name = "UNDLM_00465";
    masterLayer465.label = 10; // Couleurs alternées
}

// Ajouter plan 00466 à la timeline master
if (planCompositions[466]) {
    var masterLayer466 = masterComp.layers.add(planCompositions[466]);
    masterLayer466.startTime = 483.4;
    masterLayer466.name = "UNDLM_00466";
    masterLayer466.label = 11; // Couleurs alternées
}

// Ajouter plan 00467 à la timeline master
if (planCompositions[467]) {
    var masterLayer467 = masterComp.layers.add(planCompositions[467]);
    masterLayer467.startTime = 520.68;
    masterLayer467.name = "UNDLM_00467";
    masterLayer467.label = 12; // Couleurs alternées
}

// Ajouter plan 00468 à la timeline master
if (planCompositions[468]) {
    var masterLayer468 = masterComp.layers.add(planCompositions[468]);
    masterLayer468.startTime = 527.0;
    masterLayer468.name = "UNDLM_00468";
    masterLayer468.label = 13; // Couleurs alternées
}

// Ajouter plan 00469 à la timeline master
if (planCompositions[469]) {
    var masterLayer469 = masterComp.layers.add(planCompositions[469]);
    masterLayer469.startTime = 531.4;
    masterLayer469.name = "UNDLM_00469";
    masterLayer469.label = 14; // Couleurs alternées
}

// Ajouter plan 00470 à la timeline master
if (planCompositions[470]) {
    var masterLayer470 = masterComp.layers.add(planCompositions[470]);
    masterLayer470.startTime = 538.76;
    masterLayer470.name = "UNDLM_00470";
    masterLayer470.label = 15; // Couleurs alternées
}

// Ajouter plan 00471 à la timeline master
if (planCompositions[471]) {
    var masterLayer471 = masterComp.layers.add(planCompositions[471]);
    masterLayer471.startTime = 548.04;
    masterLayer471.name = "UNDLM_00471";
    masterLayer471.label = 16; // Couleurs alternées
}

// Ajouter plan 00472 à la timeline master
if (planCompositions[472]) {
    var masterLayer472 = masterComp.layers.add(planCompositions[472]);
    masterLayer472.startTime = 552.64;
    masterLayer472.name = "UNDLM_00472";
    masterLayer472.label = 1; // Couleurs alternées
}

// Ajouter plan 00473 à la timeline master
if (planCompositions[473]) {
    var masterLayer473 = masterComp.layers.add(planCompositions[473]);
    masterLayer473.startTime = 554.6;
    masterLayer473.name = "UNDLM_00473";
    masterLayer473.label = 2; // Couleurs alternées
}

// Ajouter plan 00474 à la timeline master
if (planCompositions[474]) {
    var masterLayer474 = masterComp.layers.add(planCompositions[474]);
    masterLayer474.startTime = 556.64;
    masterLayer474.name = "UNDLM_00474";
    masterLayer474.label = 3; // Couleurs alternées
}

// Ajouter plan 00475 à la timeline master
if (planCompositions[475]) {
    var masterLayer475 = masterComp.layers.add(planCompositions[475]);
    masterLayer475.startTime = 558.8;
    masterLayer475.name = "UNDLM_00475";
    masterLayer475.label = 4; // Couleurs alternées
}

// Ajouter plan 00476 à la timeline master
if (planCompositions[476]) {
    var masterLayer476 = masterComp.layers.add(planCompositions[476]);
    masterLayer476.startTime = 562.64;
    masterLayer476.name = "UNDLM_00476";
    masterLayer476.label = 5; // Couleurs alternées
}

// Ajouter plan 00477 à la timeline master
if (planCompositions[477]) {
    var masterLayer477 = masterComp.layers.add(planCompositions[477]);
    masterLayer477.startTime = 566.24;
    masterLayer477.name = "UNDLM_00477";
    masterLayer477.label = 6; // Couleurs alternées
}

// Ajouter plan 00501 à la timeline master
if (planCompositions[501]) {
    var masterLayer501 = masterComp.layers.add(planCompositions[501]);
    masterLayer501.startTime = 570.12;
    masterLayer501.name = "UNDLM_00501";
    masterLayer501.label = 7; // Couleurs alternées
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
var seqExpression = 'var seqName = "P02_ALL";' + String.fromCharCode(13) +
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
    {start: 0, end: 4.76, name: "UNDLM_00175"},
    {start: 4.76, end: 12.76, name: "UNDLM_00176"},
    {start: 12.76, end: 17.2, name: "UNDLM_00177"},
    {start: 17.2, end: 22.6, name: "UNDLM_00193"},
    {start: 22.6, end: 32.96, name: "UNDLM_00194"},
    {start: 32.96, end: 45.760000000000005, name: "UNDLM_00195"},
    {start: 45.760000000000005, end: 49.56, name: "UNDLM_00196"},
    {start: 49.56, end: 55.760000000000005, name: "UNDLM_00197"},
    {start: 55.760000000000005, end: 61.440000000000005, name: "UNDLM_00198"},
    {start: 61.440000000000005, end: 66.36, name: "UNDLM_00199"},
    {start: 66.36, end: 68.56, name: "UNDLM_00200"},
    {start: 68.56, end: 72.72, name: "UNDLM_00201"},
    {start: 72.72, end: 80.2, name: "UNDLM_00212"},
    {start: 80.2, end: 90.16, name: "UNDLM_00213"},
    {start: 90.16, end: 98.0, name: "UNDLM_00215"},
    {start: 98.0, end: 104.52, name: "UNDLM_00216"},
    {start: 104.52, end: 115.64, name: "UNDLM_00251"},
    {start: 115.64, end: 128.64, name: "UNDLM_00252"},
    {start: 128.64, end: 137.04, name: "UNDLM_00254"},
    {start: 137.04, end: 140.56, name: "UNDLM_00255"},
    {start: 140.56, end: 142.2, name: "UNDLM_00256"},
    {start: 142.2, end: 159.16, name: "UNDLM_00262"},
    {start: 159.16, end: 174.0, name: "UNDLM_00263"},
    {start: 174.0, end: 178.24, name: "UNDLM_00275"},
    {start: 178.24, end: 179.4, name: "UNDLM_00276"},
    {start: 179.4, end: 182.92000000000002, name: "UNDLM_00277"},
    {start: 182.92000000000002, end: 191.56, name: "UNDLM_00279"},
    {start: 191.56, end: 198.0, name: "UNDLM_00280"},
    {start: 198.0, end: 205.04, name: "UNDLM_00282"},
    {start: 205.04, end: 209.72, name: "UNDLM_00283"},
    {start: 209.72, end: 212.24, name: "UNDLM_00285"},
    {start: 212.24, end: 216.20000000000002, name: "UNDLM_00311"},
    {start: 216.20000000000002, end: 235.52, name: "UNDLM_00312"},
    {start: 235.52, end: 244.08, name: "UNDLM_00313"},
    {start: 244.08, end: 254.8, name: "UNDLM_00314"},
    {start: 254.8, end: 267.40000000000003, name: "UNDLM_00315"},
    {start: 267.40000000000003, end: 294.12, name: "UNDLM_00316"},
    {start: 294.12, end: 300.12, name: "UNDLM_00317"},
    {start: 300.12, end: 304.84000000000003, name: "UNDLM_00327"},
    {start: 304.84000000000003, end: 313.16, name: "UNDLM_00328"},
    {start: 313.16, end: 324.40000000000003, name: "UNDLM_00329"},
    {start: 324.40000000000003, end: 342.08000000000004, name: "UNDLM_00330"},
    {start: 342.08000000000004, end: 368.72, name: "UNDLM_00331"},
    {start: 368.72, end: 377.8, name: "UNDLM_00384"},
    {start: 377.8, end: 390.56, name: "UNDLM_00385"},
    {start: 390.56, end: 407.12, name: "UNDLM_00386"},
    {start: 407.12, end: 411.24, name: "UNDLM_00387"},
    {start: 411.24, end: 420.44, name: "UNDLM_00391"},
    {start: 420.44, end: 428.48, name: "UNDLM_00393"},
    {start: 428.48, end: 430.92, name: "UNDLM_00394"},
    {start: 430.92, end: 440.72, name: "UNDLM_00395"},
    {start: 440.72, end: 452.0, name: "UNDLM_00396"},
    {start: 452.0, end: 462.52, name: "UNDLM_00397"},
    {start: 462.52, end: 467.15999999999997, name: "UNDLM_00398"},
    {start: 467.15999999999997, end: 470.2, name: "UNDLM_00399"},
    {start: 470.2, end: 476.4, name: "UNDLM_00400"},
    {start: 476.4, end: 479.56, name: "UNDLM_00464"},
    {start: 479.56, end: 483.4, name: "UNDLM_00465"},
    {start: 483.4, end: 520.68, name: "UNDLM_00466"},
    {start: 520.68, end: 527.0, name: "UNDLM_00467"},
    {start: 527.0, end: 531.4, name: "UNDLM_00468"},
    {start: 531.4, end: 538.76, name: "UNDLM_00469"},
    {start: 538.76, end: 548.04, name: "UNDLM_00470"},
    {start: 548.04, end: 552.64, name: "UNDLM_00471"},
    {start: 552.64, end: 554.6, name: "UNDLM_00472"},
    {start: 554.6, end: 556.64, name: "UNDLM_00473"},
    {start: 556.64, end: 558.8, name: "UNDLM_00474"},
    {start: 558.8, end: 562.64, name: "UNDLM_00475"},
    {start: 562.64, end: 566.24, name: "UNDLM_00476"},
    {start: 566.24, end: 570.12, name: "UNDLM_00477"},
    {start: 570.12, end: 582.0, name: "UNDLM_00501"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/P02_ALL/_AE/P02_ALL_01.aep");
project.save(saveFile);

// Statistiques finales détaillées
var gradedCount = 71;
var totalCount = 71;
var editOnlyCount = totalCount - gradedCount;

// Calcul des statistiques réelles d'import
var actualEditImported = editImportCount;
var actualGradedImported = gradingImportCount;
var editSuccessRate = Math.round((actualEditImported / totalCount) * 100);
var gradedSuccessRate = gradedCount > 0 ? Math.round((actualGradedImported / gradedCount) * 100) : 0;

alert("🎬 Séquence P02_ALL créée avec succès!" + "\n" + "\n" + "📊 Statistiques Détaillées:" + "\n" + "• Plans total: " + totalCount + "\n" + "• Plans EDIT importés: " + actualEditImported + "/" + totalCount + " (" + editSuccessRate + "%)" + "\n" + "• Plans GRADED importés: " + actualGradedImported + "/" + gradedCount + " (" + gradedSuccessRate + "%)" + "\n" + "• Plans EDIT manquants: " + missingEditCount + "\n" + "• Plans GRADED manquants: " + missingGradingCount + "\n" + "• Durée séquence: " + Math.round(582.0 * 100) / 100 + "s" + "\n" + "\n" + "💾 Sauvegardé: P02_ALL_01.aep" + "\n" + "\n" + "✅ Structure conforme au template AE" + "\n" + "✅ Sources UHD mises à l'échelle en 1440p" + "\n" + "✅ Import Edit + Graded avec variantes" + "\n" + "✅ Burn-ins avancés avec expressions dynamiques" + "\n" + "✅ Gestion intelligente EDIT vs GRADED" + "\n" + "✅ Messages d'avertissement et d'erreur" + "\n" + "\n" + "🔥 FONCTIONNALITÉS AVANCÉES:" + "\n" + "• Burn-in séquence (haut droite): P02_ALL v001" + "\n" + "• Burn-in plan courant (bas gauche): dynamique" + "\n" + "• Scope burn-in (centré): PNG ou texte fallback" + "\n" + "• Expressions avec détection de version" + "\n" + "• Drop shadows sur tous les burn-ins" + "\n" + "• Timecode automatique sur adjustment layer");

// Log détaillé pour Python avec toutes les métriques
$.writeln("AE_GENERATION_V2_SUCCESS:P02_ALL:" + totalCount + ":" + gradedCount + ":" +
          actualEditImported + ":" + actualGradedImported + ":" + missingEditCount + ":" + missingGradingCount);

// Log des erreurs pour debugging
if (importErrors.length > 0) {
    $.writeln("IMPORT_ERRORS:" + importErrors.join("|"));
}

// Log des succès pour validation
$.writeln("IMPORT_SUCCESS_COUNT:" + successfulImports.length);