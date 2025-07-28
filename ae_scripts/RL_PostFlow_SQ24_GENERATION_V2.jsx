
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence SQ24 avec 18 plans
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


// Import plan EDIT 00425
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425.mov");
var editFilePoignees425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov");
var editFileBis425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425bis.mov");

var importSuccess425 = false;
var fileName425 = "";

// Tenter import standard
if (editFile425.exists) {
    try {
        var editFootage425 = project.importFile(new ImportOptions(editFile425));
        editFootage425.parentFolder = fromEditFolder;
        editFootage425.name = "UNDLM_00425";
        editSources[425] = editFootage425;
        editImportCount++;
        importSuccess425 = true;
        fileName425 = "UNDLM_00425.mov";
        logImportSuccess(425, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425.mov", fileName425);
    } catch (e) {
        logImportError(425, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess425 && editFilePoignees425.exists) {
    try {
        var editFootage425 = project.importFile(new ImportOptions(editFilePoignees425));
        editFootage425.parentFolder = fromEditFolder;
        editFootage425.name = "UNDLM_00425_AVEC_POIGNEES";
        editSources[425] = editFootage425;
        editImportCount++;
        importSuccess425 = true;
        fileName425 = "UNDLM_00425_AVEC_POIGNEES.mov";
        logImportSuccess(425, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov", fileName425);
    } catch (e) {
        logImportError(425, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess425 && editFileBis425.exists) {
    try {
        var editFootage425 = project.importFile(new ImportOptions(editFileBis425));
        editFootage425.parentFolder = fromEditFolder;
        editFootage425.name = "UNDLM_00425bis";
        editSources[425] = editFootage425;
        editImportCount++;
        importSuccess425 = true;
        fileName425 = "UNDLM_00425bis.mov";
        logImportSuccess(425, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425bis.mov", fileName425);
    } catch (e) {
        logImportError(425, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00425bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess425) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00425.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00426
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426.mov");
var editFilePoignees426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov");
var editFileBis426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426bis.mov");

var importSuccess426 = false;
var fileName426 = "";

// Tenter import standard
if (editFile426.exists) {
    try {
        var editFootage426 = project.importFile(new ImportOptions(editFile426));
        editFootage426.parentFolder = fromEditFolder;
        editFootage426.name = "UNDLM_00426";
        editSources[426] = editFootage426;
        editImportCount++;
        importSuccess426 = true;
        fileName426 = "UNDLM_00426.mov";
        logImportSuccess(426, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426.mov", fileName426);
    } catch (e) {
        logImportError(426, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess426 && editFilePoignees426.exists) {
    try {
        var editFootage426 = project.importFile(new ImportOptions(editFilePoignees426));
        editFootage426.parentFolder = fromEditFolder;
        editFootage426.name = "UNDLM_00426_AVEC_POIGNEES";
        editSources[426] = editFootage426;
        editImportCount++;
        importSuccess426 = true;
        fileName426 = "UNDLM_00426_AVEC_POIGNEES.mov";
        logImportSuccess(426, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov", fileName426);
    } catch (e) {
        logImportError(426, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess426 && editFileBis426.exists) {
    try {
        var editFootage426 = project.importFile(new ImportOptions(editFileBis426));
        editFootage426.parentFolder = fromEditFolder;
        editFootage426.name = "UNDLM_00426bis";
        editSources[426] = editFootage426;
        editImportCount++;
        importSuccess426 = true;
        fileName426 = "UNDLM_00426bis.mov";
        logImportSuccess(426, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426bis.mov", fileName426);
    } catch (e) {
        logImportError(426, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00426bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess426) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00426.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00427
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427.mov");
var editFilePoignees427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov");
var editFileBis427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427bis.mov");

var importSuccess427 = false;
var fileName427 = "";

// Tenter import standard
if (editFile427.exists) {
    try {
        var editFootage427 = project.importFile(new ImportOptions(editFile427));
        editFootage427.parentFolder = fromEditFolder;
        editFootage427.name = "UNDLM_00427";
        editSources[427] = editFootage427;
        editImportCount++;
        importSuccess427 = true;
        fileName427 = "UNDLM_00427.mov";
        logImportSuccess(427, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427.mov", fileName427);
    } catch (e) {
        logImportError(427, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess427 && editFilePoignees427.exists) {
    try {
        var editFootage427 = project.importFile(new ImportOptions(editFilePoignees427));
        editFootage427.parentFolder = fromEditFolder;
        editFootage427.name = "UNDLM_00427_AVEC_POIGNEES";
        editSources[427] = editFootage427;
        editImportCount++;
        importSuccess427 = true;
        fileName427 = "UNDLM_00427_AVEC_POIGNEES.mov";
        logImportSuccess(427, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov", fileName427);
    } catch (e) {
        logImportError(427, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess427 && editFileBis427.exists) {
    try {
        var editFootage427 = project.importFile(new ImportOptions(editFileBis427));
        editFootage427.parentFolder = fromEditFolder;
        editFootage427.name = "UNDLM_00427bis";
        editSources[427] = editFootage427;
        editImportCount++;
        importSuccess427 = true;
        fileName427 = "UNDLM_00427bis.mov";
        logImportSuccess(427, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427bis.mov", fileName427);
    } catch (e) {
        logImportError(427, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00427bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess427) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00427.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00428
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428.mov");
var editFilePoignees428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov");
var editFileBis428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428bis.mov");

var importSuccess428 = false;
var fileName428 = "";

// Tenter import standard
if (editFile428.exists) {
    try {
        var editFootage428 = project.importFile(new ImportOptions(editFile428));
        editFootage428.parentFolder = fromEditFolder;
        editFootage428.name = "UNDLM_00428";
        editSources[428] = editFootage428;
        editImportCount++;
        importSuccess428 = true;
        fileName428 = "UNDLM_00428.mov";
        logImportSuccess(428, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428.mov", fileName428);
    } catch (e) {
        logImportError(428, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess428 && editFilePoignees428.exists) {
    try {
        var editFootage428 = project.importFile(new ImportOptions(editFilePoignees428));
        editFootage428.parentFolder = fromEditFolder;
        editFootage428.name = "UNDLM_00428_AVEC_POIGNEES";
        editSources[428] = editFootage428;
        editImportCount++;
        importSuccess428 = true;
        fileName428 = "UNDLM_00428_AVEC_POIGNEES.mov";
        logImportSuccess(428, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov", fileName428);
    } catch (e) {
        logImportError(428, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess428 && editFileBis428.exists) {
    try {
        var editFootage428 = project.importFile(new ImportOptions(editFileBis428));
        editFootage428.parentFolder = fromEditFolder;
        editFootage428.name = "UNDLM_00428bis";
        editSources[428] = editFootage428;
        editImportCount++;
        importSuccess428 = true;
        fileName428 = "UNDLM_00428bis.mov";
        logImportSuccess(428, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428bis.mov", fileName428);
    } catch (e) {
        logImportError(428, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00428bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess428) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00428.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00429
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429.mov");
var editFilePoignees429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov");
var editFileBis429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429bis.mov");

var importSuccess429 = false;
var fileName429 = "";

// Tenter import standard
if (editFile429.exists) {
    try {
        var editFootage429 = project.importFile(new ImportOptions(editFile429));
        editFootage429.parentFolder = fromEditFolder;
        editFootage429.name = "UNDLM_00429";
        editSources[429] = editFootage429;
        editImportCount++;
        importSuccess429 = true;
        fileName429 = "UNDLM_00429.mov";
        logImportSuccess(429, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429.mov", fileName429);
    } catch (e) {
        logImportError(429, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess429 && editFilePoignees429.exists) {
    try {
        var editFootage429 = project.importFile(new ImportOptions(editFilePoignees429));
        editFootage429.parentFolder = fromEditFolder;
        editFootage429.name = "UNDLM_00429_AVEC_POIGNEES";
        editSources[429] = editFootage429;
        editImportCount++;
        importSuccess429 = true;
        fileName429 = "UNDLM_00429_AVEC_POIGNEES.mov";
        logImportSuccess(429, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov", fileName429);
    } catch (e) {
        logImportError(429, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess429 && editFileBis429.exists) {
    try {
        var editFootage429 = project.importFile(new ImportOptions(editFileBis429));
        editFootage429.parentFolder = fromEditFolder;
        editFootage429.name = "UNDLM_00429bis";
        editSources[429] = editFootage429;
        editImportCount++;
        importSuccess429 = true;
        fileName429 = "UNDLM_00429bis.mov";
        logImportSuccess(429, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429bis.mov", fileName429);
    } catch (e) {
        logImportError(429, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00429bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess429) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00429.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00430
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430.mov");
var editFilePoignees430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov");
var editFileBis430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430bis.mov");

var importSuccess430 = false;
var fileName430 = "";

// Tenter import standard
if (editFile430.exists) {
    try {
        var editFootage430 = project.importFile(new ImportOptions(editFile430));
        editFootage430.parentFolder = fromEditFolder;
        editFootage430.name = "UNDLM_00430";
        editSources[430] = editFootage430;
        editImportCount++;
        importSuccess430 = true;
        fileName430 = "UNDLM_00430.mov";
        logImportSuccess(430, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430.mov", fileName430);
    } catch (e) {
        logImportError(430, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess430 && editFilePoignees430.exists) {
    try {
        var editFootage430 = project.importFile(new ImportOptions(editFilePoignees430));
        editFootage430.parentFolder = fromEditFolder;
        editFootage430.name = "UNDLM_00430_AVEC_POIGNEES";
        editSources[430] = editFootage430;
        editImportCount++;
        importSuccess430 = true;
        fileName430 = "UNDLM_00430_AVEC_POIGNEES.mov";
        logImportSuccess(430, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov", fileName430);
    } catch (e) {
        logImportError(430, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess430 && editFileBis430.exists) {
    try {
        var editFootage430 = project.importFile(new ImportOptions(editFileBis430));
        editFootage430.parentFolder = fromEditFolder;
        editFootage430.name = "UNDLM_00430bis";
        editSources[430] = editFootage430;
        editImportCount++;
        importSuccess430 = true;
        fileName430 = "UNDLM_00430bis.mov";
        logImportSuccess(430, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430bis.mov", fileName430);
    } catch (e) {
        logImportError(430, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00430bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess430) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00430.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00431
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431.mov");
var editFilePoignees431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov");
var editFileBis431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431bis.mov");

var importSuccess431 = false;
var fileName431 = "";

// Tenter import standard
if (editFile431.exists) {
    try {
        var editFootage431 = project.importFile(new ImportOptions(editFile431));
        editFootage431.parentFolder = fromEditFolder;
        editFootage431.name = "UNDLM_00431";
        editSources[431] = editFootage431;
        editImportCount++;
        importSuccess431 = true;
        fileName431 = "UNDLM_00431.mov";
        logImportSuccess(431, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431.mov", fileName431);
    } catch (e) {
        logImportError(431, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess431 && editFilePoignees431.exists) {
    try {
        var editFootage431 = project.importFile(new ImportOptions(editFilePoignees431));
        editFootage431.parentFolder = fromEditFolder;
        editFootage431.name = "UNDLM_00431_AVEC_POIGNEES";
        editSources[431] = editFootage431;
        editImportCount++;
        importSuccess431 = true;
        fileName431 = "UNDLM_00431_AVEC_POIGNEES.mov";
        logImportSuccess(431, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov", fileName431);
    } catch (e) {
        logImportError(431, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess431 && editFileBis431.exists) {
    try {
        var editFootage431 = project.importFile(new ImportOptions(editFileBis431));
        editFootage431.parentFolder = fromEditFolder;
        editFootage431.name = "UNDLM_00431bis";
        editSources[431] = editFootage431;
        editImportCount++;
        importSuccess431 = true;
        fileName431 = "UNDLM_00431bis.mov";
        logImportSuccess(431, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431bis.mov", fileName431);
    } catch (e) {
        logImportError(431, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00431bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess431) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00431.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00432
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432.mov");
var editFilePoignees432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov");
var editFileBis432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432bis.mov");

var importSuccess432 = false;
var fileName432 = "";

// Tenter import standard
if (editFile432.exists) {
    try {
        var editFootage432 = project.importFile(new ImportOptions(editFile432));
        editFootage432.parentFolder = fromEditFolder;
        editFootage432.name = "UNDLM_00432";
        editSources[432] = editFootage432;
        editImportCount++;
        importSuccess432 = true;
        fileName432 = "UNDLM_00432.mov";
        logImportSuccess(432, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432.mov", fileName432);
    } catch (e) {
        logImportError(432, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess432 && editFilePoignees432.exists) {
    try {
        var editFootage432 = project.importFile(new ImportOptions(editFilePoignees432));
        editFootage432.parentFolder = fromEditFolder;
        editFootage432.name = "UNDLM_00432_AVEC_POIGNEES";
        editSources[432] = editFootage432;
        editImportCount++;
        importSuccess432 = true;
        fileName432 = "UNDLM_00432_AVEC_POIGNEES.mov";
        logImportSuccess(432, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov", fileName432);
    } catch (e) {
        logImportError(432, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess432 && editFileBis432.exists) {
    try {
        var editFootage432 = project.importFile(new ImportOptions(editFileBis432));
        editFootage432.parentFolder = fromEditFolder;
        editFootage432.name = "UNDLM_00432bis";
        editSources[432] = editFootage432;
        editImportCount++;
        importSuccess432 = true;
        fileName432 = "UNDLM_00432bis.mov";
        logImportSuccess(432, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432bis.mov", fileName432);
    } catch (e) {
        logImportError(432, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00432bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess432) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00432.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00433
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433.mov");
var editFilePoignees433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov");
var editFileBis433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433bis.mov");

var importSuccess433 = false;
var fileName433 = "";

// Tenter import standard
if (editFile433.exists) {
    try {
        var editFootage433 = project.importFile(new ImportOptions(editFile433));
        editFootage433.parentFolder = fromEditFolder;
        editFootage433.name = "UNDLM_00433";
        editSources[433] = editFootage433;
        editImportCount++;
        importSuccess433 = true;
        fileName433 = "UNDLM_00433.mov";
        logImportSuccess(433, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433.mov", fileName433);
    } catch (e) {
        logImportError(433, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess433 && editFilePoignees433.exists) {
    try {
        var editFootage433 = project.importFile(new ImportOptions(editFilePoignees433));
        editFootage433.parentFolder = fromEditFolder;
        editFootage433.name = "UNDLM_00433_AVEC_POIGNEES";
        editSources[433] = editFootage433;
        editImportCount++;
        importSuccess433 = true;
        fileName433 = "UNDLM_00433_AVEC_POIGNEES.mov";
        logImportSuccess(433, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov", fileName433);
    } catch (e) {
        logImportError(433, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess433 && editFileBis433.exists) {
    try {
        var editFootage433 = project.importFile(new ImportOptions(editFileBis433));
        editFootage433.parentFolder = fromEditFolder;
        editFootage433.name = "UNDLM_00433bis";
        editSources[433] = editFootage433;
        editImportCount++;
        importSuccess433 = true;
        fileName433 = "UNDLM_00433bis.mov";
        logImportSuccess(433, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433bis.mov", fileName433);
    } catch (e) {
        logImportError(433, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00433bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess433) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00433.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00434
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434.mov");
var editFilePoignees434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov");
var editFileBis434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434bis.mov");

var importSuccess434 = false;
var fileName434 = "";

// Tenter import standard
if (editFile434.exists) {
    try {
        var editFootage434 = project.importFile(new ImportOptions(editFile434));
        editFootage434.parentFolder = fromEditFolder;
        editFootage434.name = "UNDLM_00434";
        editSources[434] = editFootage434;
        editImportCount++;
        importSuccess434 = true;
        fileName434 = "UNDLM_00434.mov";
        logImportSuccess(434, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434.mov", fileName434);
    } catch (e) {
        logImportError(434, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess434 && editFilePoignees434.exists) {
    try {
        var editFootage434 = project.importFile(new ImportOptions(editFilePoignees434));
        editFootage434.parentFolder = fromEditFolder;
        editFootage434.name = "UNDLM_00434_AVEC_POIGNEES";
        editSources[434] = editFootage434;
        editImportCount++;
        importSuccess434 = true;
        fileName434 = "UNDLM_00434_AVEC_POIGNEES.mov";
        logImportSuccess(434, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov", fileName434);
    } catch (e) {
        logImportError(434, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess434 && editFileBis434.exists) {
    try {
        var editFootage434 = project.importFile(new ImportOptions(editFileBis434));
        editFootage434.parentFolder = fromEditFolder;
        editFootage434.name = "UNDLM_00434bis";
        editSources[434] = editFootage434;
        editImportCount++;
        importSuccess434 = true;
        fileName434 = "UNDLM_00434bis.mov";
        logImportSuccess(434, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434bis.mov", fileName434);
    } catch (e) {
        logImportError(434, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00434bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess434) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00434.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00435
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435.mov");
var editFilePoignees435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov");
var editFileBis435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435bis.mov");

var importSuccess435 = false;
var fileName435 = "";

// Tenter import standard
if (editFile435.exists) {
    try {
        var editFootage435 = project.importFile(new ImportOptions(editFile435));
        editFootage435.parentFolder = fromEditFolder;
        editFootage435.name = "UNDLM_00435";
        editSources[435] = editFootage435;
        editImportCount++;
        importSuccess435 = true;
        fileName435 = "UNDLM_00435.mov";
        logImportSuccess(435, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435.mov", fileName435);
    } catch (e) {
        logImportError(435, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess435 && editFilePoignees435.exists) {
    try {
        var editFootage435 = project.importFile(new ImportOptions(editFilePoignees435));
        editFootage435.parentFolder = fromEditFolder;
        editFootage435.name = "UNDLM_00435_AVEC_POIGNEES";
        editSources[435] = editFootage435;
        editImportCount++;
        importSuccess435 = true;
        fileName435 = "UNDLM_00435_AVEC_POIGNEES.mov";
        logImportSuccess(435, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov", fileName435);
    } catch (e) {
        logImportError(435, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess435 && editFileBis435.exists) {
    try {
        var editFootage435 = project.importFile(new ImportOptions(editFileBis435));
        editFootage435.parentFolder = fromEditFolder;
        editFootage435.name = "UNDLM_00435bis";
        editSources[435] = editFootage435;
        editImportCount++;
        importSuccess435 = true;
        fileName435 = "UNDLM_00435bis.mov";
        logImportSuccess(435, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435bis.mov", fileName435);
    } catch (e) {
        logImportError(435, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00435bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess435) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00435.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00436
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436.mov");
var editFilePoignees436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov");
var editFileBis436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436bis.mov");

var importSuccess436 = false;
var fileName436 = "";

// Tenter import standard
if (editFile436.exists) {
    try {
        var editFootage436 = project.importFile(new ImportOptions(editFile436));
        editFootage436.parentFolder = fromEditFolder;
        editFootage436.name = "UNDLM_00436";
        editSources[436] = editFootage436;
        editImportCount++;
        importSuccess436 = true;
        fileName436 = "UNDLM_00436.mov";
        logImportSuccess(436, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436.mov", fileName436);
    } catch (e) {
        logImportError(436, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess436 && editFilePoignees436.exists) {
    try {
        var editFootage436 = project.importFile(new ImportOptions(editFilePoignees436));
        editFootage436.parentFolder = fromEditFolder;
        editFootage436.name = "UNDLM_00436_AVEC_POIGNEES";
        editSources[436] = editFootage436;
        editImportCount++;
        importSuccess436 = true;
        fileName436 = "UNDLM_00436_AVEC_POIGNEES.mov";
        logImportSuccess(436, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov", fileName436);
    } catch (e) {
        logImportError(436, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess436 && editFileBis436.exists) {
    try {
        var editFootage436 = project.importFile(new ImportOptions(editFileBis436));
        editFootage436.parentFolder = fromEditFolder;
        editFootage436.name = "UNDLM_00436bis";
        editSources[436] = editFootage436;
        editImportCount++;
        importSuccess436 = true;
        fileName436 = "UNDLM_00436bis.mov";
        logImportSuccess(436, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436bis.mov", fileName436);
    } catch (e) {
        logImportError(436, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00436bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess436) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00436.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00437
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437.mov");
var editFilePoignees437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov");
var editFileBis437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437bis.mov");

var importSuccess437 = false;
var fileName437 = "";

// Tenter import standard
if (editFile437.exists) {
    try {
        var editFootage437 = project.importFile(new ImportOptions(editFile437));
        editFootage437.parentFolder = fromEditFolder;
        editFootage437.name = "UNDLM_00437";
        editSources[437] = editFootage437;
        editImportCount++;
        importSuccess437 = true;
        fileName437 = "UNDLM_00437.mov";
        logImportSuccess(437, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437.mov", fileName437);
    } catch (e) {
        logImportError(437, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess437 && editFilePoignees437.exists) {
    try {
        var editFootage437 = project.importFile(new ImportOptions(editFilePoignees437));
        editFootage437.parentFolder = fromEditFolder;
        editFootage437.name = "UNDLM_00437_AVEC_POIGNEES";
        editSources[437] = editFootage437;
        editImportCount++;
        importSuccess437 = true;
        fileName437 = "UNDLM_00437_AVEC_POIGNEES.mov";
        logImportSuccess(437, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov", fileName437);
    } catch (e) {
        logImportError(437, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess437 && editFileBis437.exists) {
    try {
        var editFootage437 = project.importFile(new ImportOptions(editFileBis437));
        editFootage437.parentFolder = fromEditFolder;
        editFootage437.name = "UNDLM_00437bis";
        editSources[437] = editFootage437;
        editImportCount++;
        importSuccess437 = true;
        fileName437 = "UNDLM_00437bis.mov";
        logImportSuccess(437, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437bis.mov", fileName437);
    } catch (e) {
        logImportError(437, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00437bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess437) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00437.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00438
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438.mov");
var editFilePoignees438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov");
var editFileBis438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438bis.mov");

var importSuccess438 = false;
var fileName438 = "";

// Tenter import standard
if (editFile438.exists) {
    try {
        var editFootage438 = project.importFile(new ImportOptions(editFile438));
        editFootage438.parentFolder = fromEditFolder;
        editFootage438.name = "UNDLM_00438";
        editSources[438] = editFootage438;
        editImportCount++;
        importSuccess438 = true;
        fileName438 = "UNDLM_00438.mov";
        logImportSuccess(438, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438.mov", fileName438);
    } catch (e) {
        logImportError(438, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess438 && editFilePoignees438.exists) {
    try {
        var editFootage438 = project.importFile(new ImportOptions(editFilePoignees438));
        editFootage438.parentFolder = fromEditFolder;
        editFootage438.name = "UNDLM_00438_AVEC_POIGNEES";
        editSources[438] = editFootage438;
        editImportCount++;
        importSuccess438 = true;
        fileName438 = "UNDLM_00438_AVEC_POIGNEES.mov";
        logImportSuccess(438, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov", fileName438);
    } catch (e) {
        logImportError(438, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess438 && editFileBis438.exists) {
    try {
        var editFootage438 = project.importFile(new ImportOptions(editFileBis438));
        editFootage438.parentFolder = fromEditFolder;
        editFootage438.name = "UNDLM_00438bis";
        editSources[438] = editFootage438;
        editImportCount++;
        importSuccess438 = true;
        fileName438 = "UNDLM_00438bis.mov";
        logImportSuccess(438, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438bis.mov", fileName438);
    } catch (e) {
        logImportError(438, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00438bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess438) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00438.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00439
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439.mov");
var editFilePoignees439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov");
var editFileBis439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439bis.mov");

var importSuccess439 = false;
var fileName439 = "";

// Tenter import standard
if (editFile439.exists) {
    try {
        var editFootage439 = project.importFile(new ImportOptions(editFile439));
        editFootage439.parentFolder = fromEditFolder;
        editFootage439.name = "UNDLM_00439";
        editSources[439] = editFootage439;
        editImportCount++;
        importSuccess439 = true;
        fileName439 = "UNDLM_00439.mov";
        logImportSuccess(439, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439.mov", fileName439);
    } catch (e) {
        logImportError(439, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess439 && editFilePoignees439.exists) {
    try {
        var editFootage439 = project.importFile(new ImportOptions(editFilePoignees439));
        editFootage439.parentFolder = fromEditFolder;
        editFootage439.name = "UNDLM_00439_AVEC_POIGNEES";
        editSources[439] = editFootage439;
        editImportCount++;
        importSuccess439 = true;
        fileName439 = "UNDLM_00439_AVEC_POIGNEES.mov";
        logImportSuccess(439, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov", fileName439);
    } catch (e) {
        logImportError(439, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess439 && editFileBis439.exists) {
    try {
        var editFootage439 = project.importFile(new ImportOptions(editFileBis439));
        editFootage439.parentFolder = fromEditFolder;
        editFootage439.name = "UNDLM_00439bis";
        editSources[439] = editFootage439;
        editImportCount++;
        importSuccess439 = true;
        fileName439 = "UNDLM_00439bis.mov";
        logImportSuccess(439, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439bis.mov", fileName439);
    } catch (e) {
        logImportError(439, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00439bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess439) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00439.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00440
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440.mov");
var editFilePoignees440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov");
var editFileBis440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440bis.mov");

var importSuccess440 = false;
var fileName440 = "";

// Tenter import standard
if (editFile440.exists) {
    try {
        var editFootage440 = project.importFile(new ImportOptions(editFile440));
        editFootage440.parentFolder = fromEditFolder;
        editFootage440.name = "UNDLM_00440";
        editSources[440] = editFootage440;
        editImportCount++;
        importSuccess440 = true;
        fileName440 = "UNDLM_00440.mov";
        logImportSuccess(440, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440.mov", fileName440);
    } catch (e) {
        logImportError(440, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess440 && editFilePoignees440.exists) {
    try {
        var editFootage440 = project.importFile(new ImportOptions(editFilePoignees440));
        editFootage440.parentFolder = fromEditFolder;
        editFootage440.name = "UNDLM_00440_AVEC_POIGNEES";
        editSources[440] = editFootage440;
        editImportCount++;
        importSuccess440 = true;
        fileName440 = "UNDLM_00440_AVEC_POIGNEES.mov";
        logImportSuccess(440, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov", fileName440);
    } catch (e) {
        logImportError(440, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess440 && editFileBis440.exists) {
    try {
        var editFootage440 = project.importFile(new ImportOptions(editFileBis440));
        editFootage440.parentFolder = fromEditFolder;
        editFootage440.name = "UNDLM_00440bis";
        editSources[440] = editFootage440;
        editImportCount++;
        importSuccess440 = true;
        fileName440 = "UNDLM_00440bis.mov";
        logImportSuccess(440, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440bis.mov", fileName440);
    } catch (e) {
        logImportError(440, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00440bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess440) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00440.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00441
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441.mov");
var editFilePoignees441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov");
var editFileBis441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441bis.mov");

var importSuccess441 = false;
var fileName441 = "";

// Tenter import standard
if (editFile441.exists) {
    try {
        var editFootage441 = project.importFile(new ImportOptions(editFile441));
        editFootage441.parentFolder = fromEditFolder;
        editFootage441.name = "UNDLM_00441";
        editSources[441] = editFootage441;
        editImportCount++;
        importSuccess441 = true;
        fileName441 = "UNDLM_00441.mov";
        logImportSuccess(441, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441.mov", fileName441);
    } catch (e) {
        logImportError(441, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess441 && editFilePoignees441.exists) {
    try {
        var editFootage441 = project.importFile(new ImportOptions(editFilePoignees441));
        editFootage441.parentFolder = fromEditFolder;
        editFootage441.name = "UNDLM_00441_AVEC_POIGNEES";
        editSources[441] = editFootage441;
        editImportCount++;
        importSuccess441 = true;
        fileName441 = "UNDLM_00441_AVEC_POIGNEES.mov";
        logImportSuccess(441, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov", fileName441);
    } catch (e) {
        logImportError(441, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess441 && editFileBis441.exists) {
    try {
        var editFootage441 = project.importFile(new ImportOptions(editFileBis441));
        editFootage441.parentFolder = fromEditFolder;
        editFootage441.name = "UNDLM_00441bis";
        editSources[441] = editFootage441;
        editImportCount++;
        importSuccess441 = true;
        fileName441 = "UNDLM_00441bis.mov";
        logImportSuccess(441, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441bis.mov", fileName441);
    } catch (e) {
        logImportError(441, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00441bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess441) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00441.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan EDIT 00442
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var editFile442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442.mov");
var editFilePoignees442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov");
var editFileBis442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442bis.mov");

var importSuccess442 = false;
var fileName442 = "";

// Tenter import standard
if (editFile442.exists) {
    try {
        var editFootage442 = project.importFile(new ImportOptions(editFile442));
        editFootage442.parentFolder = fromEditFolder;
        editFootage442.name = "UNDLM_00442";
        editSources[442] = editFootage442;
        editImportCount++;
        importSuccess442 = true;
        fileName442 = "UNDLM_00442.mov";
        logImportSuccess(442, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442.mov", fileName442);
    } catch (e) {
        logImportError(442, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!importSuccess442 && editFilePoignees442.exists) {
    try {
        var editFootage442 = project.importFile(new ImportOptions(editFilePoignees442));
        editFootage442.parentFolder = fromEditFolder;
        editFootage442.name = "UNDLM_00442_AVEC_POIGNEES";
        editSources[442] = editFootage442;
        editImportCount++;
        importSuccess442 = true;
        fileName442 = "UNDLM_00442_AVEC_POIGNEES.mov";
        logImportSuccess(442, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov", fileName442);
    } catch (e) {
        logImportError(442, "EDIT_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!importSuccess442 && editFileBis442.exists) {
    try {
        var editFootage442 = project.importFile(new ImportOptions(editFileBis442));
        editFootage442.parentFolder = fromEditFolder;
        editFootage442.name = "UNDLM_00442bis";
        editSources[442] = editFootage442;
        editImportCount++;
        importSuccess442 = true;
        fileName442 = "UNDLM_00442bis.mov";
        logImportSuccess(442, "EDIT", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442bis.mov", fileName442);
    } catch (e) {
        logImportError(442, "EDIT_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00442bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné
if (!importSuccess442) {
    alert("❌ ERREUR: Plan EDIT manquant - UNDLM_00442.mov\n" +
          "Aucune variante trouvée (.mov, _AVEC_POIGNEES.mov, bis.mov)");
    missingEditCount++;
}

// Import plan GRADED 00425
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425.mov");
var gradedFilePoignees425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov");
var gradedFileBis425 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425bis.mov");

var gradedImportSuccess425 = false;
var gradedFileName425 = "";

// Tenter import standard
if (gradedFile425.exists) {
    try {
        var gradedFootage425 = project.importFile(new ImportOptions(gradedFile425));
        gradedFootage425.parentFolder = fromGradingFolder;
        gradedFootage425.name = "UNDLM_00425";
        gradingSources[425] = gradedFootage425;
        gradingImportCount++;
        gradedImportSuccess425 = true;
        gradedFileName425 = "UNDLM_00425.mov";
        logImportSuccess(425, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425.mov", gradedFileName425);
    } catch (e) {
        logImportError(425, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess425 && gradedFilePoignees425.exists) {
    try {
        var gradedFootage425 = project.importFile(new ImportOptions(gradedFilePoignees425));
        gradedFootage425.parentFolder = fromGradingFolder;
        gradedFootage425.name = "UNDLM_00425_AVEC_POIGNEES";
        gradingSources[425] = gradedFootage425;
        gradingImportCount++;
        gradedImportSuccess425 = true;
        gradedFileName425 = "UNDLM_00425_AVEC_POIGNEES.mov";
        logImportSuccess(425, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov", gradedFileName425);
    } catch (e) {
        logImportError(425, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess425 && gradedFileBis425.exists) {
    try {
        var gradedFootage425 = project.importFile(new ImportOptions(gradedFileBis425));
        gradedFootage425.parentFolder = fromGradingFolder;
        gradedFootage425.name = "UNDLM_00425bis";
        gradingSources[425] = gradedFootage425;
        gradingImportCount++;
        gradedImportSuccess425 = true;
        gradedFileName425 = "UNDLM_00425bis.mov";
        logImportSuccess(425, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425bis.mov", gradedFileName425);
    } catch (e) {
        logImportError(425, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00425bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess425) {
    missingGradingCount++;
}

// Import plan GRADED 00426
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426.mov");
var gradedFilePoignees426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov");
var gradedFileBis426 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426bis.mov");

var gradedImportSuccess426 = false;
var gradedFileName426 = "";

// Tenter import standard
if (gradedFile426.exists) {
    try {
        var gradedFootage426 = project.importFile(new ImportOptions(gradedFile426));
        gradedFootage426.parentFolder = fromGradingFolder;
        gradedFootage426.name = "UNDLM_00426";
        gradingSources[426] = gradedFootage426;
        gradingImportCount++;
        gradedImportSuccess426 = true;
        gradedFileName426 = "UNDLM_00426.mov";
        logImportSuccess(426, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426.mov", gradedFileName426);
    } catch (e) {
        logImportError(426, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess426 && gradedFilePoignees426.exists) {
    try {
        var gradedFootage426 = project.importFile(new ImportOptions(gradedFilePoignees426));
        gradedFootage426.parentFolder = fromGradingFolder;
        gradedFootage426.name = "UNDLM_00426_AVEC_POIGNEES";
        gradingSources[426] = gradedFootage426;
        gradingImportCount++;
        gradedImportSuccess426 = true;
        gradedFileName426 = "UNDLM_00426_AVEC_POIGNEES.mov";
        logImportSuccess(426, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov", gradedFileName426);
    } catch (e) {
        logImportError(426, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess426 && gradedFileBis426.exists) {
    try {
        var gradedFootage426 = project.importFile(new ImportOptions(gradedFileBis426));
        gradedFootage426.parentFolder = fromGradingFolder;
        gradedFootage426.name = "UNDLM_00426bis";
        gradingSources[426] = gradedFootage426;
        gradingImportCount++;
        gradedImportSuccess426 = true;
        gradedFileName426 = "UNDLM_00426bis.mov";
        logImportSuccess(426, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426bis.mov", gradedFileName426);
    } catch (e) {
        logImportError(426, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00426bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess426) {
    missingGradingCount++;
}

// Import plan GRADED 00427
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427.mov");
var gradedFilePoignees427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov");
var gradedFileBis427 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427bis.mov");

var gradedImportSuccess427 = false;
var gradedFileName427 = "";

// Tenter import standard
if (gradedFile427.exists) {
    try {
        var gradedFootage427 = project.importFile(new ImportOptions(gradedFile427));
        gradedFootage427.parentFolder = fromGradingFolder;
        gradedFootage427.name = "UNDLM_00427";
        gradingSources[427] = gradedFootage427;
        gradingImportCount++;
        gradedImportSuccess427 = true;
        gradedFileName427 = "UNDLM_00427.mov";
        logImportSuccess(427, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427.mov", gradedFileName427);
    } catch (e) {
        logImportError(427, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess427 && gradedFilePoignees427.exists) {
    try {
        var gradedFootage427 = project.importFile(new ImportOptions(gradedFilePoignees427));
        gradedFootage427.parentFolder = fromGradingFolder;
        gradedFootage427.name = "UNDLM_00427_AVEC_POIGNEES";
        gradingSources[427] = gradedFootage427;
        gradingImportCount++;
        gradedImportSuccess427 = true;
        gradedFileName427 = "UNDLM_00427_AVEC_POIGNEES.mov";
        logImportSuccess(427, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov", gradedFileName427);
    } catch (e) {
        logImportError(427, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess427 && gradedFileBis427.exists) {
    try {
        var gradedFootage427 = project.importFile(new ImportOptions(gradedFileBis427));
        gradedFootage427.parentFolder = fromGradingFolder;
        gradedFootage427.name = "UNDLM_00427bis";
        gradingSources[427] = gradedFootage427;
        gradingImportCount++;
        gradedImportSuccess427 = true;
        gradedFileName427 = "UNDLM_00427bis.mov";
        logImportSuccess(427, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427bis.mov", gradedFileName427);
    } catch (e) {
        logImportError(427, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00427bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess427) {
    missingGradingCount++;
}

// Import plan GRADED 00428
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428.mov");
var gradedFilePoignees428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov");
var gradedFileBis428 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428bis.mov");

var gradedImportSuccess428 = false;
var gradedFileName428 = "";

// Tenter import standard
if (gradedFile428.exists) {
    try {
        var gradedFootage428 = project.importFile(new ImportOptions(gradedFile428));
        gradedFootage428.parentFolder = fromGradingFolder;
        gradedFootage428.name = "UNDLM_00428";
        gradingSources[428] = gradedFootage428;
        gradingImportCount++;
        gradedImportSuccess428 = true;
        gradedFileName428 = "UNDLM_00428.mov";
        logImportSuccess(428, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428.mov", gradedFileName428);
    } catch (e) {
        logImportError(428, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess428 && gradedFilePoignees428.exists) {
    try {
        var gradedFootage428 = project.importFile(new ImportOptions(gradedFilePoignees428));
        gradedFootage428.parentFolder = fromGradingFolder;
        gradedFootage428.name = "UNDLM_00428_AVEC_POIGNEES";
        gradingSources[428] = gradedFootage428;
        gradingImportCount++;
        gradedImportSuccess428 = true;
        gradedFileName428 = "UNDLM_00428_AVEC_POIGNEES.mov";
        logImportSuccess(428, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov", gradedFileName428);
    } catch (e) {
        logImportError(428, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess428 && gradedFileBis428.exists) {
    try {
        var gradedFootage428 = project.importFile(new ImportOptions(gradedFileBis428));
        gradedFootage428.parentFolder = fromGradingFolder;
        gradedFootage428.name = "UNDLM_00428bis";
        gradingSources[428] = gradedFootage428;
        gradingImportCount++;
        gradedImportSuccess428 = true;
        gradedFileName428 = "UNDLM_00428bis.mov";
        logImportSuccess(428, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428bis.mov", gradedFileName428);
    } catch (e) {
        logImportError(428, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00428bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess428) {
    missingGradingCount++;
}

// Import plan GRADED 00429
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429.mov");
var gradedFilePoignees429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov");
var gradedFileBis429 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429bis.mov");

var gradedImportSuccess429 = false;
var gradedFileName429 = "";

// Tenter import standard
if (gradedFile429.exists) {
    try {
        var gradedFootage429 = project.importFile(new ImportOptions(gradedFile429));
        gradedFootage429.parentFolder = fromGradingFolder;
        gradedFootage429.name = "UNDLM_00429";
        gradingSources[429] = gradedFootage429;
        gradingImportCount++;
        gradedImportSuccess429 = true;
        gradedFileName429 = "UNDLM_00429.mov";
        logImportSuccess(429, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429.mov", gradedFileName429);
    } catch (e) {
        logImportError(429, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess429 && gradedFilePoignees429.exists) {
    try {
        var gradedFootage429 = project.importFile(new ImportOptions(gradedFilePoignees429));
        gradedFootage429.parentFolder = fromGradingFolder;
        gradedFootage429.name = "UNDLM_00429_AVEC_POIGNEES";
        gradingSources[429] = gradedFootage429;
        gradingImportCount++;
        gradedImportSuccess429 = true;
        gradedFileName429 = "UNDLM_00429_AVEC_POIGNEES.mov";
        logImportSuccess(429, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov", gradedFileName429);
    } catch (e) {
        logImportError(429, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess429 && gradedFileBis429.exists) {
    try {
        var gradedFootage429 = project.importFile(new ImportOptions(gradedFileBis429));
        gradedFootage429.parentFolder = fromGradingFolder;
        gradedFootage429.name = "UNDLM_00429bis";
        gradingSources[429] = gradedFootage429;
        gradingImportCount++;
        gradedImportSuccess429 = true;
        gradedFileName429 = "UNDLM_00429bis.mov";
        logImportSuccess(429, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429bis.mov", gradedFileName429);
    } catch (e) {
        logImportError(429, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00429bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess429) {
    missingGradingCount++;
}

// Import plan GRADED 00430
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430.mov");
var gradedFilePoignees430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov");
var gradedFileBis430 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430bis.mov");

var gradedImportSuccess430 = false;
var gradedFileName430 = "";

// Tenter import standard
if (gradedFile430.exists) {
    try {
        var gradedFootage430 = project.importFile(new ImportOptions(gradedFile430));
        gradedFootage430.parentFolder = fromGradingFolder;
        gradedFootage430.name = "UNDLM_00430";
        gradingSources[430] = gradedFootage430;
        gradingImportCount++;
        gradedImportSuccess430 = true;
        gradedFileName430 = "UNDLM_00430.mov";
        logImportSuccess(430, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430.mov", gradedFileName430);
    } catch (e) {
        logImportError(430, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess430 && gradedFilePoignees430.exists) {
    try {
        var gradedFootage430 = project.importFile(new ImportOptions(gradedFilePoignees430));
        gradedFootage430.parentFolder = fromGradingFolder;
        gradedFootage430.name = "UNDLM_00430_AVEC_POIGNEES";
        gradingSources[430] = gradedFootage430;
        gradingImportCount++;
        gradedImportSuccess430 = true;
        gradedFileName430 = "UNDLM_00430_AVEC_POIGNEES.mov";
        logImportSuccess(430, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov", gradedFileName430);
    } catch (e) {
        logImportError(430, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess430 && gradedFileBis430.exists) {
    try {
        var gradedFootage430 = project.importFile(new ImportOptions(gradedFileBis430));
        gradedFootage430.parentFolder = fromGradingFolder;
        gradedFootage430.name = "UNDLM_00430bis";
        gradingSources[430] = gradedFootage430;
        gradingImportCount++;
        gradedImportSuccess430 = true;
        gradedFileName430 = "UNDLM_00430bis.mov";
        logImportSuccess(430, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430bis.mov", gradedFileName430);
    } catch (e) {
        logImportError(430, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00430bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess430) {
    missingGradingCount++;
}

// Import plan GRADED 00431
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431.mov");
var gradedFilePoignees431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov");
var gradedFileBis431 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431bis.mov");

var gradedImportSuccess431 = false;
var gradedFileName431 = "";

// Tenter import standard
if (gradedFile431.exists) {
    try {
        var gradedFootage431 = project.importFile(new ImportOptions(gradedFile431));
        gradedFootage431.parentFolder = fromGradingFolder;
        gradedFootage431.name = "UNDLM_00431";
        gradingSources[431] = gradedFootage431;
        gradingImportCount++;
        gradedImportSuccess431 = true;
        gradedFileName431 = "UNDLM_00431.mov";
        logImportSuccess(431, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431.mov", gradedFileName431);
    } catch (e) {
        logImportError(431, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess431 && gradedFilePoignees431.exists) {
    try {
        var gradedFootage431 = project.importFile(new ImportOptions(gradedFilePoignees431));
        gradedFootage431.parentFolder = fromGradingFolder;
        gradedFootage431.name = "UNDLM_00431_AVEC_POIGNEES";
        gradingSources[431] = gradedFootage431;
        gradingImportCount++;
        gradedImportSuccess431 = true;
        gradedFileName431 = "UNDLM_00431_AVEC_POIGNEES.mov";
        logImportSuccess(431, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov", gradedFileName431);
    } catch (e) {
        logImportError(431, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess431 && gradedFileBis431.exists) {
    try {
        var gradedFootage431 = project.importFile(new ImportOptions(gradedFileBis431));
        gradedFootage431.parentFolder = fromGradingFolder;
        gradedFootage431.name = "UNDLM_00431bis";
        gradingSources[431] = gradedFootage431;
        gradingImportCount++;
        gradedImportSuccess431 = true;
        gradedFileName431 = "UNDLM_00431bis.mov";
        logImportSuccess(431, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431bis.mov", gradedFileName431);
    } catch (e) {
        logImportError(431, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00431bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess431) {
    missingGradingCount++;
}

// Import plan GRADED 00432
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432.mov");
var gradedFilePoignees432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov");
var gradedFileBis432 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432bis.mov");

var gradedImportSuccess432 = false;
var gradedFileName432 = "";

// Tenter import standard
if (gradedFile432.exists) {
    try {
        var gradedFootage432 = project.importFile(new ImportOptions(gradedFile432));
        gradedFootage432.parentFolder = fromGradingFolder;
        gradedFootage432.name = "UNDLM_00432";
        gradingSources[432] = gradedFootage432;
        gradingImportCount++;
        gradedImportSuccess432 = true;
        gradedFileName432 = "UNDLM_00432.mov";
        logImportSuccess(432, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432.mov", gradedFileName432);
    } catch (e) {
        logImportError(432, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess432 && gradedFilePoignees432.exists) {
    try {
        var gradedFootage432 = project.importFile(new ImportOptions(gradedFilePoignees432));
        gradedFootage432.parentFolder = fromGradingFolder;
        gradedFootage432.name = "UNDLM_00432_AVEC_POIGNEES";
        gradingSources[432] = gradedFootage432;
        gradingImportCount++;
        gradedImportSuccess432 = true;
        gradedFileName432 = "UNDLM_00432_AVEC_POIGNEES.mov";
        logImportSuccess(432, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov", gradedFileName432);
    } catch (e) {
        logImportError(432, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess432 && gradedFileBis432.exists) {
    try {
        var gradedFootage432 = project.importFile(new ImportOptions(gradedFileBis432));
        gradedFootage432.parentFolder = fromGradingFolder;
        gradedFootage432.name = "UNDLM_00432bis";
        gradingSources[432] = gradedFootage432;
        gradingImportCount++;
        gradedImportSuccess432 = true;
        gradedFileName432 = "UNDLM_00432bis.mov";
        logImportSuccess(432, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432bis.mov", gradedFileName432);
    } catch (e) {
        logImportError(432, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00432bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess432) {
    missingGradingCount++;
}

// Import plan GRADED 00433
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433.mov");
var gradedFilePoignees433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov");
var gradedFileBis433 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433bis.mov");

var gradedImportSuccess433 = false;
var gradedFileName433 = "";

// Tenter import standard
if (gradedFile433.exists) {
    try {
        var gradedFootage433 = project.importFile(new ImportOptions(gradedFile433));
        gradedFootage433.parentFolder = fromGradingFolder;
        gradedFootage433.name = "UNDLM_00433";
        gradingSources[433] = gradedFootage433;
        gradingImportCount++;
        gradedImportSuccess433 = true;
        gradedFileName433 = "UNDLM_00433.mov";
        logImportSuccess(433, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433.mov", gradedFileName433);
    } catch (e) {
        logImportError(433, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess433 && gradedFilePoignees433.exists) {
    try {
        var gradedFootage433 = project.importFile(new ImportOptions(gradedFilePoignees433));
        gradedFootage433.parentFolder = fromGradingFolder;
        gradedFootage433.name = "UNDLM_00433_AVEC_POIGNEES";
        gradingSources[433] = gradedFootage433;
        gradingImportCount++;
        gradedImportSuccess433 = true;
        gradedFileName433 = "UNDLM_00433_AVEC_POIGNEES.mov";
        logImportSuccess(433, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov", gradedFileName433);
    } catch (e) {
        logImportError(433, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess433 && gradedFileBis433.exists) {
    try {
        var gradedFootage433 = project.importFile(new ImportOptions(gradedFileBis433));
        gradedFootage433.parentFolder = fromGradingFolder;
        gradedFootage433.name = "UNDLM_00433bis";
        gradingSources[433] = gradedFootage433;
        gradingImportCount++;
        gradedImportSuccess433 = true;
        gradedFileName433 = "UNDLM_00433bis.mov";
        logImportSuccess(433, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433bis.mov", gradedFileName433);
    } catch (e) {
        logImportError(433, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00433bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess433) {
    missingGradingCount++;
}

// Import plan GRADED 00434
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434.mov");
var gradedFilePoignees434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov");
var gradedFileBis434 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434bis.mov");

var gradedImportSuccess434 = false;
var gradedFileName434 = "";

// Tenter import standard
if (gradedFile434.exists) {
    try {
        var gradedFootage434 = project.importFile(new ImportOptions(gradedFile434));
        gradedFootage434.parentFolder = fromGradingFolder;
        gradedFootage434.name = "UNDLM_00434";
        gradingSources[434] = gradedFootage434;
        gradingImportCount++;
        gradedImportSuccess434 = true;
        gradedFileName434 = "UNDLM_00434.mov";
        logImportSuccess(434, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434.mov", gradedFileName434);
    } catch (e) {
        logImportError(434, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess434 && gradedFilePoignees434.exists) {
    try {
        var gradedFootage434 = project.importFile(new ImportOptions(gradedFilePoignees434));
        gradedFootage434.parentFolder = fromGradingFolder;
        gradedFootage434.name = "UNDLM_00434_AVEC_POIGNEES";
        gradingSources[434] = gradedFootage434;
        gradingImportCount++;
        gradedImportSuccess434 = true;
        gradedFileName434 = "UNDLM_00434_AVEC_POIGNEES.mov";
        logImportSuccess(434, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov", gradedFileName434);
    } catch (e) {
        logImportError(434, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess434 && gradedFileBis434.exists) {
    try {
        var gradedFootage434 = project.importFile(new ImportOptions(gradedFileBis434));
        gradedFootage434.parentFolder = fromGradingFolder;
        gradedFootage434.name = "UNDLM_00434bis";
        gradingSources[434] = gradedFootage434;
        gradingImportCount++;
        gradedImportSuccess434 = true;
        gradedFileName434 = "UNDLM_00434bis.mov";
        logImportSuccess(434, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434bis.mov", gradedFileName434);
    } catch (e) {
        logImportError(434, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00434bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess434) {
    missingGradingCount++;
}

// Import plan GRADED 00435
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435.mov");
var gradedFilePoignees435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov");
var gradedFileBis435 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435bis.mov");

var gradedImportSuccess435 = false;
var gradedFileName435 = "";

// Tenter import standard
if (gradedFile435.exists) {
    try {
        var gradedFootage435 = project.importFile(new ImportOptions(gradedFile435));
        gradedFootage435.parentFolder = fromGradingFolder;
        gradedFootage435.name = "UNDLM_00435";
        gradingSources[435] = gradedFootage435;
        gradingImportCount++;
        gradedImportSuccess435 = true;
        gradedFileName435 = "UNDLM_00435.mov";
        logImportSuccess(435, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435.mov", gradedFileName435);
    } catch (e) {
        logImportError(435, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess435 && gradedFilePoignees435.exists) {
    try {
        var gradedFootage435 = project.importFile(new ImportOptions(gradedFilePoignees435));
        gradedFootage435.parentFolder = fromGradingFolder;
        gradedFootage435.name = "UNDLM_00435_AVEC_POIGNEES";
        gradingSources[435] = gradedFootage435;
        gradingImportCount++;
        gradedImportSuccess435 = true;
        gradedFileName435 = "UNDLM_00435_AVEC_POIGNEES.mov";
        logImportSuccess(435, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov", gradedFileName435);
    } catch (e) {
        logImportError(435, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess435 && gradedFileBis435.exists) {
    try {
        var gradedFootage435 = project.importFile(new ImportOptions(gradedFileBis435));
        gradedFootage435.parentFolder = fromGradingFolder;
        gradedFootage435.name = "UNDLM_00435bis";
        gradingSources[435] = gradedFootage435;
        gradingImportCount++;
        gradedImportSuccess435 = true;
        gradedFileName435 = "UNDLM_00435bis.mov";
        logImportSuccess(435, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435bis.mov", gradedFileName435);
    } catch (e) {
        logImportError(435, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00435bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess435) {
    missingGradingCount++;
}

// Import plan GRADED 00436
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436.mov");
var gradedFilePoignees436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov");
var gradedFileBis436 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436bis.mov");

var gradedImportSuccess436 = false;
var gradedFileName436 = "";

// Tenter import standard
if (gradedFile436.exists) {
    try {
        var gradedFootage436 = project.importFile(new ImportOptions(gradedFile436));
        gradedFootage436.parentFolder = fromGradingFolder;
        gradedFootage436.name = "UNDLM_00436";
        gradingSources[436] = gradedFootage436;
        gradingImportCount++;
        gradedImportSuccess436 = true;
        gradedFileName436 = "UNDLM_00436.mov";
        logImportSuccess(436, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436.mov", gradedFileName436);
    } catch (e) {
        logImportError(436, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess436 && gradedFilePoignees436.exists) {
    try {
        var gradedFootage436 = project.importFile(new ImportOptions(gradedFilePoignees436));
        gradedFootage436.parentFolder = fromGradingFolder;
        gradedFootage436.name = "UNDLM_00436_AVEC_POIGNEES";
        gradingSources[436] = gradedFootage436;
        gradingImportCount++;
        gradedImportSuccess436 = true;
        gradedFileName436 = "UNDLM_00436_AVEC_POIGNEES.mov";
        logImportSuccess(436, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov", gradedFileName436);
    } catch (e) {
        logImportError(436, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess436 && gradedFileBis436.exists) {
    try {
        var gradedFootage436 = project.importFile(new ImportOptions(gradedFileBis436));
        gradedFootage436.parentFolder = fromGradingFolder;
        gradedFootage436.name = "UNDLM_00436bis";
        gradingSources[436] = gradedFootage436;
        gradingImportCount++;
        gradedImportSuccess436 = true;
        gradedFileName436 = "UNDLM_00436bis.mov";
        logImportSuccess(436, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436bis.mov", gradedFileName436);
    } catch (e) {
        logImportError(436, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00436bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess436) {
    missingGradingCount++;
}

// Import plan GRADED 00437
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437.mov");
var gradedFilePoignees437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov");
var gradedFileBis437 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437bis.mov");

var gradedImportSuccess437 = false;
var gradedFileName437 = "";

// Tenter import standard
if (gradedFile437.exists) {
    try {
        var gradedFootage437 = project.importFile(new ImportOptions(gradedFile437));
        gradedFootage437.parentFolder = fromGradingFolder;
        gradedFootage437.name = "UNDLM_00437";
        gradingSources[437] = gradedFootage437;
        gradingImportCount++;
        gradedImportSuccess437 = true;
        gradedFileName437 = "UNDLM_00437.mov";
        logImportSuccess(437, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437.mov", gradedFileName437);
    } catch (e) {
        logImportError(437, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess437 && gradedFilePoignees437.exists) {
    try {
        var gradedFootage437 = project.importFile(new ImportOptions(gradedFilePoignees437));
        gradedFootage437.parentFolder = fromGradingFolder;
        gradedFootage437.name = "UNDLM_00437_AVEC_POIGNEES";
        gradingSources[437] = gradedFootage437;
        gradingImportCount++;
        gradedImportSuccess437 = true;
        gradedFileName437 = "UNDLM_00437_AVEC_POIGNEES.mov";
        logImportSuccess(437, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov", gradedFileName437);
    } catch (e) {
        logImportError(437, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess437 && gradedFileBis437.exists) {
    try {
        var gradedFootage437 = project.importFile(new ImportOptions(gradedFileBis437));
        gradedFootage437.parentFolder = fromGradingFolder;
        gradedFootage437.name = "UNDLM_00437bis";
        gradingSources[437] = gradedFootage437;
        gradingImportCount++;
        gradedImportSuccess437 = true;
        gradedFileName437 = "UNDLM_00437bis.mov";
        logImportSuccess(437, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437bis.mov", gradedFileName437);
    } catch (e) {
        logImportError(437, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00437bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess437) {
    missingGradingCount++;
}

// Import plan GRADED 00438
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438.mov");
var gradedFilePoignees438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov");
var gradedFileBis438 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438bis.mov");

var gradedImportSuccess438 = false;
var gradedFileName438 = "";

// Tenter import standard
if (gradedFile438.exists) {
    try {
        var gradedFootage438 = project.importFile(new ImportOptions(gradedFile438));
        gradedFootage438.parentFolder = fromGradingFolder;
        gradedFootage438.name = "UNDLM_00438";
        gradingSources[438] = gradedFootage438;
        gradingImportCount++;
        gradedImportSuccess438 = true;
        gradedFileName438 = "UNDLM_00438.mov";
        logImportSuccess(438, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438.mov", gradedFileName438);
    } catch (e) {
        logImportError(438, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess438 && gradedFilePoignees438.exists) {
    try {
        var gradedFootage438 = project.importFile(new ImportOptions(gradedFilePoignees438));
        gradedFootage438.parentFolder = fromGradingFolder;
        gradedFootage438.name = "UNDLM_00438_AVEC_POIGNEES";
        gradingSources[438] = gradedFootage438;
        gradingImportCount++;
        gradedImportSuccess438 = true;
        gradedFileName438 = "UNDLM_00438_AVEC_POIGNEES.mov";
        logImportSuccess(438, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov", gradedFileName438);
    } catch (e) {
        logImportError(438, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess438 && gradedFileBis438.exists) {
    try {
        var gradedFootage438 = project.importFile(new ImportOptions(gradedFileBis438));
        gradedFootage438.parentFolder = fromGradingFolder;
        gradedFootage438.name = "UNDLM_00438bis";
        gradingSources[438] = gradedFootage438;
        gradingImportCount++;
        gradedImportSuccess438 = true;
        gradedFileName438 = "UNDLM_00438bis.mov";
        logImportSuccess(438, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438bis.mov", gradedFileName438);
    } catch (e) {
        logImportError(438, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00438bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess438) {
    missingGradingCount++;
}

// Import plan GRADED 00439
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439.mov");
var gradedFilePoignees439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov");
var gradedFileBis439 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439bis.mov");

var gradedImportSuccess439 = false;
var gradedFileName439 = "";

// Tenter import standard
if (gradedFile439.exists) {
    try {
        var gradedFootage439 = project.importFile(new ImportOptions(gradedFile439));
        gradedFootage439.parentFolder = fromGradingFolder;
        gradedFootage439.name = "UNDLM_00439";
        gradingSources[439] = gradedFootage439;
        gradingImportCount++;
        gradedImportSuccess439 = true;
        gradedFileName439 = "UNDLM_00439.mov";
        logImportSuccess(439, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439.mov", gradedFileName439);
    } catch (e) {
        logImportError(439, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess439 && gradedFilePoignees439.exists) {
    try {
        var gradedFootage439 = project.importFile(new ImportOptions(gradedFilePoignees439));
        gradedFootage439.parentFolder = fromGradingFolder;
        gradedFootage439.name = "UNDLM_00439_AVEC_POIGNEES";
        gradingSources[439] = gradedFootage439;
        gradingImportCount++;
        gradedImportSuccess439 = true;
        gradedFileName439 = "UNDLM_00439_AVEC_POIGNEES.mov";
        logImportSuccess(439, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov", gradedFileName439);
    } catch (e) {
        logImportError(439, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess439 && gradedFileBis439.exists) {
    try {
        var gradedFootage439 = project.importFile(new ImportOptions(gradedFileBis439));
        gradedFootage439.parentFolder = fromGradingFolder;
        gradedFootage439.name = "UNDLM_00439bis";
        gradingSources[439] = gradedFootage439;
        gradingImportCount++;
        gradedImportSuccess439 = true;
        gradedFileName439 = "UNDLM_00439bis.mov";
        logImportSuccess(439, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439bis.mov", gradedFileName439);
    } catch (e) {
        logImportError(439, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00439bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess439) {
    missingGradingCount++;
}

// Import plan GRADED 00440
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440.mov");
var gradedFilePoignees440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov");
var gradedFileBis440 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440bis.mov");

var gradedImportSuccess440 = false;
var gradedFileName440 = "";

// Tenter import standard
if (gradedFile440.exists) {
    try {
        var gradedFootage440 = project.importFile(new ImportOptions(gradedFile440));
        gradedFootage440.parentFolder = fromGradingFolder;
        gradedFootage440.name = "UNDLM_00440";
        gradingSources[440] = gradedFootage440;
        gradingImportCount++;
        gradedImportSuccess440 = true;
        gradedFileName440 = "UNDLM_00440.mov";
        logImportSuccess(440, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440.mov", gradedFileName440);
    } catch (e) {
        logImportError(440, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess440 && gradedFilePoignees440.exists) {
    try {
        var gradedFootage440 = project.importFile(new ImportOptions(gradedFilePoignees440));
        gradedFootage440.parentFolder = fromGradingFolder;
        gradedFootage440.name = "UNDLM_00440_AVEC_POIGNEES";
        gradingSources[440] = gradedFootage440;
        gradingImportCount++;
        gradedImportSuccess440 = true;
        gradedFileName440 = "UNDLM_00440_AVEC_POIGNEES.mov";
        logImportSuccess(440, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov", gradedFileName440);
    } catch (e) {
        logImportError(440, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess440 && gradedFileBis440.exists) {
    try {
        var gradedFootage440 = project.importFile(new ImportOptions(gradedFileBis440));
        gradedFootage440.parentFolder = fromGradingFolder;
        gradedFootage440.name = "UNDLM_00440bis";
        gradingSources[440] = gradedFootage440;
        gradingImportCount++;
        gradedImportSuccess440 = true;
        gradedFileName440 = "UNDLM_00440bis.mov";
        logImportSuccess(440, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440bis.mov", gradedFileName440);
    } catch (e) {
        logImportError(440, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00440bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess440) {
    missingGradingCount++;
}

// Import plan GRADED 00441
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441.mov");
var gradedFilePoignees441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov");
var gradedFileBis441 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441bis.mov");

var gradedImportSuccess441 = false;
var gradedFileName441 = "";

// Tenter import standard
if (gradedFile441.exists) {
    try {
        var gradedFootage441 = project.importFile(new ImportOptions(gradedFile441));
        gradedFootage441.parentFolder = fromGradingFolder;
        gradedFootage441.name = "UNDLM_00441";
        gradingSources[441] = gradedFootage441;
        gradingImportCount++;
        gradedImportSuccess441 = true;
        gradedFileName441 = "UNDLM_00441.mov";
        logImportSuccess(441, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441.mov", gradedFileName441);
    } catch (e) {
        logImportError(441, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess441 && gradedFilePoignees441.exists) {
    try {
        var gradedFootage441 = project.importFile(new ImportOptions(gradedFilePoignees441));
        gradedFootage441.parentFolder = fromGradingFolder;
        gradedFootage441.name = "UNDLM_00441_AVEC_POIGNEES";
        gradingSources[441] = gradedFootage441;
        gradingImportCount++;
        gradedImportSuccess441 = true;
        gradedFileName441 = "UNDLM_00441_AVEC_POIGNEES.mov";
        logImportSuccess(441, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov", gradedFileName441);
    } catch (e) {
        logImportError(441, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess441 && gradedFileBis441.exists) {
    try {
        var gradedFootage441 = project.importFile(new ImportOptions(gradedFileBis441));
        gradedFootage441.parentFolder = fromGradingFolder;
        gradedFootage441.name = "UNDLM_00441bis";
        gradingSources[441] = gradedFootage441;
        gradingImportCount++;
        gradedImportSuccess441 = true;
        gradedFileName441 = "UNDLM_00441bis.mov";
        logImportSuccess(441, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441bis.mov", gradedFileName441);
    } catch (e) {
        logImportError(441, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00441bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess441) {
    missingGradingCount++;
}

// Import plan GRADED 00442
// Test des variantes dans l'ordre : standard -> _AVEC_POIGNEES -> bis
var gradedFile442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442.mov");
var gradedFilePoignees442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov");
var gradedFileBis442 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442bis.mov");

var gradedImportSuccess442 = false;
var gradedFileName442 = "";

// Tenter import standard
if (gradedFile442.exists) {
    try {
        var gradedFootage442 = project.importFile(new ImportOptions(gradedFile442));
        gradedFootage442.parentFolder = fromGradingFolder;
        gradedFootage442.name = "UNDLM_00442";
        gradingSources[442] = gradedFootage442;
        gradingImportCount++;
        gradedImportSuccess442 = true;
        gradedFileName442 = "UNDLM_00442.mov";
        logImportSuccess(442, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442.mov", gradedFileName442);
    } catch (e) {
        logImportError(442, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442.mov", e);
    }
}

// Si échec, tenter import AVEC_POIGNEES
if (!gradedImportSuccess442 && gradedFilePoignees442.exists) {
    try {
        var gradedFootage442 = project.importFile(new ImportOptions(gradedFilePoignees442));
        gradedFootage442.parentFolder = fromGradingFolder;
        gradedFootage442.name = "UNDLM_00442_AVEC_POIGNEES";
        gradingSources[442] = gradedFootage442;
        gradingImportCount++;
        gradedImportSuccess442 = true;
        gradedFileName442 = "UNDLM_00442_AVEC_POIGNEES.mov";
        logImportSuccess(442, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov", gradedFileName442);
    } catch (e) {
        logImportError(442, "GRADED_POIGNEES", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442_AVEC_POIGNEES.mov", e);
    }
}

// Si échec, tenter import bis
if (!gradedImportSuccess442 && gradedFileBis442.exists) {
    try {
        var gradedFootage442 = project.importFile(new ImportOptions(gradedFileBis442));
        gradedFootage442.parentFolder = fromGradingFolder;
        gradedFootage442.name = "UNDLM_00442bis";
        gradingSources[442] = gradedFootage442;
        gradingImportCount++;
        gradedImportSuccess442 = true;
        gradedFileName442 = "UNDLM_00442bis.mov";
        logImportSuccess(442, "GRADED", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442bis.mov", gradedFileName442);
    } catch (e) {
        logImportError(442, "GRADED_BIS", "/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00442bis.mov", e);
    }
}

// Si aucune variante n'a fonctionné, c'est normal (pas d'erreur pour GRADED)
if (!gradedImportSuccess442) {
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


// Composition pour plan 00425
var planComp425 = project.items.addComp(
    "SQ24_UNDLM_00425_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp425.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer425 = planComp425.layers.add(bgSolidComp);
bgLayer425.name = "BG_SOLID";
bgLayer425.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer425 = false;
if (gradingSources[425]) {
    var gradedLayer425 = planComp425.layers.add(gradingSources[425]);
    gradedLayer425.name = "UNDLM_00425_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer425.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer425.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer425 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer425 = false;
if (editSources[425]) {
    var editLayer425 = planComp425.layers.add(editSources[425]);
    editLayer425.name = "UNDLM_00425_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer425.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer425.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer425 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity425 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer425) {
    // EDIT toujours activé quand disponible
    editLayer425.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer425) {
        gradedLayer425.enabled = false;
    }
} else if (hasGradedLayer425) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer425.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText425 = planComp425.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText425.name = "WARNING_NO_EDIT";
    warningText425.property("Transform").property("Position").setValue([1280, 200]);
    warningText425.guideLayer = true;
    
    var warningTextDoc425 = warningText425.property("Source Text").value;
    warningTextDoc425.fontSize = 32;
    warningTextDoc425.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc425.font = "Arial-BoldMT";
    warningTextDoc425.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText425.property("Source Text").setValue(warningTextDoc425);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText425 = planComp425.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00425");
    errorText425.name = "ERROR_NO_SOURCE";
    errorText425.property("Transform").property("Position").setValue([1280, 720]);
    errorText425.guideLayer = true;
    
    var errorTextDoc425 = errorText425.property("Source Text").value;
    errorTextDoc425.fontSize = 48;
    errorTextDoc425.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc425.font = "Arial-BoldMT";
    errorTextDoc425.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText425.property("Source Text").setValue(errorTextDoc425);
}

planCompositions[425] = planComp425;


// Composition pour plan 00426
var planComp426 = project.items.addComp(
    "SQ24_UNDLM_00426_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp426.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer426 = planComp426.layers.add(bgSolidComp);
bgLayer426.name = "BG_SOLID";
bgLayer426.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer426 = false;
if (gradingSources[426]) {
    var gradedLayer426 = planComp426.layers.add(gradingSources[426]);
    gradedLayer426.name = "UNDLM_00426_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer426.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer426.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer426 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer426 = false;
if (editSources[426]) {
    var editLayer426 = planComp426.layers.add(editSources[426]);
    editLayer426.name = "UNDLM_00426_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer426.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer426.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer426 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity426 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer426) {
    // EDIT toujours activé quand disponible
    editLayer426.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer426) {
        gradedLayer426.enabled = false;
    }
} else if (hasGradedLayer426) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer426.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText426 = planComp426.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText426.name = "WARNING_NO_EDIT";
    warningText426.property("Transform").property("Position").setValue([1280, 200]);
    warningText426.guideLayer = true;
    
    var warningTextDoc426 = warningText426.property("Source Text").value;
    warningTextDoc426.fontSize = 32;
    warningTextDoc426.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc426.font = "Arial-BoldMT";
    warningTextDoc426.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText426.property("Source Text").setValue(warningTextDoc426);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText426 = planComp426.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00426");
    errorText426.name = "ERROR_NO_SOURCE";
    errorText426.property("Transform").property("Position").setValue([1280, 720]);
    errorText426.guideLayer = true;
    
    var errorTextDoc426 = errorText426.property("Source Text").value;
    errorTextDoc426.fontSize = 48;
    errorTextDoc426.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc426.font = "Arial-BoldMT";
    errorTextDoc426.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText426.property("Source Text").setValue(errorTextDoc426);
}

planCompositions[426] = planComp426;


// Composition pour plan 00427
var planComp427 = project.items.addComp(
    "SQ24_UNDLM_00427_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp427.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer427 = planComp427.layers.add(bgSolidComp);
bgLayer427.name = "BG_SOLID";
bgLayer427.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer427 = false;
if (gradingSources[427]) {
    var gradedLayer427 = planComp427.layers.add(gradingSources[427]);
    gradedLayer427.name = "UNDLM_00427_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer427.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer427.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer427 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer427 = false;
if (editSources[427]) {
    var editLayer427 = planComp427.layers.add(editSources[427]);
    editLayer427.name = "UNDLM_00427_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer427.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer427.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer427 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity427 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer427) {
    // EDIT toujours activé quand disponible
    editLayer427.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer427) {
        gradedLayer427.enabled = false;
    }
} else if (hasGradedLayer427) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer427.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText427 = planComp427.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText427.name = "WARNING_NO_EDIT";
    warningText427.property("Transform").property("Position").setValue([1280, 200]);
    warningText427.guideLayer = true;
    
    var warningTextDoc427 = warningText427.property("Source Text").value;
    warningTextDoc427.fontSize = 32;
    warningTextDoc427.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc427.font = "Arial-BoldMT";
    warningTextDoc427.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText427.property("Source Text").setValue(warningTextDoc427);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText427 = planComp427.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00427");
    errorText427.name = "ERROR_NO_SOURCE";
    errorText427.property("Transform").property("Position").setValue([1280, 720]);
    errorText427.guideLayer = true;
    
    var errorTextDoc427 = errorText427.property("Source Text").value;
    errorTextDoc427.fontSize = 48;
    errorTextDoc427.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc427.font = "Arial-BoldMT";
    errorTextDoc427.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText427.property("Source Text").setValue(errorTextDoc427);
}

planCompositions[427] = planComp427;


// Composition pour plan 00428
var planComp428 = project.items.addComp(
    "SQ24_UNDLM_00428_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    13.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp428.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer428 = planComp428.layers.add(bgSolidComp);
bgLayer428.name = "BG_SOLID";
bgLayer428.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer428 = false;
if (gradingSources[428]) {
    var gradedLayer428 = planComp428.layers.add(gradingSources[428]);
    gradedLayer428.name = "UNDLM_00428_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer428.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer428.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer428 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer428 = false;
if (editSources[428]) {
    var editLayer428 = planComp428.layers.add(editSources[428]);
    editLayer428.name = "UNDLM_00428_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer428.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer428.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer428 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity428 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer428) {
    // EDIT toujours activé quand disponible
    editLayer428.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer428) {
        gradedLayer428.enabled = false;
    }
} else if (hasGradedLayer428) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer428.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText428 = planComp428.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText428.name = "WARNING_NO_EDIT";
    warningText428.property("Transform").property("Position").setValue([1280, 200]);
    warningText428.guideLayer = true;
    
    var warningTextDoc428 = warningText428.property("Source Text").value;
    warningTextDoc428.fontSize = 32;
    warningTextDoc428.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc428.font = "Arial-BoldMT";
    warningTextDoc428.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText428.property("Source Text").setValue(warningTextDoc428);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText428 = planComp428.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00428");
    errorText428.name = "ERROR_NO_SOURCE";
    errorText428.property("Transform").property("Position").setValue([1280, 720]);
    errorText428.guideLayer = true;
    
    var errorTextDoc428 = errorText428.property("Source Text").value;
    errorTextDoc428.fontSize = 48;
    errorTextDoc428.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc428.font = "Arial-BoldMT";
    errorTextDoc428.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText428.property("Source Text").setValue(errorTextDoc428);
}

planCompositions[428] = planComp428;


// Composition pour plan 00429
var planComp429 = project.items.addComp(
    "SQ24_UNDLM_00429_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp429.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer429 = planComp429.layers.add(bgSolidComp);
bgLayer429.name = "BG_SOLID";
bgLayer429.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer429 = false;
if (gradingSources[429]) {
    var gradedLayer429 = planComp429.layers.add(gradingSources[429]);
    gradedLayer429.name = "UNDLM_00429_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer429.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer429.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer429 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer429 = false;
if (editSources[429]) {
    var editLayer429 = planComp429.layers.add(editSources[429]);
    editLayer429.name = "UNDLM_00429_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer429.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer429.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer429 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity429 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer429) {
    // EDIT toujours activé quand disponible
    editLayer429.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer429) {
        gradedLayer429.enabled = false;
    }
} else if (hasGradedLayer429) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer429.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText429 = planComp429.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText429.name = "WARNING_NO_EDIT";
    warningText429.property("Transform").property("Position").setValue([1280, 200]);
    warningText429.guideLayer = true;
    
    var warningTextDoc429 = warningText429.property("Source Text").value;
    warningTextDoc429.fontSize = 32;
    warningTextDoc429.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc429.font = "Arial-BoldMT";
    warningTextDoc429.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText429.property("Source Text").setValue(warningTextDoc429);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText429 = planComp429.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00429");
    errorText429.name = "ERROR_NO_SOURCE";
    errorText429.property("Transform").property("Position").setValue([1280, 720]);
    errorText429.guideLayer = true;
    
    var errorTextDoc429 = errorText429.property("Source Text").value;
    errorTextDoc429.fontSize = 48;
    errorTextDoc429.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc429.font = "Arial-BoldMT";
    errorTextDoc429.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText429.property("Source Text").setValue(errorTextDoc429);
}

planCompositions[429] = planComp429;


// Composition pour plan 00430
var planComp430 = project.items.addComp(
    "SQ24_UNDLM_00430_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp430.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer430 = planComp430.layers.add(bgSolidComp);
bgLayer430.name = "BG_SOLID";
bgLayer430.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer430 = false;
if (gradingSources[430]) {
    var gradedLayer430 = planComp430.layers.add(gradingSources[430]);
    gradedLayer430.name = "UNDLM_00430_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer430.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer430.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer430 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer430 = false;
if (editSources[430]) {
    var editLayer430 = planComp430.layers.add(editSources[430]);
    editLayer430.name = "UNDLM_00430_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer430.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer430.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer430 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity430 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer430) {
    // EDIT toujours activé quand disponible
    editLayer430.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer430) {
        gradedLayer430.enabled = false;
    }
} else if (hasGradedLayer430) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer430.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText430 = planComp430.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText430.name = "WARNING_NO_EDIT";
    warningText430.property("Transform").property("Position").setValue([1280, 200]);
    warningText430.guideLayer = true;
    
    var warningTextDoc430 = warningText430.property("Source Text").value;
    warningTextDoc430.fontSize = 32;
    warningTextDoc430.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc430.font = "Arial-BoldMT";
    warningTextDoc430.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText430.property("Source Text").setValue(warningTextDoc430);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText430 = planComp430.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00430");
    errorText430.name = "ERROR_NO_SOURCE";
    errorText430.property("Transform").property("Position").setValue([1280, 720]);
    errorText430.guideLayer = true;
    
    var errorTextDoc430 = errorText430.property("Source Text").value;
    errorTextDoc430.fontSize = 48;
    errorTextDoc430.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc430.font = "Arial-BoldMT";
    errorTextDoc430.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText430.property("Source Text").setValue(errorTextDoc430);
}

planCompositions[430] = planComp430;


// Composition pour plan 00431
var planComp431 = project.items.addComp(
    "SQ24_UNDLM_00431_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp431.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer431 = planComp431.layers.add(bgSolidComp);
bgLayer431.name = "BG_SOLID";
bgLayer431.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer431 = false;
if (gradingSources[431]) {
    var gradedLayer431 = planComp431.layers.add(gradingSources[431]);
    gradedLayer431.name = "UNDLM_00431_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer431.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer431.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer431 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer431 = false;
if (editSources[431]) {
    var editLayer431 = planComp431.layers.add(editSources[431]);
    editLayer431.name = "UNDLM_00431_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer431.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer431.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer431 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity431 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer431) {
    // EDIT toujours activé quand disponible
    editLayer431.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer431) {
        gradedLayer431.enabled = false;
    }
} else if (hasGradedLayer431) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer431.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText431 = planComp431.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText431.name = "WARNING_NO_EDIT";
    warningText431.property("Transform").property("Position").setValue([1280, 200]);
    warningText431.guideLayer = true;
    
    var warningTextDoc431 = warningText431.property("Source Text").value;
    warningTextDoc431.fontSize = 32;
    warningTextDoc431.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc431.font = "Arial-BoldMT";
    warningTextDoc431.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText431.property("Source Text").setValue(warningTextDoc431);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText431 = planComp431.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00431");
    errorText431.name = "ERROR_NO_SOURCE";
    errorText431.property("Transform").property("Position").setValue([1280, 720]);
    errorText431.guideLayer = true;
    
    var errorTextDoc431 = errorText431.property("Source Text").value;
    errorTextDoc431.fontSize = 48;
    errorTextDoc431.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc431.font = "Arial-BoldMT";
    errorTextDoc431.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText431.property("Source Text").setValue(errorTextDoc431);
}

planCompositions[431] = planComp431;


// Composition pour plan 00432
var planComp432 = project.items.addComp(
    "SQ24_UNDLM_00432_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp432.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer432 = planComp432.layers.add(bgSolidComp);
bgLayer432.name = "BG_SOLID";
bgLayer432.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer432 = false;
if (gradingSources[432]) {
    var gradedLayer432 = planComp432.layers.add(gradingSources[432]);
    gradedLayer432.name = "UNDLM_00432_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer432.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer432.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer432 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer432 = false;
if (editSources[432]) {
    var editLayer432 = planComp432.layers.add(editSources[432]);
    editLayer432.name = "UNDLM_00432_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer432.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer432.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer432 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity432 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer432) {
    // EDIT toujours activé quand disponible
    editLayer432.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer432) {
        gradedLayer432.enabled = false;
    }
} else if (hasGradedLayer432) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer432.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText432 = planComp432.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText432.name = "WARNING_NO_EDIT";
    warningText432.property("Transform").property("Position").setValue([1280, 200]);
    warningText432.guideLayer = true;
    
    var warningTextDoc432 = warningText432.property("Source Text").value;
    warningTextDoc432.fontSize = 32;
    warningTextDoc432.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc432.font = "Arial-BoldMT";
    warningTextDoc432.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText432.property("Source Text").setValue(warningTextDoc432);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText432 = planComp432.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00432");
    errorText432.name = "ERROR_NO_SOURCE";
    errorText432.property("Transform").property("Position").setValue([1280, 720]);
    errorText432.guideLayer = true;
    
    var errorTextDoc432 = errorText432.property("Source Text").value;
    errorTextDoc432.fontSize = 48;
    errorTextDoc432.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc432.font = "Arial-BoldMT";
    errorTextDoc432.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText432.property("Source Text").setValue(errorTextDoc432);
}

planCompositions[432] = planComp432;


// Composition pour plan 00433
var planComp433 = project.items.addComp(
    "SQ24_UNDLM_00433_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    11.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp433.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer433 = planComp433.layers.add(bgSolidComp);
bgLayer433.name = "BG_SOLID";
bgLayer433.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer433 = false;
if (gradingSources[433]) {
    var gradedLayer433 = planComp433.layers.add(gradingSources[433]);
    gradedLayer433.name = "UNDLM_00433_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer433.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer433.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer433 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer433 = false;
if (editSources[433]) {
    var editLayer433 = planComp433.layers.add(editSources[433]);
    editLayer433.name = "UNDLM_00433_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer433.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer433.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer433 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity433 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer433) {
    // EDIT toujours activé quand disponible
    editLayer433.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer433) {
        gradedLayer433.enabled = false;
    }
} else if (hasGradedLayer433) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer433.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText433 = planComp433.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText433.name = "WARNING_NO_EDIT";
    warningText433.property("Transform").property("Position").setValue([1280, 200]);
    warningText433.guideLayer = true;
    
    var warningTextDoc433 = warningText433.property("Source Text").value;
    warningTextDoc433.fontSize = 32;
    warningTextDoc433.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc433.font = "Arial-BoldMT";
    warningTextDoc433.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText433.property("Source Text").setValue(warningTextDoc433);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText433 = planComp433.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00433");
    errorText433.name = "ERROR_NO_SOURCE";
    errorText433.property("Transform").property("Position").setValue([1280, 720]);
    errorText433.guideLayer = true;
    
    var errorTextDoc433 = errorText433.property("Source Text").value;
    errorTextDoc433.fontSize = 48;
    errorTextDoc433.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc433.font = "Arial-BoldMT";
    errorTextDoc433.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText433.property("Source Text").setValue(errorTextDoc433);
}

planCompositions[433] = planComp433;


// Composition pour plan 00434
var planComp434 = project.items.addComp(
    "SQ24_UNDLM_00434_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.16,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp434.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer434 = planComp434.layers.add(bgSolidComp);
bgLayer434.name = "BG_SOLID";
bgLayer434.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer434 = false;
if (gradingSources[434]) {
    var gradedLayer434 = planComp434.layers.add(gradingSources[434]);
    gradedLayer434.name = "UNDLM_00434_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer434.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer434.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer434 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer434 = false;
if (editSources[434]) {
    var editLayer434 = planComp434.layers.add(editSources[434]);
    editLayer434.name = "UNDLM_00434_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer434.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer434.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer434 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity434 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer434) {
    // EDIT toujours activé quand disponible
    editLayer434.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer434) {
        gradedLayer434.enabled = false;
    }
} else if (hasGradedLayer434) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer434.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText434 = planComp434.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText434.name = "WARNING_NO_EDIT";
    warningText434.property("Transform").property("Position").setValue([1280, 200]);
    warningText434.guideLayer = true;
    
    var warningTextDoc434 = warningText434.property("Source Text").value;
    warningTextDoc434.fontSize = 32;
    warningTextDoc434.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc434.font = "Arial-BoldMT";
    warningTextDoc434.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText434.property("Source Text").setValue(warningTextDoc434);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText434 = planComp434.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00434");
    errorText434.name = "ERROR_NO_SOURCE";
    errorText434.property("Transform").property("Position").setValue([1280, 720]);
    errorText434.guideLayer = true;
    
    var errorTextDoc434 = errorText434.property("Source Text").value;
    errorTextDoc434.fontSize = 48;
    errorTextDoc434.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc434.font = "Arial-BoldMT";
    errorTextDoc434.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText434.property("Source Text").setValue(errorTextDoc434);
}

planCompositions[434] = planComp434;


// Composition pour plan 00435
var planComp435 = project.items.addComp(
    "SQ24_UNDLM_00435_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp435.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer435 = planComp435.layers.add(bgSolidComp);
bgLayer435.name = "BG_SOLID";
bgLayer435.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer435 = false;
if (gradingSources[435]) {
    var gradedLayer435 = planComp435.layers.add(gradingSources[435]);
    gradedLayer435.name = "UNDLM_00435_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer435.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer435.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer435 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer435 = false;
if (editSources[435]) {
    var editLayer435 = planComp435.layers.add(editSources[435]);
    editLayer435.name = "UNDLM_00435_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer435.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer435.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer435 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity435 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer435) {
    // EDIT toujours activé quand disponible
    editLayer435.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer435) {
        gradedLayer435.enabled = false;
    }
} else if (hasGradedLayer435) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer435.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText435 = planComp435.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText435.name = "WARNING_NO_EDIT";
    warningText435.property("Transform").property("Position").setValue([1280, 200]);
    warningText435.guideLayer = true;
    
    var warningTextDoc435 = warningText435.property("Source Text").value;
    warningTextDoc435.fontSize = 32;
    warningTextDoc435.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc435.font = "Arial-BoldMT";
    warningTextDoc435.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText435.property("Source Text").setValue(warningTextDoc435);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText435 = planComp435.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00435");
    errorText435.name = "ERROR_NO_SOURCE";
    errorText435.property("Transform").property("Position").setValue([1280, 720]);
    errorText435.guideLayer = true;
    
    var errorTextDoc435 = errorText435.property("Source Text").value;
    errorTextDoc435.fontSize = 48;
    errorTextDoc435.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc435.font = "Arial-BoldMT";
    errorTextDoc435.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText435.property("Source Text").setValue(errorTextDoc435);
}

planCompositions[435] = planComp435;


// Composition pour plan 00436
var planComp436 = project.items.addComp(
    "SQ24_UNDLM_00436_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp436.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer436 = planComp436.layers.add(bgSolidComp);
bgLayer436.name = "BG_SOLID";
bgLayer436.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer436 = false;
if (gradingSources[436]) {
    var gradedLayer436 = planComp436.layers.add(gradingSources[436]);
    gradedLayer436.name = "UNDLM_00436_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer436.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer436.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer436 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer436 = false;
if (editSources[436]) {
    var editLayer436 = planComp436.layers.add(editSources[436]);
    editLayer436.name = "UNDLM_00436_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer436.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer436.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer436 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity436 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer436) {
    // EDIT toujours activé quand disponible
    editLayer436.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer436) {
        gradedLayer436.enabled = false;
    }
} else if (hasGradedLayer436) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer436.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText436 = planComp436.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText436.name = "WARNING_NO_EDIT";
    warningText436.property("Transform").property("Position").setValue([1280, 200]);
    warningText436.guideLayer = true;
    
    var warningTextDoc436 = warningText436.property("Source Text").value;
    warningTextDoc436.fontSize = 32;
    warningTextDoc436.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc436.font = "Arial-BoldMT";
    warningTextDoc436.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText436.property("Source Text").setValue(warningTextDoc436);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText436 = planComp436.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00436");
    errorText436.name = "ERROR_NO_SOURCE";
    errorText436.property("Transform").property("Position").setValue([1280, 720]);
    errorText436.guideLayer = true;
    
    var errorTextDoc436 = errorText436.property("Source Text").value;
    errorTextDoc436.fontSize = 48;
    errorTextDoc436.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc436.font = "Arial-BoldMT";
    errorTextDoc436.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText436.property("Source Text").setValue(errorTextDoc436);
}

planCompositions[436] = planComp436;


// Composition pour plan 00437
var planComp437 = project.items.addComp(
    "SQ24_UNDLM_00437_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp437.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer437 = planComp437.layers.add(bgSolidComp);
bgLayer437.name = "BG_SOLID";
bgLayer437.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer437 = false;
if (gradingSources[437]) {
    var gradedLayer437 = planComp437.layers.add(gradingSources[437]);
    gradedLayer437.name = "UNDLM_00437_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer437.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer437.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer437 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer437 = false;
if (editSources[437]) {
    var editLayer437 = planComp437.layers.add(editSources[437]);
    editLayer437.name = "UNDLM_00437_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer437.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer437.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer437 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity437 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer437) {
    // EDIT toujours activé quand disponible
    editLayer437.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer437) {
        gradedLayer437.enabled = false;
    }
} else if (hasGradedLayer437) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer437.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText437 = planComp437.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText437.name = "WARNING_NO_EDIT";
    warningText437.property("Transform").property("Position").setValue([1280, 200]);
    warningText437.guideLayer = true;
    
    var warningTextDoc437 = warningText437.property("Source Text").value;
    warningTextDoc437.fontSize = 32;
    warningTextDoc437.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc437.font = "Arial-BoldMT";
    warningTextDoc437.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText437.property("Source Text").setValue(warningTextDoc437);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText437 = planComp437.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00437");
    errorText437.name = "ERROR_NO_SOURCE";
    errorText437.property("Transform").property("Position").setValue([1280, 720]);
    errorText437.guideLayer = true;
    
    var errorTextDoc437 = errorText437.property("Source Text").value;
    errorTextDoc437.fontSize = 48;
    errorTextDoc437.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc437.font = "Arial-BoldMT";
    errorTextDoc437.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText437.property("Source Text").setValue(errorTextDoc437);
}

planCompositions[437] = planComp437;


// Composition pour plan 00438
var planComp438 = project.items.addComp(
    "SQ24_UNDLM_00438_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp438.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer438 = planComp438.layers.add(bgSolidComp);
bgLayer438.name = "BG_SOLID";
bgLayer438.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer438 = false;
if (gradingSources[438]) {
    var gradedLayer438 = planComp438.layers.add(gradingSources[438]);
    gradedLayer438.name = "UNDLM_00438_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer438.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer438.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer438 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer438 = false;
if (editSources[438]) {
    var editLayer438 = planComp438.layers.add(editSources[438]);
    editLayer438.name = "UNDLM_00438_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer438.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer438.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer438 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity438 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer438) {
    // EDIT toujours activé quand disponible
    editLayer438.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer438) {
        gradedLayer438.enabled = false;
    }
} else if (hasGradedLayer438) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer438.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText438 = planComp438.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText438.name = "WARNING_NO_EDIT";
    warningText438.property("Transform").property("Position").setValue([1280, 200]);
    warningText438.guideLayer = true;
    
    var warningTextDoc438 = warningText438.property("Source Text").value;
    warningTextDoc438.fontSize = 32;
    warningTextDoc438.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc438.font = "Arial-BoldMT";
    warningTextDoc438.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText438.property("Source Text").setValue(warningTextDoc438);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText438 = planComp438.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00438");
    errorText438.name = "ERROR_NO_SOURCE";
    errorText438.property("Transform").property("Position").setValue([1280, 720]);
    errorText438.guideLayer = true;
    
    var errorTextDoc438 = errorText438.property("Source Text").value;
    errorTextDoc438.fontSize = 48;
    errorTextDoc438.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc438.font = "Arial-BoldMT";
    errorTextDoc438.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText438.property("Source Text").setValue(errorTextDoc438);
}

planCompositions[438] = planComp438;


// Composition pour plan 00439
var planComp439 = project.items.addComp(
    "SQ24_UNDLM_00439_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.24,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp439.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer439 = planComp439.layers.add(bgSolidComp);
bgLayer439.name = "BG_SOLID";
bgLayer439.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer439 = false;
if (gradingSources[439]) {
    var gradedLayer439 = planComp439.layers.add(gradingSources[439]);
    gradedLayer439.name = "UNDLM_00439_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer439.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer439.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer439 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer439 = false;
if (editSources[439]) {
    var editLayer439 = planComp439.layers.add(editSources[439]);
    editLayer439.name = "UNDLM_00439_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer439.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer439.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer439 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity439 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer439) {
    // EDIT toujours activé quand disponible
    editLayer439.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer439) {
        gradedLayer439.enabled = false;
    }
} else if (hasGradedLayer439) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer439.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText439 = planComp439.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText439.name = "WARNING_NO_EDIT";
    warningText439.property("Transform").property("Position").setValue([1280, 200]);
    warningText439.guideLayer = true;
    
    var warningTextDoc439 = warningText439.property("Source Text").value;
    warningTextDoc439.fontSize = 32;
    warningTextDoc439.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc439.font = "Arial-BoldMT";
    warningTextDoc439.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText439.property("Source Text").setValue(warningTextDoc439);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText439 = planComp439.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00439");
    errorText439.name = "ERROR_NO_SOURCE";
    errorText439.property("Transform").property("Position").setValue([1280, 720]);
    errorText439.guideLayer = true;
    
    var errorTextDoc439 = errorText439.property("Source Text").value;
    errorTextDoc439.fontSize = 48;
    errorTextDoc439.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc439.font = "Arial-BoldMT";
    errorTextDoc439.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText439.property("Source Text").setValue(errorTextDoc439);
}

planCompositions[439] = planComp439;


// Composition pour plan 00440
var planComp440 = project.items.addComp(
    "SQ24_UNDLM_00440_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp440.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer440 = planComp440.layers.add(bgSolidComp);
bgLayer440.name = "BG_SOLID";
bgLayer440.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer440 = false;
if (gradingSources[440]) {
    var gradedLayer440 = planComp440.layers.add(gradingSources[440]);
    gradedLayer440.name = "UNDLM_00440_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer440.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer440.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer440 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer440 = false;
if (editSources[440]) {
    var editLayer440 = planComp440.layers.add(editSources[440]);
    editLayer440.name = "UNDLM_00440_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer440.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer440.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer440 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity440 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer440) {
    // EDIT toujours activé quand disponible
    editLayer440.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer440) {
        gradedLayer440.enabled = false;
    }
} else if (hasGradedLayer440) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer440.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText440 = planComp440.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText440.name = "WARNING_NO_EDIT";
    warningText440.property("Transform").property("Position").setValue([1280, 200]);
    warningText440.guideLayer = true;
    
    var warningTextDoc440 = warningText440.property("Source Text").value;
    warningTextDoc440.fontSize = 32;
    warningTextDoc440.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc440.font = "Arial-BoldMT";
    warningTextDoc440.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText440.property("Source Text").setValue(warningTextDoc440);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText440 = planComp440.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00440");
    errorText440.name = "ERROR_NO_SOURCE";
    errorText440.property("Transform").property("Position").setValue([1280, 720]);
    errorText440.guideLayer = true;
    
    var errorTextDoc440 = errorText440.property("Source Text").value;
    errorTextDoc440.fontSize = 48;
    errorTextDoc440.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc440.font = "Arial-BoldMT";
    errorTextDoc440.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText440.property("Source Text").setValue(errorTextDoc440);
}

planCompositions[440] = planComp440;


// Composition pour plan 00441
var planComp441 = project.items.addComp(
    "SQ24_UNDLM_00441_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.04,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp441.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer441 = planComp441.layers.add(bgSolidComp);
bgLayer441.name = "BG_SOLID";
bgLayer441.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer441 = false;
if (gradingSources[441]) {
    var gradedLayer441 = planComp441.layers.add(gradingSources[441]);
    gradedLayer441.name = "UNDLM_00441_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer441.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer441.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer441 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer441 = false;
if (editSources[441]) {
    var editLayer441 = planComp441.layers.add(editSources[441]);
    editLayer441.name = "UNDLM_00441_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer441.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer441.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer441 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity441 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer441) {
    // EDIT toujours activé quand disponible
    editLayer441.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer441) {
        gradedLayer441.enabled = false;
    }
} else if (hasGradedLayer441) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer441.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText441 = planComp441.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText441.name = "WARNING_NO_EDIT";
    warningText441.property("Transform").property("Position").setValue([1280, 200]);
    warningText441.guideLayer = true;
    
    var warningTextDoc441 = warningText441.property("Source Text").value;
    warningTextDoc441.fontSize = 32;
    warningTextDoc441.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc441.font = "Arial-BoldMT";
    warningTextDoc441.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText441.property("Source Text").setValue(warningTextDoc441);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText441 = planComp441.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00441");
    errorText441.name = "ERROR_NO_SOURCE";
    errorText441.property("Transform").property("Position").setValue([1280, 720]);
    errorText441.guideLayer = true;
    
    var errorTextDoc441 = errorText441.property("Source Text").value;
    errorTextDoc441.fontSize = 48;
    errorTextDoc441.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc441.font = "Arial-BoldMT";
    errorTextDoc441.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText441.property("Source Text").setValue(errorTextDoc441);
}

planCompositions[441] = planComp441;


// Composition pour plan 00442
var planComp442 = project.items.addComp(
    "SQ24_UNDLM_00442_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.0,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp442.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer442 = planComp442.layers.add(bgSolidComp);
bgLayer442.name = "BG_SOLID";
bgLayer442.moveToEnd();

// 1. Ajouter layer GRADED en premier (sera en dessous)
var hasGradedLayer442 = false;
if (gradingSources[442]) {
    var gradedLayer442 = planComp442.layers.add(gradingSources[442]);
    gradedLayer442.name = "UNDLM_00442_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer442.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer442.property("Transform").property("Position").setValue([1280, 720]);
    
    hasGradedLayer442 = true;
}

// 2. Ajouter layer EDIT en second (sera au-dessus)
var hasEditLayer442 = false;
if (editSources[442]) {
    var editLayer442 = planComp442.layers.add(editSources[442]);
    editLayer442.name = "UNDLM_00442_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    editLayer442.property("Transform").property("Scale").setValue([66.67, 66.67]);
    editLayer442.property("Transform").property("Position").setValue([1280, 720]);
    
    hasEditLayer442 = true;
}

// 3. GESTION SPÉCIALE PLAN BIS : Créer continuité temporelle avec le plan principal
var hasContinuity442 = false;

// 4. Gestion de l'activation des layers
if (hasEditLayer442) {
    // EDIT toujours activé quand disponible
    editLayer442.enabled = true;
    
    // GRADED toujours désactivé quand EDIT est présent
    if (hasGradedLayer442) {
        gradedLayer442.enabled = false;
    }
} else if (hasGradedLayer442) {
    // Si pas d'EDIT mais GRADED disponible : activer GRADED + message
    gradedLayer442.enabled = true;
    
    // Ajouter un texte d'avertissement pour absence EDIT
    var warningText442 = planComp442.layers.addText("SOURCE EDIT MANQUANTE\nUtilisation GRADED uniquement");
    warningText442.name = "WARNING_NO_EDIT";
    warningText442.property("Transform").property("Position").setValue([1280, 200]);
    warningText442.guideLayer = true;
    
    var warningTextDoc442 = warningText442.property("Source Text").value;
    warningTextDoc442.fontSize = 32;
    warningTextDoc442.fillColor = [1.0, 0.8, 0.0]; // Orange
    warningTextDoc442.font = "Arial-BoldMT";
    warningTextDoc442.justification = ParagraphJustification.CENTER_JUSTIFY;
    warningText442.property("Source Text").setValue(warningTextDoc442);
} else {
    // Si on n'a ni EDIT ni GRADED : texte d'erreur rouge
    var errorText442 = planComp442.layers.addText("AUCUNE SOURCE DISPONIBLE\nUNDLM_00442");
    errorText442.name = "ERROR_NO_SOURCE";
    errorText442.property("Transform").property("Position").setValue([1280, 720]);
    errorText442.guideLayer = true;
    
    var errorTextDoc442 = errorText442.property("Source Text").value;
    errorTextDoc442.fontSize = 48;
    errorTextDoc442.fillColor = [1.0, 0.0, 0.0]; // Rouge
    errorTextDoc442.font = "Arial-BoldMT";
    errorTextDoc442.justification = ParagraphJustification.CENTER_JUSTIFY;
    errorText442.property("Source Text").setValue(errorTextDoc442);
}

planCompositions[442] = planComp442;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ24_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    114.55999999999999, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00425 à la timeline master
if (planCompositions[425]) {
    var masterLayer425 = masterComp.layers.add(planCompositions[425]);
    masterLayer425.startTime = 0;
    masterLayer425.name = "UNDLM_00425";
    masterLayer425.label = 1; // Couleurs alternées
}

// Ajouter plan 00426 à la timeline master
if (planCompositions[426]) {
    var masterLayer426 = masterComp.layers.add(planCompositions[426]);
    masterLayer426.startTime = 10.48;
    masterLayer426.name = "UNDLM_00426";
    masterLayer426.label = 2; // Couleurs alternées
}

// Ajouter plan 00427 à la timeline master
if (planCompositions[427]) {
    var masterLayer427 = masterComp.layers.add(planCompositions[427]);
    masterLayer427.startTime = 16.4;
    masterLayer427.name = "UNDLM_00427";
    masterLayer427.label = 3; // Couleurs alternées
}

// Ajouter plan 00428 à la timeline master
if (planCompositions[428]) {
    var masterLayer428 = masterComp.layers.add(planCompositions[428]);
    masterLayer428.startTime = 26.0;
    masterLayer428.name = "UNDLM_00428";
    masterLayer428.label = 4; // Couleurs alternées
}

// Ajouter plan 00429 à la timeline master
if (planCompositions[429]) {
    var masterLayer429 = masterComp.layers.add(planCompositions[429]);
    masterLayer429.startTime = 39.36;
    masterLayer429.name = "UNDLM_00429";
    masterLayer429.label = 5; // Couleurs alternées
}

// Ajouter plan 00430 à la timeline master
if (planCompositions[430]) {
    var masterLayer430 = masterComp.layers.add(planCompositions[430]);
    masterLayer430.startTime = 48.64;
    masterLayer430.name = "UNDLM_00430";
    masterLayer430.label = 6; // Couleurs alternées
}

// Ajouter plan 00431 à la timeline master
if (planCompositions[431]) {
    var masterLayer431 = masterComp.layers.add(planCompositions[431]);
    masterLayer431.startTime = 51.12;
    masterLayer431.name = "UNDLM_00431";
    masterLayer431.label = 7; // Couleurs alternées
}

// Ajouter plan 00432 à la timeline master
if (planCompositions[432]) {
    var masterLayer432 = masterComp.layers.add(planCompositions[432]);
    masterLayer432.startTime = 57.879999999999995;
    masterLayer432.name = "UNDLM_00432";
    masterLayer432.label = 8; // Couleurs alternées
}

// Ajouter plan 00433 à la timeline master
if (planCompositions[433]) {
    var masterLayer433 = masterComp.layers.add(planCompositions[433]);
    masterLayer433.startTime = 60.519999999999996;
    masterLayer433.name = "UNDLM_00433";
    masterLayer433.label = 9; // Couleurs alternées
}

// Ajouter plan 00434 à la timeline master
if (planCompositions[434]) {
    var masterLayer434 = masterComp.layers.add(planCompositions[434]);
    masterLayer434.startTime = 71.72;
    masterLayer434.name = "UNDLM_00434";
    masterLayer434.label = 10; // Couleurs alternées
}

// Ajouter plan 00435 à la timeline master
if (planCompositions[435]) {
    var masterLayer435 = masterComp.layers.add(planCompositions[435]);
    masterLayer435.startTime = 78.88;
    masterLayer435.name = "UNDLM_00435";
    masterLayer435.label = 11; // Couleurs alternées
}

// Ajouter plan 00436 à la timeline master
if (planCompositions[436]) {
    var masterLayer436 = masterComp.layers.add(planCompositions[436]);
    masterLayer436.startTime = 83.32;
    masterLayer436.name = "UNDLM_00436";
    masterLayer436.label = 12; // Couleurs alternées
}

// Ajouter plan 00437 à la timeline master
if (planCompositions[437]) {
    var masterLayer437 = masterComp.layers.add(planCompositions[437]);
    masterLayer437.startTime = 89.91999999999999;
    masterLayer437.name = "UNDLM_00437";
    masterLayer437.label = 13; // Couleurs alternées
}

// Ajouter plan 00438 à la timeline master
if (planCompositions[438]) {
    var masterLayer438 = masterComp.layers.add(planCompositions[438]);
    masterLayer438.startTime = 90.96;
    masterLayer438.name = "UNDLM_00438";
    masterLayer438.label = 14; // Couleurs alternées
}

// Ajouter plan 00439 à la timeline master
if (planCompositions[439]) {
    var masterLayer439 = masterComp.layers.add(planCompositions[439]);
    masterLayer439.startTime = 95.32;
    masterLayer439.name = "UNDLM_00439";
    masterLayer439.label = 15; // Couleurs alternées
}

// Ajouter plan 00440 à la timeline master
if (planCompositions[440]) {
    var masterLayer440 = masterComp.layers.add(planCompositions[440]);
    masterLayer440.startTime = 97.55999999999999;
    masterLayer440.name = "UNDLM_00440";
    masterLayer440.label = 16; // Couleurs alternées
}

// Ajouter plan 00441 à la timeline master
if (planCompositions[441]) {
    var masterLayer441 = masterComp.layers.add(planCompositions[441]);
    masterLayer441.startTime = 101.51999999999998;
    masterLayer441.name = "UNDLM_00441";
    masterLayer441.label = 1; // Couleurs alternées
}

// Ajouter plan 00442 à la timeline master
if (planCompositions[442]) {
    var masterLayer442 = masterComp.layers.add(planCompositions[442]);
    masterLayer442.startTime = 108.55999999999999;
    masterLayer442.name = "UNDLM_00442";
    masterLayer442.label = 2; // Couleurs alternées
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
var seqExpression = 'var seqName = "SQ24";\n' +
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
    {start: 0, end: 10.48, name: "UNDLM_00425"},
    {start: 10.48, end: 16.4, name: "UNDLM_00426"},
    {start: 16.4, end: 26.0, name: "UNDLM_00427"},
    {start: 26.0, end: 39.36, name: "UNDLM_00428"},
    {start: 39.36, end: 48.64, name: "UNDLM_00429"},
    {start: 48.64, end: 51.12, name: "UNDLM_00430"},
    {start: 51.12, end: 57.879999999999995, name: "UNDLM_00431"},
    {start: 57.879999999999995, end: 60.519999999999996, name: "UNDLM_00432"},
    {start: 60.519999999999996, end: 71.72, name: "UNDLM_00433"},
    {start: 71.72, end: 78.88, name: "UNDLM_00434"},
    {start: 78.88, end: 83.32, name: "UNDLM_00435"},
    {start: 83.32, end: 89.91999999999999, name: "UNDLM_00436"},
    {start: 89.91999999999999, end: 90.96, name: "UNDLM_00437"},
    {start: 90.96, end: 95.32, name: "UNDLM_00438"},
    {start: 95.32, end: 97.55999999999999, name: "UNDLM_00439"},
    {start: 97.55999999999999, end: 101.51999999999998, name: "UNDLM_00440"},
    {start: 101.51999999999998, end: 108.55999999999999, name: "UNDLM_00441"},
    {start: 108.55999999999999, end: 114.55999999999999, name: "UNDLM_00442"},
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
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ24/_AE/SQ24_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 18;
var totalCount = 18;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ24 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(114.55999999999999 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ24_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
alert("AE_GENERATION_V2_SUCCESS:SQ24:" + totalCount + ":" + gradedCount);
