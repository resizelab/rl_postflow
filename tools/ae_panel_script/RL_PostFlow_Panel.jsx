/*
 * RL PostFlow - Panel Script After Effects
 * Export Timeline & Plans avec Versioning Automatique
 * Compatible After Effects 2025+ - Workflow Animation Mixte
 * 
 * Version: 1.6.2 - UI améliorée : emojis ProRes + contrôles file de rendu
 * Workflow: RL PostFlow - Basé sur sélection dans project panel
 */

// ================================
// CONFIGURATION GLOBALE
// ================================

var CONFIG = {
    // Chemins de base
    BASE_EXPORT_PATH: "E:\\Volumes\\resizelab\\o2b-undllm\\4_OUT\\2_FROM_ANIM\\",
    
    // Formats d'export
    FORMATS: {
        PNG_8BIT: {
            name: "PNG 8-bits",
            extension: "png",
            quality: "PNG_8",
            path_suffix: "1_VIDEO-REF"
        },
        PRORES_HQ_1440: {
            name: "ProRes HQ 1440p",
            extension: "mov",
            quality: "ProRes_HQ",
            resolution: [2560, 1440],
            path_suffix: ""
        },
        PRORES_LT_1440: {
            name: "ProRes LT 1440p", 
            extension: "mov",
            quality: "ProRes_LT",
            resolution: [2560, 1440],
            path_suffix: ""
        }
    },
    
    // Nomenclature
    SEQUENCE_PATTERN: /SQ\d{2}/g,
    SEQUENCE_TEMPLATE_PATTERN: /SQ\d{2}_[A-Z0-9_]+_v\d{3}/g, // Pour SQ02_UNDLM_v001
    SHOT_PATTERN: /UNDLM(?:_\d{5})?/g, // UNDLM ou UNDLM_12345
    VERSION_PATTERN: /v\d{3}/g,
    
    // Configuration LucidLink
    LUCIDLINK: {
        WINDOWS: {
            // TODO v0.2.0: Remplacer par détection intelligente via 'lucid status'
            // Au lieu de tester toutes les lettres, utiliser l'API LucidLink
            POSSIBLE_DRIVES: ["C:", "D:", "E:", "F:", "G:", "H:", "I:", "J:", "K:", "L:", "M:", "N:", "O:", "P:"],
            BASE_PATTERN: "\\Volumes\\resizelab\\o2b-undllm\\4_OUT\\2_FROM_ANIM\\",
            FALLBACK: "E:\\Volumes\\resizelab\\o2b-undllm\\4_OUT\\2_FROM_ANIM\\"
        },
        MAC: {
            BASE_PATH: "/Volumes/resizelab/o2b-undllm/4_OUT/2_FROM_ANIM/"
        }
    }
};

// ================================
// MODULE: UTILITAIRES DE BASE
// ================================

var Utils = (function() {
    
    function log(message) {
        var timestamp = new Date().toLocaleTimeString();
        if (typeof $.global.logPanel !== 'undefined' && $.global.logPanel) {
            $.global.logPanel.text += "[" + timestamp + "] " + message + "\n";
            $.global.logPanel.parent.layout.layout(true);
        }
    }
    
    function isWindows() {
        return $.os.toLowerCase().indexOf("windows") !== -1;
    }
    
    function getPathSeparator() {
        return isWindows() ? "\\" : "/";
    }
    
    function parseSequenceFromComp(compName) {
        // D'abord essayer le pattern template complet (SQ02_UNDLM_v001)
        var templateMatch = compName.match(CONFIG.SEQUENCE_TEMPLATE_PATTERN);
        if (templateMatch) {
            // Extraire juste la partie SQ02 du template
            var seqMatch = templateMatch[0].match(CONFIG.SEQUENCE_PATTERN);
            return seqMatch ? seqMatch[0] : null;
        }
        
        // Sinon utiliser le pattern simple (SQ02)
        var seqMatch = compName.match(CONFIG.SEQUENCE_PATTERN);
        return seqMatch ? seqMatch[0] : null;
    }
    
    function parseShotFromComp(compName) {
        var shotMatch = compName.match(CONFIG.SHOT_PATTERN);
        return shotMatch ? shotMatch[0] : null;
    }
    
    function parseVersionFromComp(compName) {
        var versionMatch = compName.match(CONFIG.VERSION_PATTERN);
        return versionMatch ? versionMatch[0] : "v001"; // Fallback si pas de version
    }
    
    function createDirectoryIfNotExists(path) {
        var folder = new Folder(path);
        if (!folder.exists) {
            return folder.create();
        }
        return true;
    }
    
    function padZeros(num, length) {
        var str = String(num);
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    }
    
    function fileExists(filePath) {
        var file = new File(filePath);
        return file.exists;
    }
    
    // API publique du module
    return {
        log: log,
        isWindows: isWindows,
        getPathSeparator: getPathSeparator,
        parseSequenceFromComp: parseSequenceFromComp,
        parseShotFromComp: parseShotFromComp,
        parseVersionFromComp: parseVersionFromComp,
        createDirectoryIfNotExists: createDirectoryIfNotExists,
        padZeros: padZeros,
        fileExists: fileExists
    };
})();

