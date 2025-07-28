
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2 - Version Simple
// Séquence SQ01 avec 34 plans
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


// Import plan EDIT 00001
var editFile1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00001.mov");
if (editFile1.exists) {
    var editFootage1 = project.importFile(new ImportOptions(editFile1));
    editFootage1.parentFolder = fromEditFolder;
    editFootage1.name = "UNDLM_00001";
    editSources[1] = editFootage1;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00001.mov");
}

// Import plan EDIT 00002
var editFile2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00002.mov");
if (editFile2.exists) {
    var editFootage2 = project.importFile(new ImportOptions(editFile2));
    editFootage2.parentFolder = fromEditFolder;
    editFootage2.name = "UNDLM_00002";
    editSources[2] = editFootage2;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00002.mov");
}

// Import plan EDIT 00003
var editFile3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00003.mov");
if (editFile3.exists) {
    var editFootage3 = project.importFile(new ImportOptions(editFile3));
    editFootage3.parentFolder = fromEditFolder;
    editFootage3.name = "UNDLM_00003";
    editSources[3] = editFootage3;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00003.mov");
}

// Import plan EDIT 00004
var editFile4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00004.mov");
if (editFile4.exists) {
    var editFootage4 = project.importFile(new ImportOptions(editFile4));
    editFootage4.parentFolder = fromEditFolder;
    editFootage4.name = "UNDLM_00004";
    editSources[4] = editFootage4;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00004.mov");
}

// Import plan EDIT 00005
var editFile5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00005.mov");
if (editFile5.exists) {
    var editFootage5 = project.importFile(new ImportOptions(editFile5));
    editFootage5.parentFolder = fromEditFolder;
    editFootage5.name = "UNDLM_00005";
    editSources[5] = editFootage5;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00005.mov");
}

// Import plan EDIT 00006
var editFile6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00006.mov");
if (editFile6.exists) {
    var editFootage6 = project.importFile(new ImportOptions(editFile6));
    editFootage6.parentFolder = fromEditFolder;
    editFootage6.name = "UNDLM_00006";
    editSources[6] = editFootage6;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00006.mov");
}

// Import plan EDIT 00007
var editFile7 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00007.mov");
if (editFile7.exists) {
    var editFootage7 = project.importFile(new ImportOptions(editFile7));
    editFootage7.parentFolder = fromEditFolder;
    editFootage7.name = "UNDLM_00007";
    editSources[7] = editFootage7;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00007.mov");
}

// Import plan EDIT 00008
var editFile8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00008.mov");
if (editFile8.exists) {
    var editFootage8 = project.importFile(new ImportOptions(editFile8));
    editFootage8.parentFolder = fromEditFolder;
    editFootage8.name = "UNDLM_00008";
    editSources[8] = editFootage8;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00008.mov");
}

// Import plan EDIT 00009
var editFile9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00009.mov");
if (editFile9.exists) {
    var editFootage9 = project.importFile(new ImportOptions(editFile9));
    editFootage9.parentFolder = fromEditFolder;
    editFootage9.name = "UNDLM_00009";
    editSources[9] = editFootage9;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00009.mov");
}

// Import plan EDIT 00010
var editFile10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00010.mov");
if (editFile10.exists) {
    var editFootage10 = project.importFile(new ImportOptions(editFile10));
    editFootage10.parentFolder = fromEditFolder;
    editFootage10.name = "UNDLM_00010";
    editSources[10] = editFootage10;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00010.mov");
}

// Import plan EDIT 00011
var editFile11 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00011.mov");
if (editFile11.exists) {
    var editFootage11 = project.importFile(new ImportOptions(editFile11));
    editFootage11.parentFolder = fromEditFolder;
    editFootage11.name = "UNDLM_00011";
    editSources[11] = editFootage11;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00011.mov");
}

// Import plan EDIT 00012
var editFile12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00012.mov");
if (editFile12.exists) {
    var editFootage12 = project.importFile(new ImportOptions(editFile12));
    editFootage12.parentFolder = fromEditFolder;
    editFootage12.name = "UNDLM_00012";
    editSources[12] = editFootage12;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00012.mov");
}

// Import plan EDIT 00013
var editFile13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00013.mov");
if (editFile13.exists) {
    var editFootage13 = project.importFile(new ImportOptions(editFile13));
    editFootage13.parentFolder = fromEditFolder;
    editFootage13.name = "UNDLM_00013";
    editSources[13] = editFootage13;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00013.mov");
}

// Import plan EDIT 00014
var editFile14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00014.mov");
if (editFile14.exists) {
    var editFootage14 = project.importFile(new ImportOptions(editFile14));
    editFootage14.parentFolder = fromEditFolder;
    editFootage14.name = "UNDLM_00014";
    editSources[14] = editFootage14;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00014.mov");
}

// Import plan EDIT 00015
var editFile15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00015.mov");
if (editFile15.exists) {
    var editFootage15 = project.importFile(new ImportOptions(editFile15));
    editFootage15.parentFolder = fromEditFolder;
    editFootage15.name = "UNDLM_00015";
    editSources[15] = editFootage15;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00015.mov");
}

// Import plan EDIT 00016
var editFile16 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00016.mov");
if (editFile16.exists) {
    var editFootage16 = project.importFile(new ImportOptions(editFile16));
    editFootage16.parentFolder = fromEditFolder;
    editFootage16.name = "UNDLM_00016";
    editSources[16] = editFootage16;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00016.mov");
}

// Import plan EDIT 00017
var editFile17 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00017.mov");
if (editFile17.exists) {
    var editFootage17 = project.importFile(new ImportOptions(editFile17));
    editFootage17.parentFolder = fromEditFolder;
    editFootage17.name = "UNDLM_00017";
    editSources[17] = editFootage17;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00017.mov");
}

// Import plan EDIT 00018
var editFile18 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00018.mov");
if (editFile18.exists) {
    var editFootage18 = project.importFile(new ImportOptions(editFile18));
    editFootage18.parentFolder = fromEditFolder;
    editFootage18.name = "UNDLM_00018";
    editSources[18] = editFootage18;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00018.mov");
}

// Import plan EDIT 00019
var editFile19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00019.mov");
if (editFile19.exists) {
    var editFootage19 = project.importFile(new ImportOptions(editFile19));
    editFootage19.parentFolder = fromEditFolder;
    editFootage19.name = "UNDLM_00019";
    editSources[19] = editFootage19;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00019.mov");
}

// Import plan EDIT 00020
var editFile20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00020.mov");
if (editFile20.exists) {
    var editFootage20 = project.importFile(new ImportOptions(editFile20));
    editFootage20.parentFolder = fromEditFolder;
    editFootage20.name = "UNDLM_00020";
    editSources[20] = editFootage20;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00020.mov");
}

