
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ09 avec 15 plans
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
        editImportCount++;
        importSuccess176 = true;
        fileName176 = "UNDLM_00176.mov";
        logImportSuccess(176, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176.mov", fileName176);
    } catch (e) {
        logImportError(176, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess176 && editFilePoignees176.exists) {
    try {
        var editFootage176 = project.importFile(new ImportOptions(editFilePoignees176));
        editFootage176.parentFolder = fromEditFolder;
        editFootage176.name = "UNDLM_00176_AVEC_POIGNEES";
        editSources[176] = editFootage176;
        editImportCount++;
        importSuccess176 = true;
        fileName176 = "UNDLM_00176_AVEC_POIGNEES.mov";
        logImportSuccess(176, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov", fileName176);
    } catch (e) {
        logImportError(176, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess176 && editFileBis176.exists) {
    try {
        var editFootage176 = project.importFile(new ImportOptions(editFileBis176));
        editFootage176.parentFolder = fromEditFolder;
        editFootage176.name = "UNDLM_00176bis";
        editSources[176] = editFootage176;
        editImportCount++;
        importSuccess176 = true;
        fileName176 = "UNDLM_00176bis.mov";
        logImportSuccess(176, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176bis.mov", fileName176);
    } catch (e) {
        logImportError(176, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00176bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess176) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00176.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
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
        editImportCount++;
        importSuccess177 = true;
        fileName177 = "UNDLM_00177.mov";
        logImportSuccess(177, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177.mov", fileName177);
    } catch (e) {
        logImportError(177, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess177 && editFilePoignees177.exists) {
    try {
        var editFootage177 = project.importFile(new ImportOptions(editFilePoignees177));
        editFootage177.parentFolder = fromEditFolder;
        editFootage177.name = "UNDLM_00177_AVEC_POIGNEES";
        editSources[177] = editFootage177;
        editImportCount++;
        importSuccess177 = true;
        fileName177 = "UNDLM_00177_AVEC_POIGNEES.mov";
        logImportSuccess(177, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov", fileName177);
    } catch (e) {
        logImportError(177, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess177 && editFileBis177.exists) {
    try {
        var editFootage177 = project.importFile(new ImportOptions(editFileBis177));
        editFootage177.parentFolder = fromEditFolder;
        editFootage177.name = "UNDLM_00177bis";
        editSources[177] = editFootage177;
        editImportCount++;
        importSuccess177 = true;
        fileName177 = "UNDLM_00177bis.mov";
        logImportSuccess(177, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177bis.mov", fileName177);
    } catch (e) {
        logImportError(177, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00177bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess177) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00177.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00178
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178.mov");
var editFilePoignees178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov");
var editFileBis178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178bis.mov");

var importSuccess178 = false;
var fileName178 = "";

// Tenter import standard
if (editFile178.exists) {
    try {
        var editFootage178 = project.importFile(new ImportOptions(editFile178));
        editFootage178.parentFolder = fromEditFolder;
        editFootage178.name = "UNDLM_00178";
        editSources[178] = editFootage178;
        editImportCount++;
        importSuccess178 = true;
        fileName178 = "UNDLM_00178.mov";
        logImportSuccess(178, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178.mov", fileName178);
    } catch (e) {
        logImportError(178, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess178 && editFilePoignees178.exists) {
    try {
        var editFootage178 = project.importFile(new ImportOptions(editFilePoignees178));
        editFootage178.parentFolder = fromEditFolder;
        editFootage178.name = "UNDLM_00178_AVEC_POIGNEES";
        editSources[178] = editFootage178;
        editImportCount++;
        importSuccess178 = true;
        fileName178 = "UNDLM_00178_AVEC_POIGNEES.mov";
        logImportSuccess(178, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov", fileName178);
    } catch (e) {
        logImportError(178, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess178 && editFileBis178.exists) {
    try {
        var editFootage178 = project.importFile(new ImportOptions(editFileBis178));
        editFootage178.parentFolder = fromEditFolder;
        editFootage178.name = "UNDLM_00178bis";
        editSources[178] = editFootage178;
        editImportCount++;
        importSuccess178 = true;
        fileName178 = "UNDLM_00178bis.mov";
        logImportSuccess(178, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178bis.mov", fileName178);
    } catch (e) {
        logImportError(178, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00178bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess178) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00178.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00179
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179.mov");
var editFilePoignees179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov");
var editFileBis179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179bis.mov");

var importSuccess179 = false;
var fileName179 = "";

// Tenter import standard
if (editFile179.exists) {
    try {
        var editFootage179 = project.importFile(new ImportOptions(editFile179));
        editFootage179.parentFolder = fromEditFolder;
        editFootage179.name = "UNDLM_00179";
        editSources[179] = editFootage179;
        editImportCount++;
        importSuccess179 = true;
        fileName179 = "UNDLM_00179.mov";
        logImportSuccess(179, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179.mov", fileName179);
    } catch (e) {
        logImportError(179, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess179 && editFilePoignees179.exists) {
    try {
        var editFootage179 = project.importFile(new ImportOptions(editFilePoignees179));
        editFootage179.parentFolder = fromEditFolder;
        editFootage179.name = "UNDLM_00179_AVEC_POIGNEES";
        editSources[179] = editFootage179;
        editImportCount++;
        importSuccess179 = true;
        fileName179 = "UNDLM_00179_AVEC_POIGNEES.mov";
        logImportSuccess(179, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov", fileName179);
    } catch (e) {
        logImportError(179, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess179 && editFileBis179.exists) {
    try {
        var editFootage179 = project.importFile(new ImportOptions(editFileBis179));
        editFootage179.parentFolder = fromEditFolder;
        editFootage179.name = "UNDLM_00179bis";
        editSources[179] = editFootage179;
        editImportCount++;
        importSuccess179 = true;
        fileName179 = "UNDLM_00179bis.mov";
        logImportSuccess(179, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179bis.mov", fileName179);
    } catch (e) {
        logImportError(179, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00179bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess179) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00179.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00180
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180.mov");
var editFilePoignees180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov");
var editFileBis180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180bis.mov");

var importSuccess180 = false;
var fileName180 = "";

// Tenter import standard
if (editFile180.exists) {
    try {
        var editFootage180 = project.importFile(new ImportOptions(editFile180));
        editFootage180.parentFolder = fromEditFolder;
        editFootage180.name = "UNDLM_00180";
        editSources[180] = editFootage180;
        editImportCount++;
        importSuccess180 = true;
        fileName180 = "UNDLM_00180.mov";
        logImportSuccess(180, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180.mov", fileName180);
    } catch (e) {
        logImportError(180, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess180 && editFilePoignees180.exists) {
    try {
        var editFootage180 = project.importFile(new ImportOptions(editFilePoignees180));
        editFootage180.parentFolder = fromEditFolder;
        editFootage180.name = "UNDLM_00180_AVEC_POIGNEES";
        editSources[180] = editFootage180;
        editImportCount++;
        importSuccess180 = true;
        fileName180 = "UNDLM_00180_AVEC_POIGNEES.mov";
        logImportSuccess(180, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov", fileName180);
    } catch (e) {
        logImportError(180, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess180 && editFileBis180.exists) {
    try {
        var editFootage180 = project.importFile(new ImportOptions(editFileBis180));
        editFootage180.parentFolder = fromEditFolder;
        editFootage180.name = "UNDLM_00180bis";
        editSources[180] = editFootage180;
        editImportCount++;
        importSuccess180 = true;
        fileName180 = "UNDLM_00180bis.mov";
        logImportSuccess(180, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180bis.mov", fileName180);
    } catch (e) {
        logImportError(180, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00180bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess180) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00180.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00181
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181.mov");
var editFilePoignees181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov");
var editFileBis181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181bis.mov");

var importSuccess181 = false;
var fileName181 = "";

// Tenter import standard
if (editFile181.exists) {
    try {
        var editFootage181 = project.importFile(new ImportOptions(editFile181));
        editFootage181.parentFolder = fromEditFolder;
        editFootage181.name = "UNDLM_00181";
        editSources[181] = editFootage181;
        editImportCount++;
        importSuccess181 = true;
        fileName181 = "UNDLM_00181.mov";
        logImportSuccess(181, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181.mov", fileName181);
    } catch (e) {
        logImportError(181, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess181 && editFilePoignees181.exists) {
    try {
        var editFootage181 = project.importFile(new ImportOptions(editFilePoignees181));
        editFootage181.parentFolder = fromEditFolder;
        editFootage181.name = "UNDLM_00181_AVEC_POIGNEES";
        editSources[181] = editFootage181;
        editImportCount++;
        importSuccess181 = true;
        fileName181 = "UNDLM_00181_AVEC_POIGNEES.mov";
        logImportSuccess(181, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov", fileName181);
    } catch (e) {
        logImportError(181, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess181 && editFileBis181.exists) {
    try {
        var editFootage181 = project.importFile(new ImportOptions(editFileBis181));
        editFootage181.parentFolder = fromEditFolder;
        editFootage181.name = "UNDLM_00181bis";
        editSources[181] = editFootage181;
        editImportCount++;
        importSuccess181 = true;
        fileName181 = "UNDLM_00181bis.mov";
        logImportSuccess(181, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181bis.mov", fileName181);
    } catch (e) {
        logImportError(181, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00181bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess181) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00181.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00182
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182.mov");
var editFilePoignees182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov");
var editFileBis182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182bis.mov");

var importSuccess182 = false;
var fileName182 = "";

// Tenter import standard
if (editFile182.exists) {
    try {
        var editFootage182 = project.importFile(new ImportOptions(editFile182));
        editFootage182.parentFolder = fromEditFolder;
        editFootage182.name = "UNDLM_00182";
        editSources[182] = editFootage182;
        editImportCount++;
        importSuccess182 = true;
        fileName182 = "UNDLM_00182.mov";
        logImportSuccess(182, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182.mov", fileName182);
    } catch (e) {
        logImportError(182, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess182 && editFilePoignees182.exists) {
    try {
        var editFootage182 = project.importFile(new ImportOptions(editFilePoignees182));
        editFootage182.parentFolder = fromEditFolder;
        editFootage182.name = "UNDLM_00182_AVEC_POIGNEES";
        editSources[182] = editFootage182;
        editImportCount++;
        importSuccess182 = true;
        fileName182 = "UNDLM_00182_AVEC_POIGNEES.mov";
        logImportSuccess(182, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov", fileName182);
    } catch (e) {
        logImportError(182, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess182 && editFileBis182.exists) {
    try {
        var editFootage182 = project.importFile(new ImportOptions(editFileBis182));
        editFootage182.parentFolder = fromEditFolder;
        editFootage182.name = "UNDLM_00182bis";
        editSources[182] = editFootage182;
        editImportCount++;
        importSuccess182 = true;
        fileName182 = "UNDLM_00182bis.mov";
        logImportSuccess(182, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182bis.mov", fileName182);
    } catch (e) {
        logImportError(182, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00182bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess182) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00182.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00183
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183.mov");
var editFilePoignees183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov");
var editFileBis183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183bis.mov");

var importSuccess183 = false;
var fileName183 = "";

// Tenter import standard
if (editFile183.exists) {
    try {
        var editFootage183 = project.importFile(new ImportOptions(editFile183));
        editFootage183.parentFolder = fromEditFolder;
        editFootage183.name = "UNDLM_00183";
        editSources[183] = editFootage183;
        editImportCount++;
        importSuccess183 = true;
        fileName183 = "UNDLM_00183.mov";
        logImportSuccess(183, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183.mov", fileName183);
    } catch (e) {
        logImportError(183, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess183 && editFilePoignees183.exists) {
    try {
        var editFootage183 = project.importFile(new ImportOptions(editFilePoignees183));
        editFootage183.parentFolder = fromEditFolder;
        editFootage183.name = "UNDLM_00183_AVEC_POIGNEES";
        editSources[183] = editFootage183;
        editImportCount++;
        importSuccess183 = true;
        fileName183 = "UNDLM_00183_AVEC_POIGNEES.mov";
        logImportSuccess(183, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov", fileName183);
    } catch (e) {
        logImportError(183, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess183 && editFileBis183.exists) {
    try {
        var editFootage183 = project.importFile(new ImportOptions(editFileBis183));
        editFootage183.parentFolder = fromEditFolder;
        editFootage183.name = "UNDLM_00183bis";
        editSources[183] = editFootage183;
        editImportCount++;
        importSuccess183 = true;
        fileName183 = "UNDLM_00183bis.mov";
        logImportSuccess(183, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183bis.mov", fileName183);
    } catch (e) {
        logImportError(183, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00183bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess183) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00183.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00184
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184.mov");
var editFilePoignees184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov");
var editFileBis184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184bis.mov");

var importSuccess184 = false;
var fileName184 = "";

// Tenter import standard
if (editFile184.exists) {
    try {
        var editFootage184 = project.importFile(new ImportOptions(editFile184));
        editFootage184.parentFolder = fromEditFolder;
        editFootage184.name = "UNDLM_00184";
        editSources[184] = editFootage184;
        editImportCount++;
        importSuccess184 = true;
        fileName184 = "UNDLM_00184.mov";
        logImportSuccess(184, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184.mov", fileName184);
    } catch (e) {
        logImportError(184, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess184 && editFilePoignees184.exists) {
    try {
        var editFootage184 = project.importFile(new ImportOptions(editFilePoignees184));
        editFootage184.parentFolder = fromEditFolder;
        editFootage184.name = "UNDLM_00184_AVEC_POIGNEES";
        editSources[184] = editFootage184;
        editImportCount++;
        importSuccess184 = true;
        fileName184 = "UNDLM_00184_AVEC_POIGNEES.mov";
        logImportSuccess(184, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov", fileName184);
    } catch (e) {
        logImportError(184, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess184 && editFileBis184.exists) {
    try {
        var editFootage184 = project.importFile(new ImportOptions(editFileBis184));
        editFootage184.parentFolder = fromEditFolder;
        editFootage184.name = "UNDLM_00184bis";
        editSources[184] = editFootage184;
        editImportCount++;
        importSuccess184 = true;
        fileName184 = "UNDLM_00184bis.mov";
        logImportSuccess(184, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184bis.mov", fileName184);
    } catch (e) {
        logImportError(184, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00184bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess184) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00184.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00185
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185.mov");
var editFilePoignees185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov");
var editFileBis185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185bis.mov");

var importSuccess185 = false;
var fileName185 = "";

// Tenter import standard
if (editFile185.exists) {
    try {
        var editFootage185 = project.importFile(new ImportOptions(editFile185));
        editFootage185.parentFolder = fromEditFolder;
        editFootage185.name = "UNDLM_00185";
        editSources[185] = editFootage185;
        editImportCount++;
        importSuccess185 = true;
        fileName185 = "UNDLM_00185.mov";
        logImportSuccess(185, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185.mov", fileName185);
    } catch (e) {
        logImportError(185, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess185 && editFilePoignees185.exists) {
    try {
        var editFootage185 = project.importFile(new ImportOptions(editFilePoignees185));
        editFootage185.parentFolder = fromEditFolder;
        editFootage185.name = "UNDLM_00185_AVEC_POIGNEES";
        editSources[185] = editFootage185;
        editImportCount++;
        importSuccess185 = true;
        fileName185 = "UNDLM_00185_AVEC_POIGNEES.mov";
        logImportSuccess(185, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov", fileName185);
    } catch (e) {
        logImportError(185, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess185 && editFileBis185.exists) {
    try {
        var editFootage185 = project.importFile(new ImportOptions(editFileBis185));
        editFootage185.parentFolder = fromEditFolder;
        editFootage185.name = "UNDLM_00185bis";
        editSources[185] = editFootage185;
        editImportCount++;
        importSuccess185 = true;
        fileName185 = "UNDLM_00185bis.mov";
        logImportSuccess(185, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185bis.mov", fileName185);
    } catch (e) {
        logImportError(185, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00185bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess185) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00185.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00186
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186.mov");
var editFilePoignees186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov");
var editFileBis186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186bis.mov");

var importSuccess186 = false;
var fileName186 = "";

// Tenter import standard
if (editFile186.exists) {
    try {
        var editFootage186 = project.importFile(new ImportOptions(editFile186));
        editFootage186.parentFolder = fromEditFolder;
        editFootage186.name = "UNDLM_00186";
        editSources[186] = editFootage186;
        editImportCount++;
        importSuccess186 = true;
        fileName186 = "UNDLM_00186.mov";
        logImportSuccess(186, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186.mov", fileName186);
    } catch (e) {
        logImportError(186, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess186 && editFilePoignees186.exists) {
    try {
        var editFootage186 = project.importFile(new ImportOptions(editFilePoignees186));
        editFootage186.parentFolder = fromEditFolder;
        editFootage186.name = "UNDLM_00186_AVEC_POIGNEES";
        editSources[186] = editFootage186;
        editImportCount++;
        importSuccess186 = true;
        fileName186 = "UNDLM_00186_AVEC_POIGNEES.mov";
        logImportSuccess(186, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov", fileName186);
    } catch (e) {
        logImportError(186, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess186 && editFileBis186.exists) {
    try {
        var editFootage186 = project.importFile(new ImportOptions(editFileBis186));
        editFootage186.parentFolder = fromEditFolder;
        editFootage186.name = "UNDLM_00186bis";
        editSources[186] = editFootage186;
        editImportCount++;
        importSuccess186 = true;
        fileName186 = "UNDLM_00186bis.mov";
        logImportSuccess(186, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186bis.mov", fileName186);
    } catch (e) {
        logImportError(186, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00186bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess186) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00186.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00187
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187.mov");
var editFilePoignees187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov");
var editFileBis187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187bis.mov");

var importSuccess187 = false;
var fileName187 = "";

// Tenter import standard
if (editFile187.exists) {
    try {
        var editFootage187 = project.importFile(new ImportOptions(editFile187));
        editFootage187.parentFolder = fromEditFolder;
        editFootage187.name = "UNDLM_00187";
        editSources[187] = editFootage187;
        editImportCount++;
        importSuccess187 = true;
        fileName187 = "UNDLM_00187.mov";
        logImportSuccess(187, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187.mov", fileName187);
    } catch (e) {
        logImportError(187, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess187 && editFilePoignees187.exists) {
    try {
        var editFootage187 = project.importFile(new ImportOptions(editFilePoignees187));
        editFootage187.parentFolder = fromEditFolder;
        editFootage187.name = "UNDLM_00187_AVEC_POIGNEES";
        editSources[187] = editFootage187;
        editImportCount++;
        importSuccess187 = true;
        fileName187 = "UNDLM_00187_AVEC_POIGNEES.mov";
        logImportSuccess(187, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov", fileName187);
    } catch (e) {
        logImportError(187, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess187 && editFileBis187.exists) {
    try {
        var editFootage187 = project.importFile(new ImportOptions(editFileBis187));
        editFootage187.parentFolder = fromEditFolder;
        editFootage187.name = "UNDLM_00187bis";
        editSources[187] = editFootage187;
        editImportCount++;
        importSuccess187 = true;
        fileName187 = "UNDLM_00187bis.mov";
        logImportSuccess(187, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187bis.mov", fileName187);
    } catch (e) {
        logImportError(187, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00187bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess187) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00187.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00188
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188.mov");
var editFilePoignees188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov");
var editFileBis188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188bis.mov");

var importSuccess188 = false;
var fileName188 = "";

// Tenter import standard
if (editFile188.exists) {
    try {
        var editFootage188 = project.importFile(new ImportOptions(editFile188));
        editFootage188.parentFolder = fromEditFolder;
        editFootage188.name = "UNDLM_00188";
        editSources[188] = editFootage188;
        editImportCount++;
        importSuccess188 = true;
        fileName188 = "UNDLM_00188.mov";
        logImportSuccess(188, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188.mov", fileName188);
    } catch (e) {
        logImportError(188, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess188 && editFilePoignees188.exists) {
    try {
        var editFootage188 = project.importFile(new ImportOptions(editFilePoignees188));
        editFootage188.parentFolder = fromEditFolder;
        editFootage188.name = "UNDLM_00188_AVEC_POIGNEES";
        editSources[188] = editFootage188;
        editImportCount++;
        importSuccess188 = true;
        fileName188 = "UNDLM_00188_AVEC_POIGNEES.mov";
        logImportSuccess(188, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov", fileName188);
    } catch (e) {
        logImportError(188, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess188 && editFileBis188.exists) {
    try {
        var editFootage188 = project.importFile(new ImportOptions(editFileBis188));
        editFootage188.parentFolder = fromEditFolder;
        editFootage188.name = "UNDLM_00188bis";
        editSources[188] = editFootage188;
        editImportCount++;
        importSuccess188 = true;
        fileName188 = "UNDLM_00188bis.mov";
        logImportSuccess(188, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188bis.mov", fileName188);
    } catch (e) {
        logImportError(188, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00188bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess188) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00188.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00189
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189.mov");
var editFilePoignees189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov");
var editFileBis189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189bis.mov");

var importSuccess189 = false;
var fileName189 = "";

// Tenter import standard
if (editFile189.exists) {
    try {
        var editFootage189 = project.importFile(new ImportOptions(editFile189));
        editFootage189.parentFolder = fromEditFolder;
        editFootage189.name = "UNDLM_00189";
        editSources[189] = editFootage189;
        editImportCount++;
        importSuccess189 = true;
        fileName189 = "UNDLM_00189.mov";
        logImportSuccess(189, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189.mov", fileName189);
    } catch (e) {
        logImportError(189, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess189 && editFilePoignees189.exists) {
    try {
        var editFootage189 = project.importFile(new ImportOptions(editFilePoignees189));
        editFootage189.parentFolder = fromEditFolder;
        editFootage189.name = "UNDLM_00189_AVEC_POIGNEES";
        editSources[189] = editFootage189;
        editImportCount++;
        importSuccess189 = true;
        fileName189 = "UNDLM_00189_AVEC_POIGNEES.mov";
        logImportSuccess(189, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov", fileName189);
    } catch (e) {
        logImportError(189, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess189 && editFileBis189.exists) {
    try {
        var editFootage189 = project.importFile(new ImportOptions(editFileBis189));
        editFootage189.parentFolder = fromEditFolder;
        editFootage189.name = "UNDLM_00189bis";
        editSources[189] = editFootage189;
        editImportCount++;
        importSuccess189 = true;
        fileName189 = "UNDLM_00189bis.mov";
        logImportSuccess(189, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189bis.mov", fileName189);
    } catch (e) {
        logImportError(189, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00189bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess189) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00189.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00190
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190.mov");
var editFilePoignees190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov");
var editFileBis190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190bis.mov");

var importSuccess190 = false;
var fileName190 = "";

// Tenter import standard
if (editFile190.exists) {
    try {
        var editFootage190 = project.importFile(new ImportOptions(editFile190));
        editFootage190.parentFolder = fromEditFolder;
        editFootage190.name = "UNDLM_00190";
        editSources[190] = editFootage190;
        editImportCount++;
        importSuccess190 = true;
        fileName190 = "UNDLM_00190.mov";
        logImportSuccess(190, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190.mov", fileName190);
    } catch (e) {
        logImportError(190, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess190 && editFilePoignees190.exists) {
    try {
        var editFootage190 = project.importFile(new ImportOptions(editFilePoignees190));
        editFootage190.parentFolder = fromEditFolder;
        editFootage190.name = "UNDLM_00190_AVEC_POIGNEES";
        editSources[190] = editFootage190;
        editImportCount++;
        importSuccess190 = true;
        fileName190 = "UNDLM_00190_AVEC_POIGNEES.mov";
        logImportSuccess(190, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov", fileName190);
    } catch (e) {
        logImportError(190, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess190 && editFileBis190.exists) {
    try {
        var editFootage190 = project.importFile(new ImportOptions(editFileBis190));
        editFootage190.parentFolder = fromEditFolder;
        editFootage190.name = "UNDLM_00190bis";
        editSources[190] = editFootage190;
        editImportCount++;
        importSuccess190 = true;
        fileName190 = "UNDLM_00190bis.mov";
        logImportSuccess(190, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190bis.mov", fileName190);
    } catch (e) {
        logImportError(190, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00190bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess190) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00190.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
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
        gradingImportCount++;
        gradedImportSuccess176 = true;
        gradedFileName176 = "UNDLM_00176.mov";
        logImportSuccess(176, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176.mov", gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess176 && gradedFilePoignees176.exists) {
    try {
        var gradedFootage176 = project.importFile(new ImportOptions(gradedFilePoignees176));
        gradedFootage176.parentFolder = fromGradingFolder;
        gradedFootage176.name = "UNDLM_00176_AVEC_POIGNEES";
        gradingSources[176] = gradedFootage176;
        gradingImportCount++;
        gradedImportSuccess176 = true;
        gradedFileName176 = "UNDLM_00176_AVEC_POIGNEES.mov";
        logImportSuccess(176, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov", gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess176 && gradedFileBis176.exists) {
    try {
        var gradedFootage176 = project.importFile(new ImportOptions(gradedFileBis176));
        gradedFootage176.parentFolder = fromGradingFolder;
        gradedFootage176.name = "UNDLM_00176bis";
        gradingSources[176] = gradedFootage176;
        gradingImportCount++;
        gradedImportSuccess176 = true;
        gradedFileName176 = "UNDLM_00176bis.mov";
        logImportSuccess(176, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176bis.mov", gradedFileName176);
    } catch (e) {
        logImportError(176, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00176bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess176) {
    missingGradingCount++;
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
        gradingImportCount++;
        gradedImportSuccess177 = true;
        gradedFileName177 = "UNDLM_00177.mov";
        logImportSuccess(177, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177.mov", gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess177 && gradedFilePoignees177.exists) {
    try {
        var gradedFootage177 = project.importFile(new ImportOptions(gradedFilePoignees177));
        gradedFootage177.parentFolder = fromGradingFolder;
        gradedFootage177.name = "UNDLM_00177_AVEC_POIGNEES";
        gradingSources[177] = gradedFootage177;
        gradingImportCount++;
        gradedImportSuccess177 = true;
        gradedFileName177 = "UNDLM_00177_AVEC_POIGNEES.mov";
        logImportSuccess(177, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov", gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess177 && gradedFileBis177.exists) {
    try {
        var gradedFootage177 = project.importFile(new ImportOptions(gradedFileBis177));
        gradedFootage177.parentFolder = fromGradingFolder;
        gradedFootage177.name = "UNDLM_00177bis";
        gradingSources[177] = gradedFootage177;
        gradingImportCount++;
        gradedImportSuccess177 = true;
        gradedFileName177 = "UNDLM_00177bis.mov";
        logImportSuccess(177, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177bis.mov", gradedFileName177);
    } catch (e) {
        logImportError(177, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00177bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess177) {
    missingGradingCount++;
}

// Import plan GRADED 00178
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178.mov");
var gradedFilePoignees178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov");
var gradedFileBis178 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178bis.mov");

var gradedImportSuccess178 = false;
var gradedFileName178 = "";

// Tenter import standard
if (gradedFile178.exists) {
    try {
        var gradedFootage178 = project.importFile(new ImportOptions(gradedFile178));
        gradedFootage178.parentFolder = fromGradingFolder;
        gradedFootage178.name = "UNDLM_00178";
        gradingSources[178] = gradedFootage178;
        gradingImportCount++;
        gradedImportSuccess178 = true;
        gradedFileName178 = "UNDLM_00178.mov";
        logImportSuccess(178, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178.mov", gradedFileName178);
    } catch (e) {
        logImportError(178, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess178 && gradedFilePoignees178.exists) {
    try {
        var gradedFootage178 = project.importFile(new ImportOptions(gradedFilePoignees178));
        gradedFootage178.parentFolder = fromGradingFolder;
        gradedFootage178.name = "UNDLM_00178_AVEC_POIGNEES";
        gradingSources[178] = gradedFootage178;
        gradingImportCount++;
        gradedImportSuccess178 = true;
        gradedFileName178 = "UNDLM_00178_AVEC_POIGNEES.mov";
        logImportSuccess(178, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov", gradedFileName178);
    } catch (e) {
        logImportError(178, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess178 && gradedFileBis178.exists) {
    try {
        var gradedFootage178 = project.importFile(new ImportOptions(gradedFileBis178));
        gradedFootage178.parentFolder = fromGradingFolder;
        gradedFootage178.name = "UNDLM_00178bis";
        gradingSources[178] = gradedFootage178;
        gradingImportCount++;
        gradedImportSuccess178 = true;
        gradedFileName178 = "UNDLM_00178bis.mov";
        logImportSuccess(178, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178bis.mov", gradedFileName178);
    } catch (e) {
        logImportError(178, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00178bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess178) {
    missingGradingCount++;
}

// Import plan GRADED 00179
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179.mov");
var gradedFilePoignees179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov");
var gradedFileBis179 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179bis.mov");

var gradedImportSuccess179 = false;
var gradedFileName179 = "";

// Tenter import standard
if (gradedFile179.exists) {
    try {
        var gradedFootage179 = project.importFile(new ImportOptions(gradedFile179));
        gradedFootage179.parentFolder = fromGradingFolder;
        gradedFootage179.name = "UNDLM_00179";
        gradingSources[179] = gradedFootage179;
        gradingImportCount++;
        gradedImportSuccess179 = true;
        gradedFileName179 = "UNDLM_00179.mov";
        logImportSuccess(179, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179.mov", gradedFileName179);
    } catch (e) {
        logImportError(179, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess179 && gradedFilePoignees179.exists) {
    try {
        var gradedFootage179 = project.importFile(new ImportOptions(gradedFilePoignees179));
        gradedFootage179.parentFolder = fromGradingFolder;
        gradedFootage179.name = "UNDLM_00179_AVEC_POIGNEES";
        gradingSources[179] = gradedFootage179;
        gradingImportCount++;
        gradedImportSuccess179 = true;
        gradedFileName179 = "UNDLM_00179_AVEC_POIGNEES.mov";
        logImportSuccess(179, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov", gradedFileName179);
    } catch (e) {
        logImportError(179, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess179 && gradedFileBis179.exists) {
    try {
        var gradedFootage179 = project.importFile(new ImportOptions(gradedFileBis179));
        gradedFootage179.parentFolder = fromGradingFolder;
        gradedFootage179.name = "UNDLM_00179bis";
        gradingSources[179] = gradedFootage179;
        gradingImportCount++;
        gradedImportSuccess179 = true;
        gradedFileName179 = "UNDLM_00179bis.mov";
        logImportSuccess(179, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179bis.mov", gradedFileName179);
    } catch (e) {
        logImportError(179, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00179bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess179) {
    missingGradingCount++;
}

// Import plan GRADED 00180
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180.mov");
var gradedFilePoignees180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov");
var gradedFileBis180 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180bis.mov");

var gradedImportSuccess180 = false;
var gradedFileName180 = "";

// Tenter import standard
if (gradedFile180.exists) {
    try {
        var gradedFootage180 = project.importFile(new ImportOptions(gradedFile180));
        gradedFootage180.parentFolder = fromGradingFolder;
        gradedFootage180.name = "UNDLM_00180";
        gradingSources[180] = gradedFootage180;
        gradingImportCount++;
        gradedImportSuccess180 = true;
        gradedFileName180 = "UNDLM_00180.mov";
        logImportSuccess(180, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180.mov", gradedFileName180);
    } catch (e) {
        logImportError(180, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess180 && gradedFilePoignees180.exists) {
    try {
        var gradedFootage180 = project.importFile(new ImportOptions(gradedFilePoignees180));
        gradedFootage180.parentFolder = fromGradingFolder;
        gradedFootage180.name = "UNDLM_00180_AVEC_POIGNEES";
        gradingSources[180] = gradedFootage180;
        gradingImportCount++;
        gradedImportSuccess180 = true;
        gradedFileName180 = "UNDLM_00180_AVEC_POIGNEES.mov";
        logImportSuccess(180, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov", gradedFileName180);
    } catch (e) {
        logImportError(180, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess180 && gradedFileBis180.exists) {
    try {
        var gradedFootage180 = project.importFile(new ImportOptions(gradedFileBis180));
        gradedFootage180.parentFolder = fromGradingFolder;
        gradedFootage180.name = "UNDLM_00180bis";
        gradingSources[180] = gradedFootage180;
        gradingImportCount++;
        gradedImportSuccess180 = true;
        gradedFileName180 = "UNDLM_00180bis.mov";
        logImportSuccess(180, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180bis.mov", gradedFileName180);
    } catch (e) {
        logImportError(180, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00180bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess180) {
    missingGradingCount++;
}

// Import plan GRADED 00181
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181.mov");
var gradedFilePoignees181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov");
var gradedFileBis181 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181bis.mov");

var gradedImportSuccess181 = false;
var gradedFileName181 = "";

// Tenter import standard
if (gradedFile181.exists) {
    try {
        var gradedFootage181 = project.importFile(new ImportOptions(gradedFile181));
        gradedFootage181.parentFolder = fromGradingFolder;
        gradedFootage181.name = "UNDLM_00181";
        gradingSources[181] = gradedFootage181;
        gradingImportCount++;
        gradedImportSuccess181 = true;
        gradedFileName181 = "UNDLM_00181.mov";
        logImportSuccess(181, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181.mov", gradedFileName181);
    } catch (e) {
        logImportError(181, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess181 && gradedFilePoignees181.exists) {
    try {
        var gradedFootage181 = project.importFile(new ImportOptions(gradedFilePoignees181));
        gradedFootage181.parentFolder = fromGradingFolder;
        gradedFootage181.name = "UNDLM_00181_AVEC_POIGNEES";
        gradingSources[181] = gradedFootage181;
        gradingImportCount++;
        gradedImportSuccess181 = true;
        gradedFileName181 = "UNDLM_00181_AVEC_POIGNEES.mov";
        logImportSuccess(181, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov", gradedFileName181);
    } catch (e) {
        logImportError(181, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess181 && gradedFileBis181.exists) {
    try {
        var gradedFootage181 = project.importFile(new ImportOptions(gradedFileBis181));
        gradedFootage181.parentFolder = fromGradingFolder;
        gradedFootage181.name = "UNDLM_00181bis";
        gradingSources[181] = gradedFootage181;
        gradingImportCount++;
        gradedImportSuccess181 = true;
        gradedFileName181 = "UNDLM_00181bis.mov";
        logImportSuccess(181, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181bis.mov", gradedFileName181);
    } catch (e) {
        logImportError(181, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00181bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess181) {
    missingGradingCount++;
}

// Import plan GRADED 00182
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182.mov");
var gradedFilePoignees182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov");
var gradedFileBis182 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182bis.mov");

var gradedImportSuccess182 = false;
var gradedFileName182 = "";

// Tenter import standard
if (gradedFile182.exists) {
    try {
        var gradedFootage182 = project.importFile(new ImportOptions(gradedFile182));
        gradedFootage182.parentFolder = fromGradingFolder;
        gradedFootage182.name = "UNDLM_00182";
        gradingSources[182] = gradedFootage182;
        gradingImportCount++;
        gradedImportSuccess182 = true;
        gradedFileName182 = "UNDLM_00182.mov";
        logImportSuccess(182, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182.mov", gradedFileName182);
    } catch (e) {
        logImportError(182, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess182 && gradedFilePoignees182.exists) {
    try {
        var gradedFootage182 = project.importFile(new ImportOptions(gradedFilePoignees182));
        gradedFootage182.parentFolder = fromGradingFolder;
        gradedFootage182.name = "UNDLM_00182_AVEC_POIGNEES";
        gradingSources[182] = gradedFootage182;
        gradingImportCount++;
        gradedImportSuccess182 = true;
        gradedFileName182 = "UNDLM_00182_AVEC_POIGNEES.mov";
        logImportSuccess(182, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov", gradedFileName182);
    } catch (e) {
        logImportError(182, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess182 && gradedFileBis182.exists) {
    try {
        var gradedFootage182 = project.importFile(new ImportOptions(gradedFileBis182));
        gradedFootage182.parentFolder = fromGradingFolder;
        gradedFootage182.name = "UNDLM_00182bis";
        gradingSources[182] = gradedFootage182;
        gradingImportCount++;
        gradedImportSuccess182 = true;
        gradedFileName182 = "UNDLM_00182bis.mov";
        logImportSuccess(182, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182bis.mov", gradedFileName182);
    } catch (e) {
        logImportError(182, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00182bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess182) {
    missingGradingCount++;
}

// Import plan GRADED 00183
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183.mov");
var gradedFilePoignees183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov");
var gradedFileBis183 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183bis.mov");

var gradedImportSuccess183 = false;
var gradedFileName183 = "";

// Tenter import standard
if (gradedFile183.exists) {
    try {
        var gradedFootage183 = project.importFile(new ImportOptions(gradedFile183));
        gradedFootage183.parentFolder = fromGradingFolder;
        gradedFootage183.name = "UNDLM_00183";
        gradingSources[183] = gradedFootage183;
        gradingImportCount++;
        gradedImportSuccess183 = true;
        gradedFileName183 = "UNDLM_00183.mov";
        logImportSuccess(183, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183.mov", gradedFileName183);
    } catch (e) {
        logImportError(183, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess183 && gradedFilePoignees183.exists) {
    try {
        var gradedFootage183 = project.importFile(new ImportOptions(gradedFilePoignees183));
        gradedFootage183.parentFolder = fromGradingFolder;
        gradedFootage183.name = "UNDLM_00183_AVEC_POIGNEES";
        gradingSources[183] = gradedFootage183;
        gradingImportCount++;
        gradedImportSuccess183 = true;
        gradedFileName183 = "UNDLM_00183_AVEC_POIGNEES.mov";
        logImportSuccess(183, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov", gradedFileName183);
    } catch (e) {
        logImportError(183, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess183 && gradedFileBis183.exists) {
    try {
        var gradedFootage183 = project.importFile(new ImportOptions(gradedFileBis183));
        gradedFootage183.parentFolder = fromGradingFolder;
        gradedFootage183.name = "UNDLM_00183bis";
        gradingSources[183] = gradedFootage183;
        gradingImportCount++;
        gradedImportSuccess183 = true;
        gradedFileName183 = "UNDLM_00183bis.mov";
        logImportSuccess(183, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183bis.mov", gradedFileName183);
    } catch (e) {
        logImportError(183, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00183bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess183) {
    missingGradingCount++;
}

// Import plan GRADED 00184
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184.mov");
var gradedFilePoignees184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov");
var gradedFileBis184 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184bis.mov");

var gradedImportSuccess184 = false;
var gradedFileName184 = "";

// Tenter import standard
if (gradedFile184.exists) {
    try {
        var gradedFootage184 = project.importFile(new ImportOptions(gradedFile184));
        gradedFootage184.parentFolder = fromGradingFolder;
        gradedFootage184.name = "UNDLM_00184";
        gradingSources[184] = gradedFootage184;
        gradingImportCount++;
        gradedImportSuccess184 = true;
        gradedFileName184 = "UNDLM_00184.mov";
        logImportSuccess(184, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184.mov", gradedFileName184);
    } catch (e) {
        logImportError(184, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess184 && gradedFilePoignees184.exists) {
    try {
        var gradedFootage184 = project.importFile(new ImportOptions(gradedFilePoignees184));
        gradedFootage184.parentFolder = fromGradingFolder;
        gradedFootage184.name = "UNDLM_00184_AVEC_POIGNEES";
        gradingSources[184] = gradedFootage184;
        gradingImportCount++;
        gradedImportSuccess184 = true;
        gradedFileName184 = "UNDLM_00184_AVEC_POIGNEES.mov";
        logImportSuccess(184, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov", gradedFileName184);
    } catch (e) {
        logImportError(184, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess184 && gradedFileBis184.exists) {
    try {
        var gradedFootage184 = project.importFile(new ImportOptions(gradedFileBis184));
        gradedFootage184.parentFolder = fromGradingFolder;
        gradedFootage184.name = "UNDLM_00184bis";
        gradingSources[184] = gradedFootage184;
        gradingImportCount++;
        gradedImportSuccess184 = true;
        gradedFileName184 = "UNDLM_00184bis.mov";
        logImportSuccess(184, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184bis.mov", gradedFileName184);
    } catch (e) {
        logImportError(184, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00184bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess184) {
    missingGradingCount++;
}

// Import plan GRADED 00185
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185.mov");
var gradedFilePoignees185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov");
var gradedFileBis185 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185bis.mov");

var gradedImportSuccess185 = false;
var gradedFileName185 = "";

// Tenter import standard
if (gradedFile185.exists) {
    try {
        var gradedFootage185 = project.importFile(new ImportOptions(gradedFile185));
        gradedFootage185.parentFolder = fromGradingFolder;
        gradedFootage185.name = "UNDLM_00185";
        gradingSources[185] = gradedFootage185;
        gradingImportCount++;
        gradedImportSuccess185 = true;
        gradedFileName185 = "UNDLM_00185.mov";
        logImportSuccess(185, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185.mov", gradedFileName185);
    } catch (e) {
        logImportError(185, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess185 && gradedFilePoignees185.exists) {
    try {
        var gradedFootage185 = project.importFile(new ImportOptions(gradedFilePoignees185));
        gradedFootage185.parentFolder = fromGradingFolder;
        gradedFootage185.name = "UNDLM_00185_AVEC_POIGNEES";
        gradingSources[185] = gradedFootage185;
        gradingImportCount++;
        gradedImportSuccess185 = true;
        gradedFileName185 = "UNDLM_00185_AVEC_POIGNEES.mov";
        logImportSuccess(185, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov", gradedFileName185);
    } catch (e) {
        logImportError(185, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess185 && gradedFileBis185.exists) {
    try {
        var gradedFootage185 = project.importFile(new ImportOptions(gradedFileBis185));
        gradedFootage185.parentFolder = fromGradingFolder;
        gradedFootage185.name = "UNDLM_00185bis";
        gradingSources[185] = gradedFootage185;
        gradingImportCount++;
        gradedImportSuccess185 = true;
        gradedFileName185 = "UNDLM_00185bis.mov";
        logImportSuccess(185, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185bis.mov", gradedFileName185);
    } catch (e) {
        logImportError(185, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00185bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess185) {
    missingGradingCount++;
}

// Import plan GRADED 00186
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186.mov");
var gradedFilePoignees186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov");
var gradedFileBis186 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186bis.mov");

var gradedImportSuccess186 = false;
var gradedFileName186 = "";

// Tenter import standard
if (gradedFile186.exists) {
    try {
        var gradedFootage186 = project.importFile(new ImportOptions(gradedFile186));
        gradedFootage186.parentFolder = fromGradingFolder;
        gradedFootage186.name = "UNDLM_00186";
        gradingSources[186] = gradedFootage186;
        gradingImportCount++;
        gradedImportSuccess186 = true;
        gradedFileName186 = "UNDLM_00186.mov";
        logImportSuccess(186, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186.mov", gradedFileName186);
    } catch (e) {
        logImportError(186, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess186 && gradedFilePoignees186.exists) {
    try {
        var gradedFootage186 = project.importFile(new ImportOptions(gradedFilePoignees186));
        gradedFootage186.parentFolder = fromGradingFolder;
        gradedFootage186.name = "UNDLM_00186_AVEC_POIGNEES";
        gradingSources[186] = gradedFootage186;
        gradingImportCount++;
        gradedImportSuccess186 = true;
        gradedFileName186 = "UNDLM_00186_AVEC_POIGNEES.mov";
        logImportSuccess(186, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov", gradedFileName186);
    } catch (e) {
        logImportError(186, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess186 && gradedFileBis186.exists) {
    try {
        var gradedFootage186 = project.importFile(new ImportOptions(gradedFileBis186));
        gradedFootage186.parentFolder = fromGradingFolder;
        gradedFootage186.name = "UNDLM_00186bis";
        gradingSources[186] = gradedFootage186;
        gradingImportCount++;
        gradedImportSuccess186 = true;
        gradedFileName186 = "UNDLM_00186bis.mov";
        logImportSuccess(186, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186bis.mov", gradedFileName186);
    } catch (e) {
        logImportError(186, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00186bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess186) {
    missingGradingCount++;
}

// Import plan GRADED 00187
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187.mov");
var gradedFilePoignees187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov");
var gradedFileBis187 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187bis.mov");

var gradedImportSuccess187 = false;
var gradedFileName187 = "";

// Tenter import standard
if (gradedFile187.exists) {
    try {
        var gradedFootage187 = project.importFile(new ImportOptions(gradedFile187));
        gradedFootage187.parentFolder = fromGradingFolder;
        gradedFootage187.name = "UNDLM_00187";
        gradingSources[187] = gradedFootage187;
        gradingImportCount++;
        gradedImportSuccess187 = true;
        gradedFileName187 = "UNDLM_00187.mov";
        logImportSuccess(187, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187.mov", gradedFileName187);
    } catch (e) {
        logImportError(187, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess187 && gradedFilePoignees187.exists) {
    try {
        var gradedFootage187 = project.importFile(new ImportOptions(gradedFilePoignees187));
        gradedFootage187.parentFolder = fromGradingFolder;
        gradedFootage187.name = "UNDLM_00187_AVEC_POIGNEES";
        gradingSources[187] = gradedFootage187;
        gradingImportCount++;
        gradedImportSuccess187 = true;
        gradedFileName187 = "UNDLM_00187_AVEC_POIGNEES.mov";
        logImportSuccess(187, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov", gradedFileName187);
    } catch (e) {
        logImportError(187, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess187 && gradedFileBis187.exists) {
    try {
        var gradedFootage187 = project.importFile(new ImportOptions(gradedFileBis187));
        gradedFootage187.parentFolder = fromGradingFolder;
        gradedFootage187.name = "UNDLM_00187bis";
        gradingSources[187] = gradedFootage187;
        gradingImportCount++;
        gradedImportSuccess187 = true;
        gradedFileName187 = "UNDLM_00187bis.mov";
        logImportSuccess(187, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187bis.mov", gradedFileName187);
    } catch (e) {
        logImportError(187, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00187bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess187) {
    missingGradingCount++;
}

// Import plan GRADED 00188
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188.mov");
var gradedFilePoignees188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov");
var gradedFileBis188 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188bis.mov");

var gradedImportSuccess188 = false;
var gradedFileName188 = "";

// Tenter import standard
if (gradedFile188.exists) {
    try {
        var gradedFootage188 = project.importFile(new ImportOptions(gradedFile188));
        gradedFootage188.parentFolder = fromGradingFolder;
        gradedFootage188.name = "UNDLM_00188";
        gradingSources[188] = gradedFootage188;
        gradingImportCount++;
        gradedImportSuccess188 = true;
        gradedFileName188 = "UNDLM_00188.mov";
        logImportSuccess(188, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188.mov", gradedFileName188);
    } catch (e) {
        logImportError(188, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess188 && gradedFilePoignees188.exists) {
    try {
        var gradedFootage188 = project.importFile(new ImportOptions(gradedFilePoignees188));
        gradedFootage188.parentFolder = fromGradingFolder;
        gradedFootage188.name = "UNDLM_00188_AVEC_POIGNEES";
        gradingSources[188] = gradedFootage188;
        gradingImportCount++;
        gradedImportSuccess188 = true;
        gradedFileName188 = "UNDLM_00188_AVEC_POIGNEES.mov";
        logImportSuccess(188, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov", gradedFileName188);
    } catch (e) {
        logImportError(188, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess188 && gradedFileBis188.exists) {
    try {
        var gradedFootage188 = project.importFile(new ImportOptions(gradedFileBis188));
        gradedFootage188.parentFolder = fromGradingFolder;
        gradedFootage188.name = "UNDLM_00188bis";
        gradingSources[188] = gradedFootage188;
        gradingImportCount++;
        gradedImportSuccess188 = true;
        gradedFileName188 = "UNDLM_00188bis.mov";
        logImportSuccess(188, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188bis.mov", gradedFileName188);
    } catch (e) {
        logImportError(188, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00188bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess188) {
    missingGradingCount++;
}

// Import plan GRADED 00189
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189.mov");
var gradedFilePoignees189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov");
var gradedFileBis189 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189bis.mov");

var gradedImportSuccess189 = false;
var gradedFileName189 = "";

// Tenter import standard
if (gradedFile189.exists) {
    try {
        var gradedFootage189 = project.importFile(new ImportOptions(gradedFile189));
        gradedFootage189.parentFolder = fromGradingFolder;
        gradedFootage189.name = "UNDLM_00189";
        gradingSources[189] = gradedFootage189;
        gradingImportCount++;
        gradedImportSuccess189 = true;
        gradedFileName189 = "UNDLM_00189.mov";
        logImportSuccess(189, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189.mov", gradedFileName189);
    } catch (e) {
        logImportError(189, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess189 && gradedFilePoignees189.exists) {
    try {
        var gradedFootage189 = project.importFile(new ImportOptions(gradedFilePoignees189));
        gradedFootage189.parentFolder = fromGradingFolder;
        gradedFootage189.name = "UNDLM_00189_AVEC_POIGNEES";
        gradingSources[189] = gradedFootage189;
        gradingImportCount++;
        gradedImportSuccess189 = true;
        gradedFileName189 = "UNDLM_00189_AVEC_POIGNEES.mov";
        logImportSuccess(189, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov", gradedFileName189);
    } catch (e) {
        logImportError(189, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess189 && gradedFileBis189.exists) {
    try {
        var gradedFootage189 = project.importFile(new ImportOptions(gradedFileBis189));
        gradedFootage189.parentFolder = fromGradingFolder;
        gradedFootage189.name = "UNDLM_00189bis";
        gradingSources[189] = gradedFootage189;
        gradingImportCount++;
        gradedImportSuccess189 = true;
        gradedFileName189 = "UNDLM_00189bis.mov";
        logImportSuccess(189, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189bis.mov", gradedFileName189);
    } catch (e) {
        logImportError(189, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00189bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess189) {
    missingGradingCount++;
}

// Import plan GRADED 00190
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190.mov");
var gradedFilePoignees190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov");
var gradedFileBis190 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190bis.mov");

var gradedImportSuccess190 = false;
var gradedFileName190 = "";

// Tenter import standard
if (gradedFile190.exists) {
    try {
        var gradedFootage190 = project.importFile(new ImportOptions(gradedFile190));
        gradedFootage190.parentFolder = fromGradingFolder;
        gradedFootage190.name = "UNDLM_00190";
        gradingSources[190] = gradedFootage190;
        gradingImportCount++;
        gradedImportSuccess190 = true;
        gradedFileName190 = "UNDLM_00190.mov";
        logImportSuccess(190, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190.mov", gradedFileName190);
    } catch (e) {
        logImportError(190, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess190 && gradedFilePoignees190.exists) {
    try {
        var gradedFootage190 = project.importFile(new ImportOptions(gradedFilePoignees190));
        gradedFootage190.parentFolder = fromGradingFolder;
        gradedFootage190.name = "UNDLM_00190_AVEC_POIGNEES";
        gradingSources[190] = gradedFootage190;
        gradingImportCount++;
        gradedImportSuccess190 = true;
        gradedFileName190 = "UNDLM_00190_AVEC_POIGNEES.mov";
        logImportSuccess(190, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov", gradedFileName190);
    } catch (e) {
        logImportError(190, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess190 && gradedFileBis190.exists) {
    try {
        var gradedFootage190 = project.importFile(new ImportOptions(gradedFileBis190));
        gradedFootage190.parentFolder = fromGradingFolder;
        gradedFootage190.name = "UNDLM_00190bis";
        gradingSources[190] = gradedFootage190;
        gradingImportCount++;
        gradedImportSuccess190 = true;
        gradedFileName190 = "UNDLM_00190bis.mov";
        logImportSuccess(190, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190bis.mov", gradedFileName190);
    } catch (e) {
        logImportError(190, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00190bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess190) {
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


// Composition pour plan 00176
var planComp176 = project.items.addComp(
    "SQ09_UNDLM_00176_v001",
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

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity176 = false;

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
    "SQ09_UNDLM_00177_v001",
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

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity177 = false;

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


// Composition pour plan 00178
var planComp178 = project.items.addComp(
    "SQ09_UNDLM_00178_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp178.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer178 = planComp178.layers.add(bgSolidComp);
bgLayer178.name = "BG_SOLID";
bgLayer178.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer178 = false;
if (gradingSources[178]) {
    var gradedLayer178 = planComp178.layers.add(gradingSources[178]);
    gradedLayer178.name = "UNDLM_00178_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer178.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer178.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer178 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer178 = false;
if (editSources[178]) {
    var editLayer178 = planComp178.layers.add(editSources[178]);
    editLayer178.name = "UNDLM_00178_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer178.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer178.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer178 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity178 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer178) {
    // EDIT toujours activé quand disponible
    editLayer178.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer178) {
        gradedLayer178.enabled = false;
    }
} else if (hasGradedLayer178) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer178.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText178 = planComp178.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText178.name = "WARNING_NO_EDIT";
    warningText178.property("Transform").property("Position").setValue([1280, 200]);
    warningText178.guideLayer = true;
    
    var warningTextDoc178 = warningText178.property("Source Text").value;
    warningTextDoc178.fontSize = 32;
    warningTextDoc178.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc178.font = "Arial-BoldMT";
    warningTextDoc178.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText178.property("Source Text").setValue(warningTextDoc178);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText178 = planComp178.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00178");
    errorText178.name = "ERROR_NO_SOURCE";
    errorText178.property("Transform").property("Position").setValue([1280, 720]);
    errorText178.guideLayer = true;
    
    var errorTextDoc178 = errorText178.property("Source Text").value;
    errorTextDoc178.fontSize = 48;
    errorTextDoc178.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc178.font = "Arial-BoldMT";
    errorTextDoc178.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText178.property("Source Text").setValue(errorTextDoc178);
}

planCompositions[178] = planComp178;


// Composition pour plan 00179
var planComp179 = project.items.addComp(
    "SQ09_UNDLM_00179_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp179.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer179 = planComp179.layers.add(bgSolidComp);
bgLayer179.name = "BG_SOLID";
bgLayer179.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer179 = false;
if (gradingSources[179]) {
    var gradedLayer179 = planComp179.layers.add(gradingSources[179]);
    gradedLayer179.name = "UNDLM_00179_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer179.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer179.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer179 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer179 = false;
if (editSources[179]) {
    var editLayer179 = planComp179.layers.add(editSources[179]);
    editLayer179.name = "UNDLM_00179_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer179.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer179.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer179 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity179 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer179) {
    // EDIT toujours activé quand disponible
    editLayer179.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer179) {
        gradedLayer179.enabled = false;
    }
} else if (hasGradedLayer179) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer179.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText179 = planComp179.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText179.name = "WARNING_NO_EDIT";
    warningText179.property("Transform").property("Position").setValue([1280, 200]);
    warningText179.guideLayer = true;
    
    var warningTextDoc179 = warningText179.property("Source Text").value;
    warningTextDoc179.fontSize = 32;
    warningTextDoc179.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc179.font = "Arial-BoldMT";
    warningTextDoc179.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText179.property("Source Text").setValue(warningTextDoc179);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText179 = planComp179.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00179");
    errorText179.name = "ERROR_NO_SOURCE";
    errorText179.property("Transform").property("Position").setValue([1280, 720]);
    errorText179.guideLayer = true;
    
    var errorTextDoc179 = errorText179.property("Source Text").value;
    errorTextDoc179.fontSize = 48;
    errorTextDoc179.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc179.font = "Arial-BoldMT";
    errorTextDoc179.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText179.property("Source Text").setValue(errorTextDoc179);
}

planCompositions[179] = planComp179;


// Composition pour plan 00180
var planComp180 = project.items.addComp(
    "SQ09_UNDLM_00180_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp180.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer180 = planComp180.layers.add(bgSolidComp);
bgLayer180.name = "BG_SOLID";
bgLayer180.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer180 = false;
if (gradingSources[180]) {
    var gradedLayer180 = planComp180.layers.add(gradingSources[180]);
    gradedLayer180.name = "UNDLM_00180_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer180.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer180.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer180 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer180 = false;
if (editSources[180]) {
    var editLayer180 = planComp180.layers.add(editSources[180]);
    editLayer180.name = "UNDLM_00180_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer180.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer180.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer180 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity180 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer180) {
    // EDIT toujours activé quand disponible
    editLayer180.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer180) {
        gradedLayer180.enabled = false;
    }
} else if (hasGradedLayer180) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer180.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText180 = planComp180.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText180.name = "WARNING_NO_EDIT";
    warningText180.property("Transform").property("Position").setValue([1280, 200]);
    warningText180.guideLayer = true;
    
    var warningTextDoc180 = warningText180.property("Source Text").value;
    warningTextDoc180.fontSize = 32;
    warningTextDoc180.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc180.font = "Arial-BoldMT";
    warningTextDoc180.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText180.property("Source Text").setValue(warningTextDoc180);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText180 = planComp180.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00180");
    errorText180.name = "ERROR_NO_SOURCE";
    errorText180.property("Transform").property("Position").setValue([1280, 720]);
    errorText180.guideLayer = true;
    
    var errorTextDoc180 = errorText180.property("Source Text").value;
    errorTextDoc180.fontSize = 48;
    errorTextDoc180.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc180.font = "Arial-BoldMT";
    errorTextDoc180.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText180.property("Source Text").setValue(errorTextDoc180);
}

planCompositions[180] = planComp180;


// Composition pour plan 00181
var planComp181 = project.items.addComp(
    "SQ09_UNDLM_00181_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp181.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer181 = planComp181.layers.add(bgSolidComp);
bgLayer181.name = "BG_SOLID";
bgLayer181.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer181 = false;
if (gradingSources[181]) {
    var gradedLayer181 = planComp181.layers.add(gradingSources[181]);
    gradedLayer181.name = "UNDLM_00181_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer181.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer181.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer181 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer181 = false;
if (editSources[181]) {
    var editLayer181 = planComp181.layers.add(editSources[181]);
    editLayer181.name = "UNDLM_00181_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer181.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer181.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer181 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity181 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer181) {
    // EDIT toujours activé quand disponible
    editLayer181.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer181) {
        gradedLayer181.enabled = false;
    }
} else if (hasGradedLayer181) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer181.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText181 = planComp181.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText181.name = "WARNING_NO_EDIT";
    warningText181.property("Transform").property("Position").setValue([1280, 200]);
    warningText181.guideLayer = true;
    
    var warningTextDoc181 = warningText181.property("Source Text").value;
    warningTextDoc181.fontSize = 32;
    warningTextDoc181.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc181.font = "Arial-BoldMT";
    warningTextDoc181.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText181.property("Source Text").setValue(warningTextDoc181);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText181 = planComp181.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00181");
    errorText181.name = "ERROR_NO_SOURCE";
    errorText181.property("Transform").property("Position").setValue([1280, 720]);
    errorText181.guideLayer = true;
    
    var errorTextDoc181 = errorText181.property("Source Text").value;
    errorTextDoc181.fontSize = 48;
    errorTextDoc181.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc181.font = "Arial-BoldMT";
    errorTextDoc181.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText181.property("Source Text").setValue(errorTextDoc181);
}

planCompositions[181] = planComp181;


// Composition pour plan 00182
var planComp182 = project.items.addComp(
    "SQ09_UNDLM_00182_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp182.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer182 = planComp182.layers.add(bgSolidComp);
bgLayer182.name = "BG_SOLID";
bgLayer182.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer182 = false;
if (gradingSources[182]) {
    var gradedLayer182 = planComp182.layers.add(gradingSources[182]);
    gradedLayer182.name = "UNDLM_00182_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer182.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer182.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer182 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer182 = false;
if (editSources[182]) {
    var editLayer182 = planComp182.layers.add(editSources[182]);
    editLayer182.name = "UNDLM_00182_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer182.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer182.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer182 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity182 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer182) {
    // EDIT toujours activé quand disponible
    editLayer182.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer182) {
        gradedLayer182.enabled = false;
    }
} else if (hasGradedLayer182) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer182.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText182 = planComp182.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText182.name = "WARNING_NO_EDIT";
    warningText182.property("Transform").property("Position").setValue([1280, 200]);
    warningText182.guideLayer = true;
    
    var warningTextDoc182 = warningText182.property("Source Text").value;
    warningTextDoc182.fontSize = 32;
    warningTextDoc182.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc182.font = "Arial-BoldMT";
    warningTextDoc182.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText182.property("Source Text").setValue(warningTextDoc182);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText182 = planComp182.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00182");
    errorText182.name = "ERROR_NO_SOURCE";
    errorText182.property("Transform").property("Position").setValue([1280, 720]);
    errorText182.guideLayer = true;
    
    var errorTextDoc182 = errorText182.property("Source Text").value;
    errorTextDoc182.fontSize = 48;
    errorTextDoc182.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc182.font = "Arial-BoldMT";
    errorTextDoc182.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText182.property("Source Text").setValue(errorTextDoc182);
}

planCompositions[182] = planComp182;


// Composition pour plan 00183
var planComp183 = project.items.addComp(
    "SQ09_UNDLM_00183_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp183.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer183 = planComp183.layers.add(bgSolidComp);
bgLayer183.name = "BG_SOLID";
bgLayer183.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer183 = false;
if (gradingSources[183]) {
    var gradedLayer183 = planComp183.layers.add(gradingSources[183]);
    gradedLayer183.name = "UNDLM_00183_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer183.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer183.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer183 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer183 = false;
if (editSources[183]) {
    var editLayer183 = planComp183.layers.add(editSources[183]);
    editLayer183.name = "UNDLM_00183_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer183.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer183.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer183 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity183 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer183) {
    // EDIT toujours activé quand disponible
    editLayer183.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer183) {
        gradedLayer183.enabled = false;
    }
} else if (hasGradedLayer183) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer183.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText183 = planComp183.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText183.name = "WARNING_NO_EDIT";
    warningText183.property("Transform").property("Position").setValue([1280, 200]);
    warningText183.guideLayer = true;
    
    var warningTextDoc183 = warningText183.property("Source Text").value;
    warningTextDoc183.fontSize = 32;
    warningTextDoc183.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc183.font = "Arial-BoldMT";
    warningTextDoc183.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText183.property("Source Text").setValue(warningTextDoc183);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText183 = planComp183.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00183");
    errorText183.name = "ERROR_NO_SOURCE";
    errorText183.property("Transform").property("Position").setValue([1280, 720]);
    errorText183.guideLayer = true;
    
    var errorTextDoc183 = errorText183.property("Source Text").value;
    errorTextDoc183.fontSize = 48;
    errorTextDoc183.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc183.font = "Arial-BoldMT";
    errorTextDoc183.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText183.property("Source Text").setValue(errorTextDoc183);
}

planCompositions[183] = planComp183;


// Composition pour plan 00184
var planComp184 = project.items.addComp(
    "SQ09_UNDLM_00184_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp184.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer184 = planComp184.layers.add(bgSolidComp);
bgLayer184.name = "BG_SOLID";
bgLayer184.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer184 = false;
if (gradingSources[184]) {
    var gradedLayer184 = planComp184.layers.add(gradingSources[184]);
    gradedLayer184.name = "UNDLM_00184_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer184.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer184.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer184 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer184 = false;
if (editSources[184]) {
    var editLayer184 = planComp184.layers.add(editSources[184]);
    editLayer184.name = "UNDLM_00184_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer184.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer184.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer184 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity184 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer184) {
    // EDIT toujours activé quand disponible
    editLayer184.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer184) {
        gradedLayer184.enabled = false;
    }
} else if (hasGradedLayer184) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer184.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText184 = planComp184.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText184.name = "WARNING_NO_EDIT";
    warningText184.property("Transform").property("Position").setValue([1280, 200]);
    warningText184.guideLayer = true;
    
    var warningTextDoc184 = warningText184.property("Source Text").value;
    warningTextDoc184.fontSize = 32;
    warningTextDoc184.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc184.font = "Arial-BoldMT";
    warningTextDoc184.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText184.property("Source Text").setValue(warningTextDoc184);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText184 = planComp184.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00184");
    errorText184.name = "ERROR_NO_SOURCE";
    errorText184.property("Transform").property("Position").setValue([1280, 720]);
    errorText184.guideLayer = true;
    
    var errorTextDoc184 = errorText184.property("Source Text").value;
    errorTextDoc184.fontSize = 48;
    errorTextDoc184.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc184.font = "Arial-BoldMT";
    errorTextDoc184.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText184.property("Source Text").setValue(errorTextDoc184);
}

planCompositions[184] = planComp184;


// Composition pour plan 00185
var planComp185 = project.items.addComp(
    "SQ09_UNDLM_00185_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp185.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer185 = planComp185.layers.add(bgSolidComp);
bgLayer185.name = "BG_SOLID";
bgLayer185.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer185 = false;
if (gradingSources[185]) {
    var gradedLayer185 = planComp185.layers.add(gradingSources[185]);
    gradedLayer185.name = "UNDLM_00185_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer185.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer185.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer185 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer185 = false;
if (editSources[185]) {
    var editLayer185 = planComp185.layers.add(editSources[185]);
    editLayer185.name = "UNDLM_00185_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer185.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer185.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer185 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity185 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer185) {
    // EDIT toujours activé quand disponible
    editLayer185.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer185) {
        gradedLayer185.enabled = false;
    }
} else if (hasGradedLayer185) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer185.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText185 = planComp185.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText185.name = "WARNING_NO_EDIT";
    warningText185.property("Transform").property("Position").setValue([1280, 200]);
    warningText185.guideLayer = true;
    
    var warningTextDoc185 = warningText185.property("Source Text").value;
    warningTextDoc185.fontSize = 32;
    warningTextDoc185.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc185.font = "Arial-BoldMT";
    warningTextDoc185.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText185.property("Source Text").setValue(warningTextDoc185);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText185 = planComp185.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00185");
    errorText185.name = "ERROR_NO_SOURCE";
    errorText185.property("Transform").property("Position").setValue([1280, 720]);
    errorText185.guideLayer = true;
    
    var errorTextDoc185 = errorText185.property("Source Text").value;
    errorTextDoc185.fontSize = 48;
    errorTextDoc185.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc185.font = "Arial-BoldMT";
    errorTextDoc185.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText185.property("Source Text").setValue(errorTextDoc185);
}

planCompositions[185] = planComp185;


// Composition pour plan 00186
var planComp186 = project.items.addComp(
    "SQ09_UNDLM_00186_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp186.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer186 = planComp186.layers.add(bgSolidComp);
bgLayer186.name = "BG_SOLID";
bgLayer186.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer186 = false;
if (gradingSources[186]) {
    var gradedLayer186 = planComp186.layers.add(gradingSources[186]);
    gradedLayer186.name = "UNDLM_00186_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer186.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer186.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer186 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer186 = false;
if (editSources[186]) {
    var editLayer186 = planComp186.layers.add(editSources[186]);
    editLayer186.name = "UNDLM_00186_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer186.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer186.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer186 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity186 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer186) {
    // EDIT toujours activé quand disponible
    editLayer186.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer186) {
        gradedLayer186.enabled = false;
    }
} else if (hasGradedLayer186) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer186.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText186 = planComp186.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText186.name = "WARNING_NO_EDIT";
    warningText186.property("Transform").property("Position").setValue([1280, 200]);
    warningText186.guideLayer = true;
    
    var warningTextDoc186 = warningText186.property("Source Text").value;
    warningTextDoc186.fontSize = 32;
    warningTextDoc186.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc186.font = "Arial-BoldMT";
    warningTextDoc186.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText186.property("Source Text").setValue(warningTextDoc186);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText186 = planComp186.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00186");
    errorText186.name = "ERROR_NO_SOURCE";
    errorText186.property("Transform").property("Position").setValue([1280, 720]);
    errorText186.guideLayer = true;
    
    var errorTextDoc186 = errorText186.property("Source Text").value;
    errorTextDoc186.fontSize = 48;
    errorTextDoc186.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc186.font = "Arial-BoldMT";
    errorTextDoc186.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText186.property("Source Text").setValue(errorTextDoc186);
}

planCompositions[186] = planComp186;


// Composition pour plan 00187
var planComp187 = project.items.addComp(
    "SQ09_UNDLM_00187_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp187.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer187 = planComp187.layers.add(bgSolidComp);
bgLayer187.name = "BG_SOLID";
bgLayer187.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer187 = false;
if (gradingSources[187]) {
    var gradedLayer187 = planComp187.layers.add(gradingSources[187]);
    gradedLayer187.name = "UNDLM_00187_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer187.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer187.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer187 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer187 = false;
if (editSources[187]) {
    var editLayer187 = planComp187.layers.add(editSources[187]);
    editLayer187.name = "UNDLM_00187_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer187.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer187.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer187 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity187 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer187) {
    // EDIT toujours activé quand disponible
    editLayer187.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer187) {
        gradedLayer187.enabled = false;
    }
} else if (hasGradedLayer187) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer187.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText187 = planComp187.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText187.name = "WARNING_NO_EDIT";
    warningText187.property("Transform").property("Position").setValue([1280, 200]);
    warningText187.guideLayer = true;
    
    var warningTextDoc187 = warningText187.property("Source Text").value;
    warningTextDoc187.fontSize = 32;
    warningTextDoc187.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc187.font = "Arial-BoldMT";
    warningTextDoc187.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText187.property("Source Text").setValue(warningTextDoc187);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText187 = planComp187.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00187");
    errorText187.name = "ERROR_NO_SOURCE";
    errorText187.property("Transform").property("Position").setValue([1280, 720]);
    errorText187.guideLayer = true;
    
    var errorTextDoc187 = errorText187.property("Source Text").value;
    errorTextDoc187.fontSize = 48;
    errorTextDoc187.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc187.font = "Arial-BoldMT";
    errorTextDoc187.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText187.property("Source Text").setValue(errorTextDoc187);
}

planCompositions[187] = planComp187;


// Composition pour plan 00188
var planComp188 = project.items.addComp(
    "SQ09_UNDLM_00188_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp188.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer188 = planComp188.layers.add(bgSolidComp);
bgLayer188.name = "BG_SOLID";
bgLayer188.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer188 = false;
if (gradingSources[188]) {
    var gradedLayer188 = planComp188.layers.add(gradingSources[188]);
    gradedLayer188.name = "UNDLM_00188_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer188.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer188.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer188 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer188 = false;
if (editSources[188]) {
    var editLayer188 = planComp188.layers.add(editSources[188]);
    editLayer188.name = "UNDLM_00188_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer188.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer188.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer188 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity188 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer188) {
    // EDIT toujours activé quand disponible
    editLayer188.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer188) {
        gradedLayer188.enabled = false;
    }
} else if (hasGradedLayer188) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer188.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText188 = planComp188.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText188.name = "WARNING_NO_EDIT";
    warningText188.property("Transform").property("Position").setValue([1280, 200]);
    warningText188.guideLayer = true;
    
    var warningTextDoc188 = warningText188.property("Source Text").value;
    warningTextDoc188.fontSize = 32;
    warningTextDoc188.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc188.font = "Arial-BoldMT";
    warningTextDoc188.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText188.property("Source Text").setValue(warningTextDoc188);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText188 = planComp188.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00188");
    errorText188.name = "ERROR_NO_SOURCE";
    errorText188.property("Transform").property("Position").setValue([1280, 720]);
    errorText188.guideLayer = true;
    
    var errorTextDoc188 = errorText188.property("Source Text").value;
    errorTextDoc188.fontSize = 48;
    errorTextDoc188.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc188.font = "Arial-BoldMT";
    errorTextDoc188.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText188.property("Source Text").setValue(errorTextDoc188);
}

planCompositions[188] = planComp188;


// Composition pour plan 00189
var planComp189 = project.items.addComp(
    "SQ09_UNDLM_00189_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp189.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer189 = planComp189.layers.add(bgSolidComp);
bgLayer189.name = "BG_SOLID";
bgLayer189.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer189 = false;
if (gradingSources[189]) {
    var gradedLayer189 = planComp189.layers.add(gradingSources[189]);
    gradedLayer189.name = "UNDLM_00189_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer189.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer189.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer189 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer189 = false;
if (editSources[189]) {
    var editLayer189 = planComp189.layers.add(editSources[189]);
    editLayer189.name = "UNDLM_00189_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer189.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer189.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer189 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity189 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer189) {
    // EDIT toujours activé quand disponible
    editLayer189.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer189) {
        gradedLayer189.enabled = false;
    }
} else if (hasGradedLayer189) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer189.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText189 = planComp189.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText189.name = "WARNING_NO_EDIT";
    warningText189.property("Transform").property("Position").setValue([1280, 200]);
    warningText189.guideLayer = true;
    
    var warningTextDoc189 = warningText189.property("Source Text").value;
    warningTextDoc189.fontSize = 32;
    warningTextDoc189.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc189.font = "Arial-BoldMT";
    warningTextDoc189.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText189.property("Source Text").setValue(warningTextDoc189);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText189 = planComp189.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00189");
    errorText189.name = "ERROR_NO_SOURCE";
    errorText189.property("Transform").property("Position").setValue([1280, 720]);
    errorText189.guideLayer = true;
    
    var errorTextDoc189 = errorText189.property("Source Text").value;
    errorTextDoc189.fontSize = 48;
    errorTextDoc189.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc189.font = "Arial-BoldMT";
    errorTextDoc189.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText189.property("Source Text").setValue(errorTextDoc189);
}

planCompositions[189] = planComp189;


// Composition pour plan 00190
var planComp190 = project.items.addComp(
    "SQ09_UNDLM_00190_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.84,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp190.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer190 = planComp190.layers.add(bgSolidComp);
bgLayer190.name = "BG_SOLID";
bgLayer190.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer190 = false;
if (gradingSources[190]) {
    var gradedLayer190 = planComp190.layers.add(gradingSources[190]);
    gradedLayer190.name = "UNDLM_00190_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer190.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer190.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer190 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer190 = false;
if (editSources[190]) {
    var editLayer190 = planComp190.layers.add(editSources[190]);
    editLayer190.name = "UNDLM_00190_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer190.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer190.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer190 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity190 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer190) {
    // EDIT toujours activé quand disponible
    editLayer190.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer190) {
        gradedLayer190.enabled = false;
    }
} else if (hasGradedLayer190) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer190.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText190 = planComp190.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText190.name = "WARNING_NO_EDIT";
    warningText190.property("Transform").property("Position").setValue([1280, 200]);
    warningText190.guideLayer = true;
    
    var warningTextDoc190 = warningText190.property("Source Text").value;
    warningTextDoc190.fontSize = 32;
    warningTextDoc190.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc190.font = "Arial-BoldMT";
    warningTextDoc190.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText190.property("Source Text").setValue(warningTextDoc190);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText190 = planComp190.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00190");
    errorText190.name = "ERROR_NO_SOURCE";
    errorText190.property("Transform").property("Position").setValue([1280, 720]);
    errorText190.guideLayer = true;
    
    var errorTextDoc190 = errorText190.property("Source Text").value;
    errorTextDoc190.fontSize = 48;
    errorTextDoc190.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc190.font = "Arial-BoldMT";
    errorTextDoc190.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText190.property("Source Text").setValue(errorTextDoc190);
}

planCompositions[190] = planComp190;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ09_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    78.48, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00176 à la timeline master
if (planCompositions[176]) {
    var masterLayer176 = masterComp.layers.add(planCompositions[176]);
    masterLayer176.startTime = 0;
    masterLayer176.name = "UNDLM_00176";
    masterLayer176.label = 1; // Couleurs alternées
}

// Ajouter plan 00177 à la timeline master
if (planCompositions[177]) {
    var masterLayer177 = masterComp.layers.add(planCompositions[177]);
    masterLayer177.startTime = 8.0;
    masterLayer177.name = "UNDLM_00177";
    masterLayer177.label = 2; // Couleurs alternées
}

// Ajouter plan 00178 à la timeline master
if (planCompositions[178]) {
    var masterLayer178 = masterComp.layers.add(planCompositions[178]);
    masterLayer178.startTime = 12.440000000000001;
    masterLayer178.name = "UNDLM_00178";
    masterLayer178.label = 3; // Couleurs alternées
}

// Ajouter plan 00179 à la timeline master
if (planCompositions[179]) {
    var masterLayer179 = masterComp.layers.add(planCompositions[179]);
    masterLayer179.startTime = 26.04;
    masterLayer179.name = "UNDLM_00179";
    masterLayer179.label = 4; // Couleurs alternées
}

// Ajouter plan 00180 à la timeline master
if (planCompositions[180]) {
    var masterLayer180 = masterComp.layers.add(planCompositions[180]);
    masterLayer180.startTime = 31.24;
    masterLayer180.name = "UNDLM_00180";
    masterLayer180.label = 5; // Couleurs alternées
}

// Ajouter plan 00181 à la timeline master
if (planCompositions[181]) {
    var masterLayer181 = masterComp.layers.add(planCompositions[181]);
    masterLayer181.startTime = 34.12;
    masterLayer181.name = "UNDLM_00181";
    masterLayer181.label = 6; // Couleurs alternées
}

// Ajouter plan 00182 à la timeline master
if (planCompositions[182]) {
    var masterLayer182 = masterComp.layers.add(planCompositions[182]);
    masterLayer182.startTime = 37.72;
    masterLayer182.name = "UNDLM_00182";
    masterLayer182.label = 7; // Couleurs alternées
}

// Ajouter plan 00183 à la timeline master
if (planCompositions[183]) {
    var masterLayer183 = masterComp.layers.add(planCompositions[183]);
    masterLayer183.startTime = 40.68;
    masterLayer183.name = "UNDLM_00183";
    masterLayer183.label = 8; // Couleurs alternées
}

// Ajouter plan 00184 à la timeline master
if (planCompositions[184]) {
    var masterLayer184 = masterComp.layers.add(planCompositions[184]);
    masterLayer184.startTime = 43.6;
    masterLayer184.name = "UNDLM_00184";
    masterLayer184.label = 9; // Couleurs alternées
}

// Ajouter plan 00185 à la timeline master
if (planCompositions[185]) {
    var masterLayer185 = masterComp.layers.add(planCompositions[185]);
    masterLayer185.startTime = 48.68;
    masterLayer185.name = "UNDLM_00185";
    masterLayer185.label = 10; // Couleurs alternées
}

// Ajouter plan 00186 à la timeline master
if (planCompositions[186]) {
    var masterLayer186 = masterComp.layers.add(planCompositions[186]);
    masterLayer186.startTime = 54.36;
    masterLayer186.name = "UNDLM_00186";
    masterLayer186.label = 11; // Couleurs alternées
}

// Ajouter plan 00187 à la timeline master
if (planCompositions[187]) {
    var masterLayer187 = masterComp.layers.add(planCompositions[187]);
    masterLayer187.startTime = 60.6;
    masterLayer187.name = "UNDLM_00187";
    masterLayer187.label = 12; // Couleurs alternées
}

// Ajouter plan 00188 à la timeline master
if (planCompositions[188]) {
    var masterLayer188 = masterComp.layers.add(planCompositions[188]);
    masterLayer188.startTime = 63.64;
    masterLayer188.name = "UNDLM_00188";
    masterLayer188.label = 13; // Couleurs alternées
}

// Ajouter plan 00189 à la timeline master
if (planCompositions[189]) {
    var masterLayer189 = masterComp.layers.add(planCompositions[189]);
    masterLayer189.startTime = 68.08;
    masterLayer189.name = "UNDLM_00189";
    masterLayer189.label = 14; // Couleurs alternées
}

// Ajouter plan 00190 à la timeline master
if (planCompositions[190]) {
    var masterLayer190 = masterComp.layers.add(planCompositions[190]);
    masterLayer190.startTime = 72.64;
    masterLayer190.name = "UNDLM_00190";
    masterLayer190.label = 15; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ09";\n' +
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
    {start: 0, end: 8.0, name: "UNDLM_00176"},
    {start: 8.0, end: 12.440000000000001, name: "UNDLM_00177"},
    {start: 12.440000000000001, end: 26.04, name: "UNDLM_00178"},
    {start: 26.04, end: 31.24, name: "UNDLM_00179"},
    {start: 31.24, end: 34.12, name: "UNDLM_00180"},
    {start: 34.12, end: 37.72, name: "UNDLM_00181"},
    {start: 37.72, end: 40.68, name: "UNDLM_00182"},
    {start: 40.68, end: 43.6, name: "UNDLM_00183"},
    {start: 43.6, end: 48.68, name: "UNDLM_00184"},
    {start: 48.68, end: 54.36, name: "UNDLM_00185"},
    {start: 54.36, end: 60.6, name: "UNDLM_00186"},
    {start: 60.6, end: 63.64, name: "UNDLM_00187"},
    {start: 63.64, end: 68.08, name: "UNDLM_00188"},
    {start: 68.08, end: 72.64, name: "UNDLM_00189"},
    {start: 72.64, end: 78.48, name: "UNDLM_00190"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ09/_AE/SQ09_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 15;
var totalCount = 15;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ09 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(78.48 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ09_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ09:" + totalCount + ":" + gradedCount);