// ================================
// MODULE: GESTION DES VERSIONS
// ================================

var VersionManager = (function() {
    
    function getNextVersion(basePath, filename) {
        var folder = new Folder(basePath);
        if (!folder.exists) {
            Utils.log("📁 Dossier inexistant, création de v001: " + basePath);
            return "v001";
        }
        
        var files = folder.getFiles();
        var maxVersion = 0;
        var existingVersions = [];
        
        // Simplifié: chercher les fichiers contenant le nom de base
        var baseNameForSearch = filename;
        // Enlever l'extension si présente
        if (baseNameForSearch.indexOf(".") > 0) {
            baseNameForSearch = baseNameForSearch.substring(0, baseNameForSearch.lastIndexOf("."));
        }
        // Enlever la version si présente
        if (baseNameForSearch.indexOf("_v") > 0) {
            baseNameForSearch = baseNameForSearch.substring(0, baseNameForSearch.indexOf("_v"));
        }
        
        Utils.log("🔍 Recherche versions existantes pour: " + baseNameForSearch + " dans " + basePath);
        Utils.log("📂 Nombre de fichiers dans le dossier: " + files.length);
        
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file instanceof File) {
                var fileName = file.name;
                Utils.log("📄 Fichier examiné: " + fileName);
                
                // Vérifier si le fichier correspond au pattern de base
                if (fileName.indexOf(baseNameForSearch) === 0) {
                    Utils.log("✅ Fichier correspondant trouvé: " + fileName);
                    
                    // Chercher pattern v001, v002, etc.
                    var vIndex = fileName.indexOf("_v");
                    if (vIndex > 0 && vIndex + 4 < fileName.length) {
                        var versionStr = fileName.substring(vIndex + 2, vIndex + 5);
                        Utils.log("🔢 Version extraite: " + versionStr + " depuis " + fileName);
                        
                        if (versionStr.match(/^\d{3}$/)) {
                            var version = parseInt(versionStr, 10);
                            existingVersions.push("v" + Utils.padZeros(version, 3));
                            if (version > maxVersion) {
                                maxVersion = version;
                            }
                            Utils.log("� Version valide détectée: v" + Utils.padZeros(version, 3) + " (max: " + maxVersion + ")");
                        }
                    }
                } else {
                    Utils.log("⏭️ Fichier ignoré (ne correspond pas): " + fileName);
                }
            }
        }
        
        var nextVersion = "v" + Utils.padZeros(maxVersion + 1, 3);
        
        if (existingVersions.length > 0) {
            Utils.log("📊 Versions détectées: " + existingVersions.join(", ") + " → Prochaine: " + nextVersion);
        } else {
            Utils.log("📂 Aucune version existante trouvée, création de: " + nextVersion);
        }
        
        return nextVersion;
    }
    
    function getVersionForExport(comp, basePath, filename, isFinal, autoVersion) {
        if (isFinal) {
            return "vDEF"; // Version définitive pour validation finale
        } else if (autoVersion) {
            return getNextVersion(basePath, filename); // Scan serveur + incrémentation
        } else {
            // Mode manuel : utiliser la version actuelle de la composition
            return Utils.parseVersionFromComp(comp.name);
        }
    }
    
    function getFixedVersion() {
        return "v001"; // Version fixe pour mode non-auto
    }
    
    // API publique du module
    return {
        getNextVersion: getNextVersion,
        getVersionForExport: getVersionForExport,
        getFixedVersion: getFixedVersion
    };
})();

// ================================
// MODULE: DÉTECTION LUCIDLINK
// ================================

var LucidLinkDetector = (function() {
    
    function detectLucidLinkPath() {
        if (Utils.isWindows()) {
            return detectWindowsLucidLink();
        } else {
            return detectMacLucidLink();
        }
    }
    
    function detectWindowsLucidLink() {
        var lucidConfig = CONFIG.LUCIDLINK.WINDOWS;
        var possibleDrives = lucidConfig.POSSIBLE_DRIVES;
        
        // TODO v0.2.0: Implémenter détection via 'lucid status' command
        // Exemple: var driveLetter = executeLucidStatus(); return driveLetter + "\\Volumes\\..."
        
        // Test chaque lettre de lecteur possible (approche temporaire v0.1.1)
        for (var i = 0; i < possibleDrives.length; i++) {
            var drive = possibleDrives[i];
            var testPath = drive + lucidConfig.BASE_PATTERN;
            
            try {
                var folder = new Folder(testPath);
                if (folder.exists) {
                    Utils.log("✅ LucidLink détecté: " + testPath);
                    return testPath;
                }
            } catch (e) {
                // Continue la recherche
            }
        }
        
        // Fallback si aucun chemin trouvé
        Utils.log("⚠️ LucidLink non détecté, utilisation du fallback: " + lucidConfig.FALLBACK);
        return lucidConfig.FALLBACK;
    }
    
    function detectMacLucidLink() {
        var lucidConfig = CONFIG.LUCIDLINK.MAC;
        var testPath = lucidConfig.BASE_PATH;
        
        try {
            var folder = new Folder(testPath);
            if (folder.exists) {
                Utils.log("✅ LucidLink détecté: " + testPath);
                return testPath;
            }
        } catch (e) {
            Utils.log("❌ Erreur détection LucidLink macOS: " + e.toString());
        }
        
        Utils.log("⚠️ LucidLink non trouvé sur macOS: " + testPath);
        return testPath;
    }
    
    // API publique du module
    return {
        detectLucidLinkPath: detectLucidLinkPath
    };
})();