// Import plan EDIT 00021
var editFile21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00021.mov");
if (editFile21.exists) {
    var editFootage21 = project.importFile(new ImportOptions(editFile21));
    editFootage21.parentFolder = fromEditFolder;
    editFootage21.name = "UNDLM_00021";
    editSources[21] = editFootage21;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00021.mov");
}

// Import plan EDIT 00022
var editFile22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00022.mov");
if (editFile22.exists) {
    var editFootage22 = project.importFile(new ImportOptions(editFile22));
    editFootage22.parentFolder = fromEditFolder;
    editFootage22.name = "UNDLM_00022";
    editSources[22] = editFootage22;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00022.mov");
}

// Import plan EDIT 00023
var editFile23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00023.mov");
if (editFile23.exists) {
    var editFootage23 = project.importFile(new ImportOptions(editFile23));
    editFootage23.parentFolder = fromEditFolder;
    editFootage23.name = "UNDLM_00023";
    editSources[23] = editFootage23;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00023.mov");
}

// Import plan EDIT 00024
var editFile24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00024.mov");
if (editFile24.exists) {
    var editFootage24 = project.importFile(new ImportOptions(editFile24));
    editFootage24.parentFolder = fromEditFolder;
    editFootage24.name = "UNDLM_00024";
    editSources[24] = editFootage24;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00024.mov");
}

// Import plan EDIT 00025
var editFile25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00025.mov");
if (editFile25.exists) {
    var editFootage25 = project.importFile(new ImportOptions(editFile25));
    editFootage25.parentFolder = fromEditFolder;
    editFootage25.name = "UNDLM_00025";
    editSources[25] = editFootage25;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00025.mov");
}

// Import plan EDIT 00026
var editFile26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00026.mov");
if (editFile26.exists) {
    var editFootage26 = project.importFile(new ImportOptions(editFile26));
    editFootage26.parentFolder = fromEditFolder;
    editFootage26.name = "UNDLM_00026";
    editSources[26] = editFootage26;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00026.mov");
}

// Import plan EDIT 00027
var editFile27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00027.mov");
if (editFile27.exists) {
    var editFootage27 = project.importFile(new ImportOptions(editFile27));
    editFootage27.parentFolder = fromEditFolder;
    editFootage27.name = "UNDLM_00027";
    editSources[27] = editFootage27;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00027.mov");
}

// Import plan EDIT 00028
var editFile28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00028.mov");
if (editFile28.exists) {
    var editFootage28 = project.importFile(new ImportOptions(editFile28));
    editFootage28.parentFolder = fromEditFolder;
    editFootage28.name = "UNDLM_00028";
    editSources[28] = editFootage28;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00028.mov");
}

// Import plan EDIT 00029
var editFile29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00029.mov");
if (editFile29.exists) {
    var editFootage29 = project.importFile(new ImportOptions(editFile29));
    editFootage29.parentFolder = fromEditFolder;
    editFootage29.name = "UNDLM_00029";
    editSources[29] = editFootage29;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00029.mov");
}

// Import plan EDIT 00030
var editFile30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00030.mov");
if (editFile30.exists) {
    var editFootage30 = project.importFile(new ImportOptions(editFile30));
    editFootage30.parentFolder = fromEditFolder;
    editFootage30.name = "UNDLM_00030";
    editSources[30] = editFootage30;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00030.mov");
}

// Import plan EDIT 00031
var editFile31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00031.mov");
if (editFile31.exists) {
    var editFootage31 = project.importFile(new ImportOptions(editFile31));
    editFootage31.parentFolder = fromEditFolder;
    editFootage31.name = "UNDLM_00031";
    editSources[31] = editFootage31;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00031.mov");
}

// Import plan EDIT 00032
var editFile32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00032.mov");
if (editFile32.exists) {
    var editFootage32 = project.importFile(new ImportOptions(editFile32));
    editFootage32.parentFolder = fromEditFolder;
    editFootage32.name = "UNDLM_00032";
    editSources[32] = editFootage32;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00032.mov");
}

// Import plan EDIT 00033
var editFile33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00033.mov");
if (editFile33.exists) {
    var editFootage33 = project.importFile(new ImportOptions(editFile33));
    editFootage33.parentFolder = fromEditFolder;
    editFootage33.name = "UNDLM_00033";
    editSources[33] = editFootage33;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00033.mov");
}

// Import plan EDIT 00034
var editFile34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS/UNDLM_00034.mov");
if (editFile34.exists) {
    var editFootage34 = project.importFile(new ImportOptions(editFile34));
    editFootage34.parentFolder = fromEditFolder;
    editFootage34.name = "UNDLM_00034";
    editSources[34] = editFootage34;
} else {
    alert("ERREUR: Plan EDIT manquant - UNDLM_00034.mov");
}

// Import plan GRADED 00001
var gradedFile1 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00001.mov");
if (gradedFile1.exists) {
    var gradedFootage1 = project.importFile(new ImportOptions(gradedFile1));
    gradedFootage1.parentFolder = fromGradingFolder;
    gradedFootage1.name = "UNDLM_00001";
    gradingSources[1] = gradedFootage1;
}

// Import plan GRADED 00002
var gradedFile2 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00002.mov");
if (gradedFile2.exists) {
    var gradedFootage2 = project.importFile(new ImportOptions(gradedFile2));
    gradedFootage2.parentFolder = fromGradingFolder;
    gradedFootage2.name = "UNDLM_00002";
    gradingSources[2] = gradedFootage2;
}

// Import plan GRADED 00003
var gradedFile3 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00003.mov");
if (gradedFile3.exists) {
    var gradedFootage3 = project.importFile(new ImportOptions(gradedFile3));
    gradedFootage3.parentFolder = fromGradingFolder;
    gradedFootage3.name = "UNDLM_00003";
    gradingSources[3] = gradedFootage3;
}

// Import plan GRADED 00004
var gradedFile4 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00004.mov");
if (gradedFile4.exists) {
    var gradedFootage4 = project.importFile(new ImportOptions(gradedFile4));
    gradedFootage4.parentFolder = fromGradingFolder;
    gradedFootage4.name = "UNDLM_00004";
    gradingSources[4] = gradedFootage4;
}

// Import plan GRADED 00005
var gradedFile5 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00005.mov");
if (gradedFile5.exists) {
    var gradedFootage5 = project.importFile(new ImportOptions(gradedFile5));
    gradedFootage5.parentFolder = fromGradingFolder;
    gradedFootage5.name = "UNDLM_00005";
    gradingSources[5] = gradedFootage5;
}

// Import plan GRADED 00006
var gradedFile6 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00006.mov");
if (gradedFile6.exists) {
    var gradedFootage6 = project.importFile(new ImportOptions(gradedFile6));
    gradedFootage6.parentFolder = fromGradingFolder;
    gradedFootage6.name = "UNDLM_00006";
    gradingSources[6] = gradedFootage6;
}