// ================================
// MODULE: GESTION DES CHEMINS
// ================================

var PathManager = (function() {
    
    function buildExportPath(comp, format, version) {
        var sequence = Utils.parseSequenceFromComp(comp.name);
        var shot = Utils.parseShotFromComp(comp.name);
        
        if (!sequence) {
            throw new Error("Impossible de déterminer la séquence depuis: " + comp.name);
        }
        
        var basePath = "";
        var filename = "";
        
        if (format === CONFIG.FORMATS.PNG_8BIT) {
            // Export PNG vers structure EB (projet local)
            if (!shot) {
                throw new Error("Export PNG impossible pour une séquence complète. Sélectionnez un plan individuel.");
            }
            
            // Vérification supplémentaire : pattern séquence complète détecté
            var hasShot = comp.name.indexOf("_00") > 0; // Détection simple du numéro de plan
            if (!hasShot && comp.name.indexOf("_v") > 0) {
                throw new Error("Export PNG impossible pour la séquence '" + comp.name + "'. Utilisez ProRes pour les séquences.");
            }
            
            basePath = buildExportPathNew(sequence, shot, "animation", false);
            filename = sequence + "_" + shot + "_" + version + "_[#####].png";
            
        } else {
            // Export ProRes vers LucidLink
            // Détecter si c'est une séquence complète (pas de numéro de plan _00xxx)
            var hasShot = comp.name.indexOf("_00") > 0;
            var isSequenceExport = !shot || (!hasShot && comp.name.indexOf("_v") > 0);
            var targetName = isSequenceExport ? "UNDLM" : shot;
            
            basePath = buildExportPathNew(sequence, shot, "final", isSequenceExport);
            
            // Nouveau système de nommage compatible watchfolder
            if (version === "vDEF") {
                filename = sequence + "_" + targetName + "_vDEF.mov";
            } else {
                filename = sequence + "_" + targetName + "_" + version + ".mov";
            }
        }
        
        return {
            path: basePath,
            filename: filename,
            fullPath: basePath + Utils.getPathSeparator() + filename
        };
    }
    
    function buildExportPathNew(sequence, shot, type, isSequenceExport) {
        var relativePath;
        if (type === "animation") {
            // Export PNG vers la structure EB sur LucidLink (pas local)
            var lucidPath = LucidLinkDetector.detectLucidLinkPath();
            
            // Remplacer 4_OUT/2_FROM_ANIM par 3_PROJECTS/2_ANIM/SEQUENCES pour PNG
            var pngBasePath = lucidPath.replace("4_OUT/2_FROM_ANIM", "3_PROJECTS/2_ANIM/SEQUENCES");
            if (Utils.isWindows()) {
                pngBasePath = lucidPath.replace("4_OUT\\2_FROM_ANIM", "3_PROJECTS\\2_ANIM\\SEQUENCES");
            }
            
            // Structure EB : SQ02/_EB/UNDLM_00035/1_VIDEO-REF
            relativePath = sequence + Utils.getPathSeparator() + "_EB" + Utils.getPathSeparator() + shot + Utils.getPathSeparator() + "1_VIDEO-REF";
            return pngBasePath + Utils.getPathSeparator() + relativePath;
        } else {
            // Export ProRes vers LucidLink
            var lucidPath = LucidLinkDetector.detectLucidLinkPath();
            if (isSequenceExport) {
                relativePath = sequence + Utils.getPathSeparator() + "_ALL";
            } else {
                relativePath = sequence + Utils.getPathSeparator() + shot;
            }
            
            return lucidPath + relativePath;
        }
    }
    
    function createExportDirectories(sequence, shot) {
        try {
            var lucidPath = LucidLinkDetector.detectLucidLinkPath();
            
            // Créer structure pour les plans individuels seulement si c'est vraiment un plan
            if (shot && shot.indexOf("_00") > 0) {
                var shotPath = buildExportPathNew(sequence, shot, "final", false);
                if (!Utils.createDirectoryIfNotExists(shotPath)) {
                    Utils.log("❌ Impossible de créer: " + shotPath);
                    return false;
                }
                Utils.log("✅ Dossier plan créé: " + shot);
            }
            
            // Créer structure pour les séquences (_ALL)
            var sequencePath = buildExportPathNew(sequence, null, "final", true);
            if (!Utils.createDirectoryIfNotExists(sequencePath)) {
                Utils.log("❌ Impossible de créer: " + sequencePath);
                return false;
            }
            Utils.log("✅ Dossier séquence créé: " + sequence + "/_ALL");
            
            return true;
            
        } catch (e) {
            Utils.log("❌ Erreur création arborescence: " + e.toString());
            return false;
        }
    }
    
    function prepareExport(comp) {
        var sequence = Utils.parseSequenceFromComp(comp.name);
        var shot = Utils.parseShotFromComp(comp.name);
        
        if (!sequence) {
            Utils.log("❌ Impossible de déterminer la séquence depuis: " + comp.name);
            return false;
        }
        
        Utils.log("🔧 Préparation export pour: " + comp.name);
        
        // Créer l'arborescence d'export
        return createExportDirectories(sequence, shot);
    }
    
    // API publique du module
    return {
        buildExportPath: buildExportPath,
        buildExportPathNew: buildExportPathNew,
        createExportDirectories: createExportDirectories,
        prepareExport: prepareExport
    };
})();