// Import plan GRADED 00008
var gradedFile8 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00008.mov");
if (gradedFile8.exists) {
    var gradedFootage8 = project.importFile(new ImportOptions(gradedFile8));
    gradedFootage8.parentFolder = fromGradingFolder;
    gradedFootage8.name = "UNDLM_00008";
    gradingSources[8] = gradedFootage8;
}

// Import plan GRADED 00009
var gradedFile9 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00009.mov");
if (gradedFile9.exists) {
    var gradedFootage9 = project.importFile(new ImportOptions(gradedFile9));
    gradedFootage9.parentFolder = fromGradingFolder;
    gradedFootage9.name = "UNDLM_00009";
    gradingSources[9] = gradedFootage9;
}

// Import plan GRADED 00010
var gradedFile10 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00010.mov");
if (gradedFile10.exists) {
    var gradedFootage10 = project.importFile(new ImportOptions(gradedFile10));
    gradedFootage10.parentFolder = fromGradingFolder;
    gradedFootage10.name = "UNDLM_00010";
    gradingSources[10] = gradedFootage10;
}

// Import plan GRADED 00012
var gradedFile12 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00012.mov");
if (gradedFile12.exists) {
    var gradedFootage12 = project.importFile(new ImportOptions(gradedFile12));
    gradedFootage12.parentFolder = fromGradingFolder;
    gradedFootage12.name = "UNDLM_00012";
    gradingSources[12] = gradedFootage12;
}

// Import plan GRADED 00013
var gradedFile13 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00013.mov");
if (gradedFile13.exists) {
    var gradedFootage13 = project.importFile(new ImportOptions(gradedFile13));
    gradedFootage13.parentFolder = fromGradingFolder;
    gradedFootage13.name = "UNDLM_00013";
    gradingSources[13] = gradedFootage13;
}

// Import plan GRADED 00014
var gradedFile14 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00014.mov");
if (gradedFile14.exists) {
    var gradedFootage14 = project.importFile(new ImportOptions(gradedFile14));
    gradedFootage14.parentFolder = fromGradingFolder;
    gradedFootage14.name = "UNDLM_00014";
    gradingSources[14] = gradedFootage14;
}

// Import plan GRADED 00015
var gradedFile15 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00015.mov");
if (gradedFile15.exists) {
    var gradedFootage15 = project.importFile(new ImportOptions(gradedFile15));
    gradedFootage15.parentFolder = fromGradingFolder;
    gradedFootage15.name = "UNDLM_00015";
    gradingSources[15] = gradedFootage15;
}

// Import plan GRADED 00019
var gradedFile19 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00019.mov");
if (gradedFile19.exists) {
    var gradedFootage19 = project.importFile(new ImportOptions(gradedFile19));
    gradedFootage19.parentFolder = fromGradingFolder;
    gradedFootage19.name = "UNDLM_00019";
    gradingSources[19] = gradedFootage19;
}

// Import plan GRADED 00020
var gradedFile20 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00020.mov");
if (gradedFile20.exists) {
    var gradedFootage20 = project.importFile(new ImportOptions(gradedFile20));
    gradedFootage20.parentFolder = fromGradingFolder;
    gradedFootage20.name = "UNDLM_00020";
    gradingSources[20] = gradedFootage20;
}

// Import plan GRADED 00021
var gradedFile21 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00021.mov");
if (gradedFile21.exists) {
    var gradedFootage21 = project.importFile(new ImportOptions(gradedFile21));
    gradedFootage21.parentFolder = fromGradingFolder;
    gradedFootage21.name = "UNDLM_00021";
    gradingSources[21] = gradedFootage21;
}

// Import plan GRADED 00022
var gradedFile22 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00022.mov");
if (gradedFile22.exists) {
    var gradedFootage22 = project.importFile(new ImportOptions(gradedFile22));
    gradedFootage22.parentFolder = fromGradingFolder;
    gradedFootage22.name = "UNDLM_00022";
    gradingSources[22] = gradedFootage22;
}

// Import plan GRADED 00023
var gradedFile23 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00023.mov");
if (gradedFile23.exists) {
    var gradedFootage23 = project.importFile(new ImportOptions(gradedFile23));
    gradedFootage23.parentFolder = fromGradingFolder;
    gradedFootage23.name = "UNDLM_00023";
    gradingSources[23] = gradedFootage23;
}

// Import plan GRADED 00024
var gradedFile24 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00024.mov");
if (gradedFile24.exists) {
    var gradedFootage24 = project.importFile(new ImportOptions(gradedFile24));
    gradedFootage24.parentFolder = fromGradingFolder;
    gradedFootage24.name = "UNDLM_00024";
    gradingSources[24] = gradedFootage24;
}

// Import plan GRADED 00025
var gradedFile25 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00025.mov");
if (gradedFile25.exists) {
    var gradedFootage25 = project.importFile(new ImportOptions(gradedFile25));
    gradedFootage25.parentFolder = fromGradingFolder;
    gradedFootage25.name = "UNDLM_00025";
    gradingSources[25] = gradedFootage25;
}

// Import plan GRADED 00026
var gradedFile26 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00026.mov");
if (gradedFile26.exists) {
    var gradedFootage26 = project.importFile(new ImportOptions(gradedFile26));
    gradedFootage26.parentFolder = fromGradingFolder;
    gradedFootage26.name = "UNDLM_00026";
    gradingSources[26] = gradedFootage26;
}

// Import plan GRADED 00027
var gradedFile27 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00027.mov");
if (gradedFile27.exists) {
    var gradedFootage27 = project.importFile(new ImportOptions(gradedFile27));
    gradedFootage27.parentFolder = fromGradingFolder;
    gradedFootage27.name = "UNDLM_00027";
    gradingSources[27] = gradedFootage27;
}

// Import plan GRADED 00028
var gradedFile28 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00028.mov");
if (gradedFile28.exists) {
    var gradedFootage28 = project.importFile(new ImportOptions(gradedFile28));
    gradedFootage28.parentFolder = fromGradingFolder;
    gradedFootage28.name = "UNDLM_00028";
    gradingSources[28] = gradedFootage28;
}

// Import plan GRADED 00029
var gradedFile29 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00029.mov");
if (gradedFile29.exists) {
    var gradedFootage29 = project.importFile(new ImportOptions(gradedFile29));
    gradedFootage29.parentFolder = fromGradingFolder;
    gradedFootage29.name = "UNDLM_00029";
    gradingSources[29] = gradedFootage29;
}

// Import plan GRADED 00030
var gradedFile30 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00030.mov");
if (gradedFile30.exists) {
    var gradedFootage30 = project.importFile(new ImportOptions(gradedFile30));
    gradedFootage30.parentFolder = fromGradingFolder;
    gradedFootage30.name = "UNDLM_00030";
    gradingSources[30] = gradedFootage30;
}