// ================================
// MODULE: GESTION DES COMPOSITIONS
// ================================

var CompositionManager = (function() {
    
    function getSelectedCompositions() {
        var selectedItems = [];
        var selection = app.project.selection;
        
        for (var i = 0; i < selection.length; i++) {
            if (selection[i] instanceof CompItem) {
                selectedItems.push(selection[i]);
            }
        }
        
        return selectedItems;
    }
    
    // API publique du module
    return {
        getSelectedCompositions: getSelectedCompositions
    };
})();

// ================================
// MODULE: EXPORTS
// ================================

// ================================
// TEMPLATE MANAGER
// ================================

var TemplateManager = (function() {
    
    function findTemplate(templateName) {
        // Rechercher le template dans les dossiers After Effects
        var templateFolders = [
            Folder.myDocuments.fsName + "/Adobe/After Effects 2025/User Presets/",
            Folder.myDocuments.fsName + "\\Adobe\\After Effects 2025\\User Presets\\",
            "/Applications/Adobe After Effects 2025/Presets/",
            "C:/Program Files/Adobe/Adobe After Effects 2025/Presets/"
        ];
        
        for (var i = 0; i < templateFolders.length; i++) {
            var templatePath = templateFolders[i] + templateName;
            var templateFile = new File(templatePath);
            if (templateFile.exists) {
                Utils.log("✅ Template trouvé: " + templatePath);
                return templateFile;
            }
        }
        
        Utils.log("⚠️ Template non trouvé: " + templateName);
        return null;
    }
    
    function applyTemplateFromAOM(outputModule, templateName) {
        try {
            // Les templates dans le fichier RL PostFlow.aom sont accessibles par nom
            outputModule.applyTemplate(templateName);
            Utils.log("✅ Template RL PostFlow appliqué: " + templateName);
            return true;
        } catch (error) {
            Utils.log("⚠️ Template RL PostFlow non disponible: " + templateName + " (" + error.toString() + ")");
            return false;
        }
    }
    
    return {
        applyTemplateFromAOM: applyTemplateFromAOM,
        findTemplate: findTemplate
    };
})();

var ExportManager = (function() {
    
    function exportPNG8bit(comp, autoVersion) {
        try {
            // Préparer l'export (création dossiers)
            if (!PathManager.prepareExport(comp)) {
                throw new Error("Impossible de préparer l'export pour: " + comp.name);
            }
            
            var version;
            if (autoVersion) {
                // Mode auto-version : scan serveur AVANT la construction du chemin final
                var sequence = Utils.parseSequenceFromComp(comp.name);
                var shot = Utils.parseShotFromComp(comp.name);
                var basePath = PathManager.buildExportPathNew(sequence, shot, "animation", false);
                var baseFilename = sequence + "_" + shot; // Pattern complet pour PNG
                
                Utils.log("🔍 Auto-version PNG - Scan dans: " + basePath);
                Utils.log("🔍 Recherche fichiers commençant par: " + baseFilename);
                
                version = VersionManager.getNextVersion(basePath, baseFilename);
                Utils.log("🔄 Auto-version activée, version détectée: " + version);
                
                // RENOMMER la composition avec la nouvelle version
                var newCompName = sequence + "_" + shot + "_" + version;
                comp.name = newCompName;
                Utils.log("✏️ Composition renommée: " + newCompName);
            } else {
                // Mode manuel : utiliser la version actuelle de la composition
                version = Utils.parseVersionFromComp(comp.name);
                Utils.log("📝 Version de la composition utilisée: " + version);
            }
            
            var exportInfo = PathManager.buildExportPath(comp, CONFIG.FORMATS.PNG_8BIT, version);
            
            // Configuration du rendu PNG 8-bits
            var renderQueue = app.project.renderQueue;
            var renderItem = renderQueue.items.add(comp);
            
            // Appliquer le render setting PNG 12.5 fps AVANT l'output module
            try {
                renderItem.applyTemplate("PNG 12.5 fps RL PostFlow");
                Utils.log("✅ Render Settings appliqué: PNG 12.5 fps RL PostFlow");
            } catch (renderError) {
                Utils.log("⚠️ Render Settings PNG 12.5 fps non disponible: " + renderError.toString());
            }
            
            // Module de sortie PNG - appliquer le template APRÈS le render setting
            var outputModule = renderItem.outputModule(1);
            
            // Essayer d'appliquer le template PNG 8-bits depuis RL PostFlow.aom
            var templateApplied = TemplateManager.applyTemplateFromAOM(outputModule, "PNG 8-bits RL PostFlow");
            
            // Définir le chemin APRÈS l'application du template (pour éviter écrasement)
            var fullPath = exportInfo.fullPath;
            outputModule.file = new File(fullPath);
            
            if (!templateApplied) {
                // Fallback: configuration manuelle pour compatibilité
                try {
                    var outputSettings = outputModule.getSettings();
                    outputSettings.format = "PNG";
                    
                    if (outputSettings.hasOwnProperty("includeSourceXMP")) {
                        outputSettings.includeSourceXMP = false;
                    }
                    if (outputSettings.hasOwnProperty("includeLayerXMP")) {
                        outputSettings.includeLayerXMP = false;
                    }
                    
                    outputModule.setSettings(outputSettings);
                    Utils.log("✅ Export PNG configuré manuellement (sans template)");
                    
                } catch (settingsError) {
                    Utils.log("⚠️ Configuration PNG simplifiée (macOS): " + settingsError.toString());
                }
            }
            
            Utils.log("✅ Export PNG 8-bits configuré: " + comp.name + " → " + exportInfo.filename);
            Utils.log("→ " + exportInfo.fullPath);
            
            return renderItem;
            
        } catch (e) {
            Utils.log("ERREUR Export PNG: " + e.toString());
            return null;
        }
    }
    
    function exportProRes(comp, format, autoVersion) {
        try {
            // Préparer l'export (création dossiers)
            if (!PathManager.prepareExport(comp)) {
                throw new Error("Impossible de préparer l'export pour: " + comp.name);
            }
            
            var version;
            if (autoVersion) {
                // Mode auto-version : scan serveur AVANT la construction du chemin final
                var sequence = Utils.parseSequenceFromComp(comp.name);
                var shot = Utils.parseShotFromComp(comp.name);
                
                // Détecter si c'est une séquence complète (pas de numéro de plan _00xxx)
                var hasShot = comp.name.indexOf("_00") > 0;
                var isSequenceExport = !shot || (!hasShot && comp.name.indexOf("_v") > 0);
                
                var basePath = PathManager.buildExportPathNew(sequence, shot, "final", isSequenceExport);
                var baseFilename = isSequenceExport ? (sequence + "_UNDLM") : (sequence + "_" + shot); // Pattern corrigé pour les séquences
                
                Utils.log("🔍 Auto-version ProRes - Type: " + (isSequenceExport ? "Séquence" : "Plan"));
                Utils.log("🔍 Auto-version ProRes - Scan dans: " + basePath);
                Utils.log("🔍 Recherche fichiers commençant par: " + baseFilename);
                
                version = VersionManager.getNextVersion(basePath, baseFilename);
                Utils.log("🔄 Auto-version activée, version détectée: " + version);
                
                // RENOMMER la composition avec la nouvelle version
                var newCompName;
                if (isSequenceExport) {
                    // Pour les séquences : SQ02_UNDLM_v002
                    newCompName = sequence + "_UNDLM_" + version;
                } else {
                    // Pour les plans : SQ02_UNDLM_00043_v002
                    newCompName = sequence + "_" + shot + "_" + version;
                }
                comp.name = newCompName;
                Utils.log("✏️ Composition renommée: " + newCompName);
            } else {
                // Mode manuel : utiliser la version actuelle de la composition
                version = Utils.parseVersionFromComp(comp.name);
                Utils.log("📝 Version de la composition utilisée: " + version);
            }
            
            var exportInfo = PathManager.buildExportPath(comp, format, version);
            
            // Configuration du rendu ProRes
            var renderQueue = app.project.renderQueue;
            var renderItem = renderQueue.items.add(comp);
            
            // Module de sortie ProRes - appliquer le template AVANT de définir le chemin
            var outputModule = renderItem.outputModule(1);
            
            // Essayer d'appliquer le template ProRes LT depuis RL PostFlow.aom AVANT le chemin
            var templateApplied = TemplateManager.applyTemplateFromAOM(outputModule, "ProRes LT RL PostFlow");
            
            // Définir le chemin APRÈS l'application du template (pour éviter écrasement)
            var fullPath = exportInfo.fullPath;
            outputModule.file = new File(fullPath);
            
            if (!templateApplied) {
                // Fallback: configuration par défaut pour compatibilité
                try {
                    var outputSettings = outputModule.getSettings();
                    
                    if (!Utils.isWindows()) {
                        Utils.log("🍎 macOS détecté: utilisation réglages par défaut ProRes");
                        // Laisser After Effects utiliser ses réglages par défaut
                    } else {
                        // Windows: essayer de configurer manuellement
                        if (outputSettings.hasOwnProperty("format") && !outputSettings.isPropertyReadOnly("format")) {
                            outputSettings.format = "QuickTime";
                        }
                    }
                    
                    outputModule.setSettings(outputSettings);
                    
                } catch (settingsError) {
                    Utils.log("⚠️ Configuration ProRes simplifiée (macOS): " + settingsError.toString());
                    // Continuer avec les réglages par défaut d'After Effects
                }
            }
            
            Utils.log("Export " + format.name + " configuré: " + comp.name);
            Utils.log("→ " + exportInfo.fullPath);
            
            return renderItem;
            
        } catch (e) {
            Utils.log("ERREUR Export ProRes: " + e.toString());
            return null;
        }
    }
    
    function exportProResDEF(comp, format) {
        try {
            // Préparer l'export (création dossiers)
            if (!PathManager.prepareExport(comp)) {
                throw new Error("Impossible de préparer l'export pour: " + comp.name);
            }
            
            // Version définitive
            var version = "vDEF";
            var exportInfo = PathManager.buildExportPath(comp, format, version);
            
            // Configuration du rendu ProRes
            var renderQueue = app.project.renderQueue;
            var renderItem = renderQueue.items.add(comp);
            
            // Module de sortie ProRes - appliquer le template AVANT de définir le chemin
            var outputModule = renderItem.outputModule(1);
            
            // Essayer d'appliquer le template ProRes HQ depuis RL PostFlow.aom AVANT le chemin
            var templateApplied = TemplateManager.applyTemplateFromAOM(outputModule, "ProRes HQ RL PostFlow");
            
            // Définir le chemin APRÈS l'application du template (pour éviter écrasement)
            var fullPath = exportInfo.fullPath;
            outputModule.file = new File(fullPath);
            
            if (!templateApplied) {
                // Fallback: configuration par défaut pour compatibilité
                try {
                    var outputSettings = outputModule.getSettings();
                    
                    if (!Utils.isWindows()) {
                        Utils.log("🍎 macOS détecté: utilisation réglages par défaut ProRes (DEF)");
                        // Laisser After Effects utiliser ses réglages par défaut
                    } else {
                        // Windows: essayer de configurer manuellement
                        if (outputSettings.hasOwnProperty("format") && !outputSettings.isPropertyReadOnly("format")) {
                            outputSettings.format = "QuickTime";
                        }
                    }
                    
                    outputModule.setSettings(outputSettings);
                    
                } catch (settingsError) {
                    Utils.log("⚠️ Configuration ProRes (DEF) simplifiée (macOS): " + settingsError.toString());
                    // Continuer avec les réglages par défaut d'After Effects
                }
            }
            
            Utils.log("Export " + format.name + " (DEF) configuré: " + comp.name);
            Utils.log("→ " + exportInfo.fullPath);
            
            return renderItem;
            
        } catch (e) {
            Utils.log("ERREUR Export ProRes DEF: " + e.toString());
            return null;
        }
    }
    
    function startRenderQueue() {
        try {
            if (app.project.renderQueue.numItems > 0) {
                Utils.log("Démarrage de la file de rendu...");
                app.project.renderQueue.render();
                Utils.log("File de rendu terminée !");
            } else {
                Utils.log("Aucun élément dans la file de rendu.");
            }
        } catch (e) {
            Utils.log("ERREUR Rendu: " + e.toString());
        }
    }
    
    function pauseRenderQueue() {
        try {
            if (app.project.renderQueue.canQueueInAME) {
                Utils.log("Mise en pause de la file de rendu...");
                app.project.renderQueue.pauseRendering(true);
                Utils.log("File de rendu mise en pause.");
            } else {
                Utils.log("Impossible de mettre en pause : file de rendu non active.");
            }
        } catch (e) {
            Utils.log("ERREUR Pause: " + e.toString());
        }
    }
    
    function stopRenderQueue() {
        try {
            Utils.log("Arrêt de la file de rendu...");
            app.project.renderQueue.stopRendering();
            Utils.log("File de rendu arrêtée.");
        } catch (e) {
            Utils.log("ERREUR Arrêt: " + e.toString());
        }
    }
    
    function getRenderQueueStatus() {
        try {
            var rq = app.project.renderQueue;
            var status = {
                numItems: rq.numItems,
                rendering: rq.rendering,
                canQueueInAME: rq.canQueueInAME
            };
            return status;
        } catch (e) {
            Utils.log("ERREUR Status: " + e.toString());
            return null;
        }
    }
    
    // API publique du module
    return {
        exportPNG8bit: exportPNG8bit,
        exportProRes: exportProRes,
        exportProResDEF: exportProResDEF,
        startRenderQueue: startRenderQueue,
        pauseRenderQueue: pauseRenderQueue,
        stopRenderQueue: stopRenderQueue,
        getRenderQueueStatus: getRenderQueueStatus
    };
})();