// Import plan GRADED 00031
var gradedFile31 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00031.mov");
if (gradedFile31.exists) {
    var gradedFootage31 = project.importFile(new ImportOptions(gradedFile31));
    gradedFootage31.parentFolder = fromGradingFolder;
    gradedFootage31.name = "UNDLM_00031";
    gradingSources[31] = gradedFootage31;
}

// Import plan GRADED 00032
var gradedFile32 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00032.mov");
if (gradedFile32.exists) {
    var gradedFootage32 = project.importFile(new ImportOptions(gradedFile32));
    gradedFootage32.parentFolder = fromGradingFolder;
    gradedFootage32.name = "UNDLM_00032";
    gradingSources[32] = gradedFootage32;
}

// Import plan GRADED 00033
var gradedFile33 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00033.mov");
if (gradedFile33.exists) {
    var gradedFootage33 = project.importFile(new ImportOptions(gradedFile33));
    gradedFootage33.parentFolder = fromGradingFolder;
    gradedFootage33.name = "UNDLM_00033";
    gradingSources[33] = gradedFootage33;
}

// Import plan GRADED 00034
var gradedFile34 = new File("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS/UNDLM_00034.mov");
if (gradedFile34.exists) {
    var gradedFootage34 = project.importFile(new ImportOptions(gradedFile34));
    gradedFootage34.parentFolder = fromGradingFolder;
    gradedFootage34.name = "UNDLM_00034";
    gradingSources[34] = gradedFootage34;
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


// Composition pour plan 00001
var planComp1 = project.items.addComp(
    "SQ01_UNDLM_00001_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp1.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer1 = planComp1.layers.add(bgSolidComp);
bgLayer1.name = "BG_SOLID";
bgLayer1.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[1]) {
    var editLayer1 = planComp1.layers.add(editSources[1]);
    editLayer1.name = "UNDLM_00001_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer1.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer1.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[1]) {
    var gradedLayer1 = planComp1.layers.add(gradingSources[1]);
    gradedLayer1.name = "UNDLM_00001_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer1.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer1.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer1.enabled = false;
}

planCompositions[1] = planComp1;


// Composition pour plan 00002
var planComp2 = project.items.addComp(
    "SQ01_UNDLM_00002_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp2.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer2 = planComp2.layers.add(bgSolidComp);
bgLayer2.name = "BG_SOLID";
bgLayer2.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[2]) {
    var editLayer2 = planComp2.layers.add(editSources[2]);
    editLayer2.name = "UNDLM_00002_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer2.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer2.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[2]) {
    var gradedLayer2 = planComp2.layers.add(gradingSources[2]);
    gradedLayer2.name = "UNDLM_00002_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer2.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer2.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer2.enabled = false;
}

planCompositions[2] = planComp2;


// Composition pour plan 00003
var planComp3 = project.items.addComp(
    "SQ01_UNDLM_00003_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp3.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer3 = planComp3.layers.add(bgSolidComp);
bgLayer3.name = "BG_SOLID";
bgLayer3.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[3]) {
    var editLayer3 = planComp3.layers.add(editSources[3]);
    editLayer3.name = "UNDLM_00003_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer3.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer3.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[3]) {
    var gradedLayer3 = planComp3.layers.add(gradingSources[3]);
    gradedLayer3.name = "UNDLM_00003_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer3.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer3.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer3.enabled = false;
}

planCompositions[3] = planComp3;


// Composition pour plan 00004
var planComp4 = project.items.addComp(
    "SQ01_UNDLM_00004_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.08,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp4.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer4 = planComp4.layers.add(bgSolidComp);
bgLayer4.name = "BG_SOLID";
bgLayer4.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[4]) {
    var editLayer4 = planComp4.layers.add(editSources[4]);
    editLayer4.name = "UNDLM_00004_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer4.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer4.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[4]) {
    var gradedLayer4 = planComp4.layers.add(gradingSources[4]);
    gradedLayer4.name = "UNDLM_00004_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer4.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer4.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer4.enabled = false;
}

planCompositions[4] = planComp4;


// Composition pour plan 00005
var planComp5 = project.items.addComp(
    "SQ01_UNDLM_00005_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp5.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer5 = planComp5.layers.add(bgSolidComp);
bgLayer5.name = "BG_SOLID";
bgLayer5.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[5]) {
    var editLayer5 = planComp5.layers.add(editSources[5]);
    editLayer5.name = "UNDLM_00005_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer5.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer5.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[5]) {
    var gradedLayer5 = planComp5.layers.add(gradingSources[5]);
    gradedLayer5.name = "UNDLM_00005_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer5.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer5.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer5.enabled = false;
}

planCompositions[5] = planComp5;


// Composition pour plan 00006
var planComp6 = project.items.addComp(
    "SQ01_UNDLM_00006_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp6.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer6 = planComp6.layers.add(bgSolidComp);
bgLayer6.name = "BG_SOLID";
bgLayer6.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[6]) {
    var editLayer6 = planComp6.layers.add(editSources[6]);
    editLayer6.name = "UNDLM_00006_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer6.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer6.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[6]) {
    var gradedLayer6 = planComp6.layers.add(gradingSources[6]);
    gradedLayer6.name = "UNDLM_00006_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer6.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer6.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer6.enabled = false;
}

planCompositions[6] = planComp6;


// Composition pour plan 00007
var planComp7 = project.items.addComp(
    "SQ01_UNDLM_00007_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    1.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp7.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer7 = planComp7.layers.add(bgSolidComp);
bgLayer7.name = "BG_SOLID";
bgLayer7.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[7]) {
    var editLayer7 = planComp7.layers.add(editSources[7]);
    editLayer7.name = "UNDLM_00007_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer7.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer7.property("Transform").property("Position").setValue([1280, 720]);
}

planCompositions[7] = planComp7;


// Composition pour plan 00008
var planComp8 = project.items.addComp(
    "SQ01_UNDLM_00008_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    0.68,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp8.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer8 = planComp8.layers.add(bgSolidComp);
bgLayer8.name = "BG_SOLID";
bgLayer8.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[8]) {
    var editLayer8 = planComp8.layers.add(editSources[8]);
    editLayer8.name = "UNDLM_00008_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer8.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer8.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[8]) {
    var gradedLayer8 = planComp8.layers.add(gradingSources[8]);
    gradedLayer8.name = "UNDLM_00008_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer8.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer8.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer8.enabled = false;
}

planCompositions[8] = planComp8;


// Composition pour plan 00009
var planComp9 = project.items.addComp(
    "SQ01_UNDLM_00009_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp9.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer9 = planComp9.layers.add(bgSolidComp);
bgLayer9.name = "BG_SOLID";
bgLayer9.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[9]) {
    var editLayer9 = planComp9.layers.add(editSources[9]);
    editLayer9.name = "UNDLM_00009_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer9.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer9.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[9]) {
    var gradedLayer9 = planComp9.layers.add(gradingSources[9]);
    gradedLayer9.name = "UNDLM_00009_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer9.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer9.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer9.enabled = false;
}

planCompositions[9] = planComp9;


// Composition pour plan 00010
var planComp10 = project.items.addComp(
    "SQ01_UNDLM_00010_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp10.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer10 = planComp10.layers.add(bgSolidComp);
bgLayer10.name = "BG_SOLID";
bgLayer10.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[10]) {
    var editLayer10 = planComp10.layers.add(editSources[10]);
    editLayer10.name = "UNDLM_00010_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer10.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer10.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[10]) {
    var gradedLayer10 = planComp10.layers.add(gradingSources[10]);
    gradedLayer10.name = "UNDLM_00010_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer10.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer10.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer10.enabled = false;
}

planCompositions[10] = planComp10;


// Composition pour plan 00011
var planComp11 = project.items.addComp(
    "SQ01_UNDLM_00011_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.76,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp11.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer11 = planComp11.layers.add(bgSolidComp);
bgLayer11.name = "BG_SOLID";
bgLayer11.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[11]) {
    var editLayer11 = planComp11.layers.add(editSources[11]);
    editLayer11.name = "UNDLM_00011_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer11.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer11.property("Transform").property("Position").setValue([1280, 720]);
}

planCompositions[11] = planComp11;


// Composition pour plan 00012
var planComp12 = project.items.addComp(
    "SQ01_UNDLM_00012_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.7199999999999998,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp12.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer12 = planComp12.layers.add(bgSolidComp);
bgLayer12.name = "BG_SOLID";
bgLayer12.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[12]) {
    var editLayer12 = planComp12.layers.add(editSources[12]);
    editLayer12.name = "UNDLM_00012_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer12.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer12.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[12]) {
    var gradedLayer12 = planComp12.layers.add(gradingSources[12]);
    gradedLayer12.name = "UNDLM_00012_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer12.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer12.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer12.enabled = false;
}

planCompositions[12] = planComp12;


// Composition pour plan 00013
var planComp13 = project.items.addComp(
    "SQ01_UNDLM_00013_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp13.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer13 = planComp13.layers.add(bgSolidComp);
bgLayer13.name = "BG_SOLID";
bgLayer13.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[13]) {
    var editLayer13 = planComp13.layers.add(editSources[13]);
    editLayer13.name = "UNDLM_00013_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer13.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer13.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[13]) {
    var gradedLayer13 = planComp13.layers.add(gradingSources[13]);
    gradedLayer13.name = "UNDLM_00013_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer13.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer13.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer13.enabled = false;
}

planCompositions[13] = planComp13;


// Composition pour plan 00014
var planComp14 = project.items.addComp(
    "SQ01_UNDLM_00014_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp14.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer14 = planComp14.layers.add(bgSolidComp);
bgLayer14.name = "BG_SOLID";
bgLayer14.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[14]) {
    var editLayer14 = planComp14.layers.add(editSources[14]);
    editLayer14.name = "UNDLM_00014_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer14.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer14.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[14]) {
    var gradedLayer14 = planComp14.layers.add(gradingSources[14]);
    gradedLayer14.name = "UNDLM_00014_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer14.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer14.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer14.enabled = false;
}

planCompositions[14] = planComp14;


// Composition pour plan 00015
var planComp15 = project.items.addComp(
    "SQ01_UNDLM_00015_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    2.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp15.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer15 = planComp15.layers.add(bgSolidComp);
bgLayer15.name = "BG_SOLID";
bgLayer15.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[15]) {
    var editLayer15 = planComp15.layers.add(editSources[15]);
    editLayer15.name = "UNDLM_00015_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer15.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer15.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[15]) {
    var gradedLayer15 = planComp15.layers.add(gradingSources[15]);
    gradedLayer15.name = "UNDLM_00015_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer15.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer15.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer15.enabled = false;
}

planCompositions[15] = planComp15;


// Composition pour plan 00016
var planComp16 = project.items.addComp(
    "SQ01_UNDLM_00016_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp16.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer16 = planComp16.layers.add(bgSolidComp);
bgLayer16.name = "BG_SOLID";
bgLayer16.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[16]) {
    var editLayer16 = planComp16.layers.add(editSources[16]);
    editLayer16.name = "UNDLM_00016_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer16.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer16.property("Transform").property("Position").setValue([1280, 720]);
}

planCompositions[16] = planComp16;


// Composition pour plan 00017
var planComp17 = project.items.addComp(
    "SQ01_UNDLM_00017_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.44,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp17.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer17 = planComp17.layers.add(bgSolidComp);
bgLayer17.name = "BG_SOLID";
bgLayer17.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[17]) {
    var editLayer17 = planComp17.layers.add(editSources[17]);
    editLayer17.name = "UNDLM_00017_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer17.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer17.property("Transform").property("Position").setValue([1280, 720]);
}

planCompositions[17] = planComp17;


// Composition pour plan 00018
var planComp18 = project.items.addComp(
    "SQ01_UNDLM_00018_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp18.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer18 = planComp18.layers.add(bgSolidComp);
bgLayer18.name = "BG_SOLID";
bgLayer18.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[18]) {
    var editLayer18 = planComp18.layers.add(editSources[18]);
    editLayer18.name = "UNDLM_00018_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer18.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer18.property("Transform").property("Position").setValue([1280, 720]);
}

planCompositions[18] = planComp18;


// Composition pour plan 00019
var planComp19 = project.items.addComp(
    "SQ01_UNDLM_00019_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp19.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer19 = planComp19.layers.add(bgSolidComp);
bgLayer19.name = "BG_SOLID";
bgLayer19.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[19]) {
    var editLayer19 = planComp19.layers.add(editSources[19]);
    editLayer19.name = "UNDLM_00019_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer19.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer19.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[19]) {
    var gradedLayer19 = planComp19.layers.add(gradingSources[19]);
    gradedLayer19.name = "UNDLM_00019_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer19.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer19.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer19.enabled = false;
}

planCompositions[19] = planComp19;


// Composition pour plan 00020
var planComp20 = project.items.addComp(
    "SQ01_UNDLM_00020_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.5600000000000005,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp20.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer20 = planComp20.layers.add(bgSolidComp);
bgLayer20.name = "BG_SOLID";
bgLayer20.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[20]) {
    var editLayer20 = planComp20.layers.add(editSources[20]);
    editLayer20.name = "UNDLM_00020_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer20.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer20.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[20]) {
    var gradedLayer20 = planComp20.layers.add(gradingSources[20]);
    gradedLayer20.name = "UNDLM_00020_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer20.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer20.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer20.enabled = false;
}

planCompositions[20] = planComp20;


// Composition pour plan 00021
var planComp21 = project.items.addComp(
    "SQ01_UNDLM_00021_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.64,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp21.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer21 = planComp21.layers.add(bgSolidComp);
bgLayer21.name = "BG_SOLID";
bgLayer21.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[21]) {
    var editLayer21 = planComp21.layers.add(editSources[21]);
    editLayer21.name = "UNDLM_00021_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer21.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer21.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[21]) {
    var gradedLayer21 = planComp21.layers.add(gradingSources[21]);
    gradedLayer21.name = "UNDLM_00021_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer21.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer21.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer21.enabled = false;
}

planCompositions[21] = planComp21;


// Composition pour plan 00022
var planComp22 = project.items.addComp(
    "SQ01_UNDLM_00022_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    8.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp22.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer22 = planComp22.layers.add(bgSolidComp);
bgLayer22.name = "BG_SOLID";
bgLayer22.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[22]) {
    var editLayer22 = planComp22.layers.add(editSources[22]);
    editLayer22.name = "UNDLM_00022_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer22.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer22.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[22]) {
    var gradedLayer22 = planComp22.layers.add(gradingSources[22]);
    gradedLayer22.name = "UNDLM_00022_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer22.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer22.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer22.enabled = false;
}

planCompositions[22] = planComp22;


// Composition pour plan 00023
var planComp23 = project.items.addComp(
    "SQ01_UNDLM_00023_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.88,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp23.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer23 = planComp23.layers.add(bgSolidComp);
bgLayer23.name = "BG_SOLID";
bgLayer23.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[23]) {
    var editLayer23 = planComp23.layers.add(editSources[23]);
    editLayer23.name = "UNDLM_00023_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer23.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer23.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[23]) {
    var gradedLayer23 = planComp23.layers.add(gradingSources[23]);
    gradedLayer23.name = "UNDLM_00023_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer23.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer23.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer23.enabled = false;
}

planCompositions[23] = planComp23;


// Composition pour plan 00024
var planComp24 = project.items.addComp(
    "SQ01_UNDLM_00024_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.36,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp24.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer24 = planComp24.layers.add(bgSolidComp);
bgLayer24.name = "BG_SOLID";
bgLayer24.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[24]) {
    var editLayer24 = planComp24.layers.add(editSources[24]);
    editLayer24.name = "UNDLM_00024_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer24.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer24.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[24]) {
    var gradedLayer24 = planComp24.layers.add(gradingSources[24]);
    gradedLayer24.name = "UNDLM_00024_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer24.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer24.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer24.enabled = false;
}

planCompositions[24] = planComp24;


// Composition pour plan 00025
var planComp25 = project.items.addComp(
    "SQ01_UNDLM_00025_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    9.96,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp25.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer25 = planComp25.layers.add(bgSolidComp);
bgLayer25.name = "BG_SOLID";
bgLayer25.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[25]) {
    var editLayer25 = planComp25.layers.add(editSources[25]);
    editLayer25.name = "UNDLM_00025_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer25.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer25.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[25]) {
    var gradedLayer25 = planComp25.layers.add(gradingSources[25]);
    gradedLayer25.name = "UNDLM_00025_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer25.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer25.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer25.enabled = false;
}

planCompositions[25] = planComp25;


// Composition pour plan 00026
var planComp26 = project.items.addComp(
    "SQ01_UNDLM_00026_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.12,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp26.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer26 = planComp26.layers.add(bgSolidComp);
bgLayer26.name = "BG_SOLID";
bgLayer26.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[26]) {
    var editLayer26 = planComp26.layers.add(editSources[26]);
    editLayer26.name = "UNDLM_00026_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer26.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer26.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[26]) {
    var gradedLayer26 = planComp26.layers.add(gradingSources[26]);
    gradedLayer26.name = "UNDLM_00026_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer26.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer26.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer26.enabled = false;
}

planCompositions[26] = planComp26;


// Composition pour plan 00027
var planComp27 = project.items.addComp(
    "SQ01_UNDLM_00027_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.48,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp27.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer27 = planComp27.layers.add(bgSolidComp);
bgLayer27.name = "BG_SOLID";
bgLayer27.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[27]) {
    var editLayer27 = planComp27.layers.add(editSources[27]);
    editLayer27.name = "UNDLM_00027_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer27.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer27.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[27]) {
    var gradedLayer27 = planComp27.layers.add(gradingSources[27]);
    gradedLayer27.name = "UNDLM_00027_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer27.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer27.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer27.enabled = false;
}

planCompositions[27] = planComp27;


// Composition pour plan 00028
var planComp28 = project.items.addComp(
    "SQ01_UNDLM_00028_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    3.8,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp28.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer28 = planComp28.layers.add(bgSolidComp);
bgLayer28.name = "BG_SOLID";
bgLayer28.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[28]) {
    var editLayer28 = planComp28.layers.add(editSources[28]);
    editLayer28.name = "UNDLM_00028_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer28.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer28.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[28]) {
    var gradedLayer28 = planComp28.layers.add(gradingSources[28]);
    gradedLayer28.name = "UNDLM_00028_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer28.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer28.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer28.enabled = false;
}

planCompositions[28] = planComp28;


// Composition pour plan 00029
var planComp29 = project.items.addComp(
    "SQ01_UNDLM_00029_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    7.28,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp29.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer29 = planComp29.layers.add(bgSolidComp);
bgLayer29.name = "BG_SOLID";
bgLayer29.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[29]) {
    var editLayer29 = planComp29.layers.add(editSources[29]);
    editLayer29.name = "UNDLM_00029_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer29.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer29.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[29]) {
    var gradedLayer29 = planComp29.layers.add(gradingSources[29]);
    gradedLayer29.name = "UNDLM_00029_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer29.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer29.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer29.enabled = false;
}

planCompositions[29] = planComp29;


// Composition pour plan 00030
var planComp30 = project.items.addComp(
    "SQ01_UNDLM_00030_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.4,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp30.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer30 = planComp30.layers.add(bgSolidComp);
bgLayer30.name = "BG_SOLID";
bgLayer30.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[30]) {
    var editLayer30 = planComp30.layers.add(editSources[30]);
    editLayer30.name = "UNDLM_00030_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer30.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer30.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[30]) {
    var gradedLayer30 = planComp30.layers.add(gradingSources[30]);
    gradedLayer30.name = "UNDLM_00030_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer30.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer30.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer30.enabled = false;
}

planCompositions[30] = planComp30;


// Composition pour plan 00031
var planComp31 = project.items.addComp(
    "SQ01_UNDLM_00031_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    6.2,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp31.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer31 = planComp31.layers.add(bgSolidComp);
bgLayer31.name = "BG_SOLID";
bgLayer31.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[31]) {
    var editLayer31 = planComp31.layers.add(editSources[31]);
    editLayer31.name = "UNDLM_00031_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer31.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer31.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[31]) {
    var gradedLayer31 = planComp31.layers.add(gradingSources[31]);
    gradedLayer31.name = "UNDLM_00031_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer31.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer31.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer31.enabled = false;
}

planCompositions[31] = planComp31;


// Composition pour plan 00032
var planComp32 = project.items.addComp(
    "SQ01_UNDLM_00032_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    5.92,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp32.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer32 = planComp32.layers.add(bgSolidComp);
bgLayer32.name = "BG_SOLID";
bgLayer32.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[32]) {
    var editLayer32 = planComp32.layers.add(editSources[32]);
    editLayer32.name = "UNDLM_00032_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer32.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer32.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[32]) {
    var gradedLayer32 = planComp32.layers.add(gradingSources[32]);
    gradedLayer32.name = "UNDLM_00032_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer32.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer32.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer32.enabled = false;
}

planCompositions[32] = planComp32;


// Composition pour plan 00033
var planComp33 = project.items.addComp(
    "SQ01_UNDLM_00033_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    4.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp33.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer33 = planComp33.layers.add(bgSolidComp);
bgLayer33.name = "BG_SOLID";
bgLayer33.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[33]) {
    var editLayer33 = planComp33.layers.add(editSources[33]);
    editLayer33.name = "UNDLM_00033_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer33.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer33.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[33]) {
    var gradedLayer33 = planComp33.layers.add(gradingSources[33]);
    gradedLayer33.name = "UNDLM_00033_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer33.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer33.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer33.enabled = false;
}

planCompositions[33] = planComp33;


// Composition pour plan 00034
var planComp34 = project.items.addComp(
    "SQ01_UNDLM_00034_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    10.6,     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp34.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer34 = planComp34.layers.add(bgSolidComp);
bgLayer34.name = "BG_SOLID";
bgLayer34.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[34]) {
    var editLayer34 = planComp34.layers.add(editSources[34]);
    editLayer34.name = "UNDLM_00034_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer34.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer34.property("Transform").property("Position").setValue([1280, 720]);
}

// Ajouter layer GRADED (si disponible)
if (gradingSources[34]) {
    var gradedLayer34 = planComp34.layers.add(gradingSources[34]);
    gradedLayer34.name = "UNDLM_00034_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer34.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer34.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer34.enabled = false;
}

planCompositions[34] = planComp34;



// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "SQ01_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    176.19999999999996, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;

// Ajouter plan 00001 à la timeline master
if (planCompositions[1]) {
    var masterLayer1 = masterComp.layers.add(planCompositions[1]);
    masterLayer1.startTime = 0;
    masterLayer1.name = "UNDLM_00001";
    masterLayer1.label = 1; // Couleurs alternées
}

// Ajouter plan 00002 à la timeline master
if (planCompositions[2]) {
    var masterLayer2 = masterComp.layers.add(planCompositions[2]);
    masterLayer2.startTime = 9.12;
    masterLayer2.name = "UNDLM_00002";
    masterLayer2.label = 2; // Couleurs alternées
}

// Ajouter plan 00003 à la timeline master
if (planCompositions[3]) {
    var masterLayer3 = masterComp.layers.add(planCompositions[3]);
    masterLayer3.startTime = 14.079999999999998;
    masterLayer3.name = "UNDLM_00003";
    masterLayer3.label = 3; // Couleurs alternées
}

// Ajouter plan 00004 à la timeline master
if (planCompositions[4]) {
    var masterLayer4 = masterComp.layers.add(planCompositions[4]);
    masterLayer4.startTime = 18.0;
    masterLayer4.name = "UNDLM_00004";
    masterLayer4.label = 4; // Couleurs alternées
}

// Ajouter plan 00005 à la timeline master
if (planCompositions[5]) {
    var masterLayer5 = masterComp.layers.add(planCompositions[5]);
    masterLayer5.startTime = 19.08;
    masterLayer5.name = "UNDLM_00005";
    masterLayer5.label = 5; // Couleurs alternées
}

// Ajouter plan 00006 à la timeline master
if (planCompositions[6]) {
    var masterLayer6 = masterComp.layers.add(planCompositions[6]);
    masterLayer6.startTime = 20.479999999999997;
    masterLayer6.name = "UNDLM_00006";
    masterLayer6.label = 6; // Couleurs alternées
}

// Ajouter plan 00007 à la timeline master
if (planCompositions[7]) {
    var masterLayer7 = masterComp.layers.add(planCompositions[7]);
    masterLayer7.startTime = 22.279999999999998;
    masterLayer7.name = "UNDLM_00007";
    masterLayer7.label = 7; // Couleurs alternées
}

// Ajouter plan 00008 à la timeline master
if (planCompositions[8]) {
    var masterLayer8 = masterComp.layers.add(planCompositions[8]);
    masterLayer8.startTime = 23.88;
    masterLayer8.name = "UNDLM_00008";
    masterLayer8.label = 8; // Couleurs alternées
}

// Ajouter plan 00009 à la timeline master
if (planCompositions[9]) {
    var masterLayer9 = masterComp.layers.add(planCompositions[9]);
    masterLayer9.startTime = 24.56;
    masterLayer9.name = "UNDLM_00009";
    masterLayer9.label = 9; // Couleurs alternées
}

// Ajouter plan 00010 à la timeline master
if (planCompositions[10]) {
    var masterLayer10 = masterComp.layers.add(planCompositions[10]);
    masterLayer10.startTime = 29.119999999999997;
    masterLayer10.name = "UNDLM_00010";
    masterLayer10.label = 10; // Couleurs alternées
}

// Ajouter plan 00011 à la timeline master
if (planCompositions[11]) {
    var masterLayer11 = masterComp.layers.add(planCompositions[11]);
    masterLayer11.startTime = 31.72;
    masterLayer11.name = "UNDLM_00011";
    masterLayer11.label = 11; // Couleurs alternées
}

// Ajouter plan 00012 à la timeline master
if (planCompositions[12]) {
    var masterLayer12 = masterComp.layers.add(planCompositions[12]);
    masterLayer12.startTime = 35.48;
    masterLayer12.name = "UNDLM_00012";
    masterLayer12.label = 12; // Couleurs alternées
}

// Ajouter plan 00013 à la timeline master
if (planCompositions[13]) {
    var masterLayer13 = masterComp.layers.add(planCompositions[13]);
    masterLayer13.startTime = 39.199999999999996;
    masterLayer13.name = "UNDLM_00013";
    masterLayer13.label = 13; // Couleurs alternées
}

// Ajouter plan 00014 à la timeline master
if (planCompositions[14]) {
    var masterLayer14 = masterComp.layers.add(planCompositions[14]);
    masterLayer14.startTime = 44.99999999999999;
    masterLayer14.name = "UNDLM_00014";
    masterLayer14.label = 14; // Couleurs alternées
}

// Ajouter plan 00015 à la timeline master
if (planCompositions[15]) {
    var masterLayer15 = masterComp.layers.add(planCompositions[15]);
    masterLayer15.startTime = 47.43999999999999;
    masterLayer15.name = "UNDLM_00015";
    masterLayer15.label = 15; // Couleurs alternées
}

// Ajouter plan 00016 à la timeline master
if (planCompositions[16]) {
    var masterLayer16 = masterComp.layers.add(planCompositions[16]);
    masterLayer16.startTime = 49.87999999999999;
    masterLayer16.name = "UNDLM_00016";
    masterLayer16.label = 16; // Couleurs alternées
}

// Ajouter plan 00017 à la timeline master
if (planCompositions[17]) {
    var masterLayer17 = masterComp.layers.add(planCompositions[17]);
    masterLayer17.startTime = 53.83999999999999;
    masterLayer17.name = "UNDLM_00017";
    masterLayer17.label = 1; // Couleurs alternées
}

// Ajouter plan 00018 à la timeline master
if (planCompositions[18]) {
    var masterLayer18 = masterComp.layers.add(planCompositions[18]);
    masterLayer18.startTime = 57.27999999999999;
    masterLayer18.name = "UNDLM_00018";
    masterLayer18.label = 2; // Couleurs alternées
}

// Ajouter plan 00019 à la timeline master
if (planCompositions[19]) {
    var masterLayer19 = masterComp.layers.add(planCompositions[19]);
    masterLayer19.startTime = 66.23999999999998;
    masterLayer19.name = "UNDLM_00019";
    masterLayer19.label = 3; // Couleurs alternées
}

// Ajouter plan 00020 à la timeline master
if (planCompositions[20]) {
    var masterLayer20 = masterComp.layers.add(planCompositions[20]);
    masterLayer20.startTime = 74.51999999999998;
    masterLayer20.name = "UNDLM_00020";
    masterLayer20.label = 4; // Couleurs alternées
}

// Ajouter plan 00021 à la timeline master
if (planCompositions[21]) {
    var masterLayer21 = masterComp.layers.add(planCompositions[21]);
    masterLayer21.startTime = 81.07999999999998;
    masterLayer21.name = "UNDLM_00021";
    masterLayer21.label = 5; // Couleurs alternées
}

// Ajouter plan 00022 à la timeline master
if (planCompositions[22]) {
    var masterLayer22 = masterComp.layers.add(planCompositions[22]);
    masterLayer22.startTime = 87.71999999999998;
    masterLayer22.name = "UNDLM_00022";
    masterLayer22.label = 6; // Couleurs alternées
}

// Ajouter plan 00023 à la timeline master
if (planCompositions[23]) {
    var masterLayer23 = masterComp.layers.add(planCompositions[23]);
    masterLayer23.startTime = 96.59999999999998;
    masterLayer23.name = "UNDLM_00023";
    masterLayer23.label = 7; // Couleurs alternées
}

// Ajouter plan 00024 à la timeline master
if (planCompositions[24]) {
    var masterLayer24 = masterComp.layers.add(planCompositions[24]);
    masterLayer24.startTime = 107.47999999999998;
    masterLayer24.name = "UNDLM_00024";
    masterLayer24.label = 8; // Couleurs alternées
}

// Ajouter plan 00025 à la timeline master
if (planCompositions[25]) {
    var masterLayer25 = masterComp.layers.add(planCompositions[25]);
    masterLayer25.startTime = 113.83999999999997;
    masterLayer25.name = "UNDLM_00025";
    masterLayer25.label = 9; // Couleurs alternées
}

// Ajouter plan 00026 à la timeline master
if (planCompositions[26]) {
    var masterLayer26 = masterComp.layers.add(planCompositions[26]);
    masterLayer26.startTime = 123.79999999999998;
    masterLayer26.name = "UNDLM_00026";
    masterLayer26.label = 10; // Couleurs alternées
}

// Ajouter plan 00027 à la timeline master
if (planCompositions[27]) {
    var masterLayer27 = masterComp.layers.add(planCompositions[27]);
    masterLayer27.startTime = 128.92;
    masterLayer27.name = "UNDLM_00027";
    masterLayer27.label = 11; // Couleurs alternées
}

// Ajouter plan 00028 à la timeline master
if (planCompositions[28]) {
    var masterLayer28 = masterComp.layers.add(planCompositions[28]);
    masterLayer28.startTime = 133.39999999999998;
    masterLayer28.name = "UNDLM_00028";
    masterLayer28.label = 12; // Couleurs alternées
}

// Ajouter plan 00029 à la timeline master
if (planCompositions[29]) {
    var masterLayer29 = masterComp.layers.add(planCompositions[29]);
    masterLayer29.startTime = 137.2;
    masterLayer29.name = "UNDLM_00029";
    masterLayer29.label = 13; // Couleurs alternées
}

// Ajouter plan 00030 à la timeline master
if (planCompositions[30]) {
    var masterLayer30 = masterComp.layers.add(planCompositions[30]);
    masterLayer30.startTime = 144.48;
    masterLayer30.name = "UNDLM_00030";
    masterLayer30.label = 14; // Couleurs alternées
}

// Ajouter plan 00031 à la timeline master
if (planCompositions[31]) {
    var masterLayer31 = masterComp.layers.add(planCompositions[31]);
    masterLayer31.startTime = 148.88;
    masterLayer31.name = "UNDLM_00031";
    masterLayer31.label = 15; // Couleurs alternées
}

// Ajouter plan 00032 à la timeline master
if (planCompositions[32]) {
    var masterLayer32 = masterComp.layers.add(planCompositions[32]);
    masterLayer32.startTime = 155.07999999999998;
    masterLayer32.name = "UNDLM_00032";
    masterLayer32.label = 16; // Couleurs alternées
}

// Ajouter plan 00033 à la timeline master
if (planCompositions[33]) {
    var masterLayer33 = masterComp.layers.add(planCompositions[33]);
    masterLayer33.startTime = 160.99999999999997;
    masterLayer33.name = "UNDLM_00033";
    masterLayer33.label = 1; // Couleurs alternées
}

// Ajouter plan 00034 à la timeline master
if (planCompositions[34]) {
    var masterLayer34 = masterComp.layers.add(planCompositions[34]);
    masterLayer34.startTime = 165.59999999999997;
    masterLayer34.name = "UNDLM_00034";
    masterLayer34.label = 2; // Couleurs alternées
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


// ==========================================
// 5. SAUVEGARDE ET FINALISATION
// ==========================================

// Sauvegarder le projet
var saveFile = new File("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES/SQ01/_AE/SQ01_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = 29;
var totalCount = 34;
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence SQ01 créée avec succès!\n\n" + 
      "📊 Statistiques:\n" +
      "• Plans total: " + totalCount + "\n" + 
      "• Plans étalonnés: " + gradedCount + "\n" +
      "• Plans montage seul: " + editOnlyCount + "\n" +
      "• Durée séquence: " + Math.round(176.19999999999996 * 100) / 100 + "s\n\n" +
      "💾 Sauvegardé: SQ01_01.aep\n\n" +
      "✅ Structure conforme au template AE\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
$.writeln("AE_GENERATION_V2_SUCCESS:SQ01:" + totalCount + ":" + gradedCount);