// ================================
// MODULE: INTERFACE UTILISATEUR
// ================================

var UIManager = (function() {
    
    var logPanel; // Variable pour les logs
    
    function buildUI(panel) {
        var mainGroup = panel.add("group", undefined, {name: "mainGroup"});
        mainGroup.orientation = "column";
        mainGroup.alignChildren = ["fill", "top"];
        mainGroup.spacing = 10;
        mainGroup.margins = 16;
        
        // Header
        var headerGroup = mainGroup.add("group", undefined, {name: "headerGroup"});
        headerGroup.orientation = "column";
        headerGroup.alignChildren = ["center", "center"];
        
        var titleLabel = headerGroup.add("statictext", undefined, "� RL PostFlow v1.6.2");
        titleLabel.graphics.font = ScriptUI.newFont("dialog", "bold", 16);
        
        var subtitleLabel = headerGroup.add("statictext", undefined, "Export basé sur sélection");
        subtitleLabel.graphics.font = ScriptUI.newFont("dialog", "regular", 10);
        
        // Informations sélection
        var selectionGroup = mainGroup.add("panel", undefined, "Sélection Active");
        selectionGroup.orientation = "column";
        selectionGroup.alignChildren = ["fill", "top"];
        selectionGroup.margins = 10;
        
        var selectionInfo = selectionGroup.add("statictext", undefined, "Aucune composition sélectionnée", {multiline: true});
        selectionInfo.preferredSize.height = 40;
        
        var refreshBtn = selectionGroup.add("button", undefined, "🔄 Actualiser Sélection");
        
        // Options d'export
        var optionsGroup = mainGroup.add("panel", undefined, "Options");
        optionsGroup.orientation = "column";
        optionsGroup.alignChildren = ["fill", "top"];
        optionsGroup.margins = 10;
        
        var autoVersionCheckbox = optionsGroup.add("checkbox", undefined, "🔄 Auto-version (détection serveur)");
        autoVersionCheckbox.value = true; // Activé par défaut
        autoVersionCheckbox.helpTip = "Si activé, détecte les versions existantes sur le serveur et incrémente automatiquement.\nSi désactivé, utilise la version actuelle de la composition.";
        
        // Boutons d'export
        var exportGroup = mainGroup.add("panel", undefined, "Export");
        exportGroup.orientation = "column";
        exportGroup.alignChildren = ["fill", "top"];
        exportGroup.margins = 10;
        exportGroup.spacing = 8;
        
        var pngBtn = exportGroup.add("button", undefined, "📸 PNG 8-bits (Ebsynth)");
        pngBtn.preferredSize.height = 30;
        
        var proresLTBtn = exportGroup.add("button", undefined, "🎯 ProRes LT (WIP)");
        proresLTBtn.preferredSize.height = 30;
        
        var proresHQBtn = exportGroup.add("button", undefined, "💎 ProRes HQ (DEF)");
        proresHQBtn.preferredSize.height = 30;
        
        var renderBtn = exportGroup.add("button", undefined, "🚀 Démarrer File de Rendu");
        renderBtn.preferredSize.height = 35;
        renderBtn.graphics.font = ScriptUI.newFont("dialog", "bold", 12);
        
        // Contrôles de la file de rendu
        var queueControlGroup = exportGroup.add("group");
        queueControlGroup.orientation = "row";
        queueControlGroup.alignment = "fill";
        queueControlGroup.spacing = 5;
        
        var pauseBtn = queueControlGroup.add("button", undefined, "⏸️ Pause");
        pauseBtn.preferredSize.height = 28;
        pauseBtn.preferredSize.width = 70;
        
        var stopBtn = queueControlGroup.add("button", undefined, "⏹️ Stop");
        stopBtn.preferredSize.height = 28;
        stopBtn.preferredSize.width = 70;
        
        var statusBtn = queueControlGroup.add("button", undefined, "📊 Status");
        statusBtn.preferredSize.height = 28;
        statusBtn.preferredSize.width = 70;
        
        // Log panel
        var logGroup = mainGroup.add("panel", undefined, "Journal");
        logGroup.orientation = "column";
        logGroup.alignChildren = ["fill", "fill"];
        logGroup.margins = 10;
        
        logPanel = logGroup.add("edittext", undefined, "", {multiline: true, readonly: true});
        logPanel.preferredSize.height = 120;
        
        var clearBtn = logGroup.add("button", undefined, "🗑️ Effacer");
        
        // Référence globale pour les logs (After Effects compatible)
        $.global.logPanel = logPanel;
        
        // ================================
        // ÉVÉNEMENTS
        // ================================
        
        function updateSelectionInfo() {
            var selectedComps = CompositionManager.getSelectedCompositions();
            var info = "";
            
            if (selectedComps.length === 0) {
                info = "Aucune composition sélectionnée\n\nSélectionnez une ou plusieurs compositions dans le project panel pour activer l'export.";
                pngBtn.enabled = false;
                proresHQBtn.enabled = false;
                proresLTBtn.enabled = false;
            } else {
                info = selectedComps.length + " composition(s) sélectionnée(s):\n";
                for (var i = 0; i < selectedComps.length; i++) {
                    info += "• " + selectedComps[i].name + "\n";
                }
                pngBtn.enabled = true;
                proresHQBtn.enabled = true;
                proresLTBtn.enabled = true;
            }
            
            selectionInfo.text = info;
        }
        
        refreshBtn.onClick = function() {
            updateSelectionInfo();
            Utils.log("Sélection actualisée.");
        };
        
        pngBtn.onClick = function() {
            var selectedComps = CompositionManager.getSelectedCompositions();
            if (selectedComps.length === 0) {
                alert("Veuillez sélectionner au moins une composition dans le project panel.");
                return;
            }
            
            // Vérifier qu'aucune séquence n'est sélectionnée pour PNG
            for (var i = 0; i < selectedComps.length; i++) {
                var shot = Utils.parseShotFromComp(selectedComps[i].name);
                var compName = selectedComps[i].name;
                
                // Une séquence est détectée si pas de shot OU si le nom ne contient pas de numéro de plan
                var isSequence = !shot || (compName.indexOf("_00") === -1 && compName.indexOf("v") > 0);
                
                if (isSequence) {
                    alert("Export PNG impossible pour la séquence '" + selectedComps[i].name + "'.\n\nLes PNG sont réservés aux plans individuels (ex: SQ02_UNDLM_00035_v001).\nUtilisez ProRes pour les séquences complètes.");
                    return;
                }
            }
            
            var autoVersion = autoVersionCheckbox.value;
            Utils.log("=== Export PNG 8-bits (Ebsynth) ===");
            Utils.log("Mode auto-version: " + (autoVersion ? "Activé" : "Désactivé"));
            
            for (var i = 0; i < selectedComps.length; i++) {
                ExportManager.exportPNG8bit(selectedComps[i], autoVersion);
            }
        };
        
        proresLTBtn.onClick = function() {
            var selectedComps = CompositionManager.getSelectedCompositions();
            if (selectedComps.length === 0) {
                alert("Veuillez sélectionner au moins une composition dans le project panel.");
                return;
            }
            
            var autoVersion = autoVersionCheckbox.value;
            Utils.log("=== Export ProRes LT 1440p (WIP) ===");
            Utils.log("Mode auto-version: " + (autoVersion ? "Activé" : "Désactivé"));
            
            for (var i = 0; i < selectedComps.length; i++) {
                ExportManager.exportProRes(selectedComps[i], CONFIG.FORMATS.PRORES_LT_1440, autoVersion);
            }
        };
        
        proresHQBtn.onClick = function() {
            var selectedComps = CompositionManager.getSelectedCompositions();
            if (selectedComps.length === 0) {
                alert("Veuillez sélectionner au moins une composition dans le project panel.");
                return;
            }
            
            // Confirmation pour version définitive
            if (!confirm("Êtes-vous sûr de vouloir exporter en version définitive (DEF) ?\n\nCette version sera marquée comme finale.")) {
                return;
            }
            
            Utils.log("=== Export ProRes HQ 1440p (DEF) ===");
            for (var i = 0; i < selectedComps.length; i++) {
                ExportManager.exportProResDEF(selectedComps[i], CONFIG.FORMATS.PRORES_HQ_1440);
            }
        };
        
        renderBtn.onClick = function() {
            ExportManager.startRenderQueue();
        };
        
        pauseBtn.onClick = function() {
            ExportManager.pauseRenderQueue();
        };
        
        stopBtn.onClick = function() {
            if (confirm("Êtes-vous sûr de vouloir arrêter la file de rendu ?\n\nTous les rendus en cours seront interrompus.")) {
                ExportManager.stopRenderQueue();
            }
        };
        
        statusBtn.onClick = function() {
            var status = ExportManager.getRenderQueueStatus();
            if (status) {
                var message = "=== STATUS FILE DE RENDU ===\n";
                message += "Éléments en file: " + status.numItems + "\n";
                message += "Rendu en cours: " + (status.rendering ? "OUI" : "NON") + "\n";
                message += "Disponible pour AME: " + (status.canQueueInAME ? "OUI" : "NON");
                Utils.log(message);
            }
        };
        
        clearBtn.onClick = function() {
            logPanel.text = "";
        };
        
        // Initialisation
        updateSelectionInfo();
        Utils.log("Panel RL PostFlow v1.6.2 initialisé - Contrôles de rendu améliorés!");
        Utils.log("Sélectionnez des compositions dans le project panel pour commencer.");
        
        return mainGroup;
    }
    
    // API publique du module
    return {
        buildUI: buildUI
    };
})();

// ================================
// MODULE: APPLICATION PRINCIPALE
// ================================

var App = (function() {
    
    function createPanel(thisObj) {
        // Vérifier si c'est appelé comme un panel dockable ou comme une fenêtre
        var panel;
        
        if (thisObj instanceof Panel) {
            // Panel dockable - utiliser directement
            panel = thisObj;
        } else {
            // Fenêtre indépendante - créer une fenêtre palette (non-modale)
            panel = new Window("palette", "RL PostFlow", undefined, {resizeable: true});
        }
        
        if (panel != null) {
            var ui = UIManager.buildUI(panel);
            panel.layout.layout(true);
        }
        return panel;
    }
    
    function initialize() {
        // Création du panel
        var rlPostFlowPanel = createPanel(this);
        
        if (rlPostFlowPanel instanceof Window) {
            // Fenêtre palette - la centrer et l'afficher
            rlPostFlowPanel.center();
            rlPostFlowPanel.show();
        } else {
            // Panel dockable - juste faire le layout
            rlPostFlowPanel.layout.layout(true);
        }
        
        return rlPostFlowPanel;
    }
    
    // API publique du module
    return {
        createPanel: createPanel,
        initialize: initialize
    };
})();

// ================================
// POINT D'ENTRÉE
// ================================

// Initialisation de l'application
App.initialize();
