/*
 * RL PostFlow Panel -         report += "🖥️ Système détecté: " + system.name + "\n";
        report += "🔍 Méthode: " + system.detection + "\n";
        report += "📍 Version AE: " + app.buildName + " " + app.version + "\n";
        report += "🛠️ $.os: " + system.os + "\n\n";ALLEUR COMPLET
 * Installation complète en une seule fois : Panel + Templates + Configuration
 * Version: 1.6.2
 */

function installRLPostFlowComplete() {
    try {
        var welcomeMsg = "🎬 INSTALLEUR RL POSTFLOW COMPLET\n" +
                        "══════════════════════════════════════\n\n" +
                        "Cet installeur va configurer automatiquement :\n\n" +
                        "✅ Panel RL PostFlow v1.6.2 (interface)\n" +
                        "✅ Templates PNG 8-bits et ProRes\n" +
                        "✅ Auto-versioning intelligent avec renommage\n" +
                        "✅ Détection LucidLink automatique\n" +
                        "✅ Configuration macOS/Windows\n\n" +
                        "⚠️ IMPORTANT: Fermez After Effects avant de continuer.\n\n" +
                        "Démarrer l'installation complète ?";
        
        if (!confirm(welcomeMsg)) {
            return false;
        }
        
        // === PHASE 1: DÉTECTION SYSTÈME ===
        var system = detectSystem();
        var report = "📋 RAPPORT INSTALLATION RL POSTFLOW v1.6.2\n";
        report += "══════════════════════════════════════\n\n";
        report += "🖥️ Système détecté: " + system.name + "\n";
        report += "� Méthode: " + system.detection + "\n";
        report += "�📍 Version AE: " + app.buildName + " " + app.version + "\n";
        report += "🛠️ $.os: " + system.os + "\n\n";
        
        // === PHASE 2: VÉRIFICATION LUCIDLINK ===
        report += "🔍 PHASE 1: VÉRIFICATION LUCIDLINK\n";
        report += "─────────────────────────────────────\n";
        
        var lucidInfo = detectLucidLink(system);
        if (!lucidInfo) {
            alert("❌ ERREUR CRITIQUE: LucidLink non détecté\n\n" +
                  "Vérifiez que LucidLink est monté :\n" +
                  "• macOS: /Volumes/resizelab/\n" +
                  "• Windows: [Lettre]:/Volumes/resizelab/\n\n" +
                  "Installation interrompue.");
            return false;
        }
        
        report += "✅ LucidLink détecté: " + lucidInfo.basePath + "\n";
        if (lucidInfo.panelPath) {
            report += "✅ Panel trouvé: " + lucidInfo.panelPath + "\n";
        } else {
            report += "⚠️ Panel non trouvé - recherche dynamique en cours\n";
        }
        report += "\n";
        
        // === PHASE 3: INSTALLATION PANEL ===
        report += "🔧 PHASE 2: INSTALLATION PANEL\n";
        report += "─────────────────────────────────────\n";
        
        var panelInstall = installPanel(system, lucidInfo);
        if (panelInstall.success) {
            report += "✅ Panel installé: " + panelInstall.path + "\n";
            report += "📄 Fichier: RL_PostFlow_Panel.jsx (" + panelInstall.size + " KB)\n";
        } else {
            report += "⚠️ Panel: " + panelInstall.error + "\n";
            report += "💡 Alternative: Installation User Presets disponible\n";
        }
        report += "\n";
        
        // === PHASE 4: INSTALLATION TEMPLATES ===
        report += "🎨 PHASE 3: INSTALLATION TEMPLATES\n";
        report += "─────────────────────────────────────\n";
        
        var templatesInstall = installTemplates(system, lucidInfo);
        if (templatesInstall.success) {
            report += "✅ Templates installés: " + templatesInstall.count + " fichiers\n";
            for (var i = 0; i < templatesInstall.files.length; i++) {
                report += "   • " + templatesInstall.files[i] + "\n";
            }
        } else {
            report += "⚠️ Templates: " + templatesInstall.error + "\n";
            report += "💡 Le panel fonctionne sans templates (config manuelle)\n";
        }
        report += "\n";
        
        // === PHASE 5: CONFIGURATION ===
        report += "⚙️ PHASE 4: CONFIGURATION FINALE\n";
        report += "─────────────────────────────────────\n";
        
        var hasPanel = panelInstall.success;
        var hasTemplates = templatesInstall.success;
        
        if (hasPanel && hasTemplates) {
            report += "🎉 INSTALLATION COMPLÈTE RÉUSSIE!\n\n";
            report += "🚀 ACTIVATION:\n";
            report += "1. Redémarrez After Effects\n";
            report += "2. Window → RL PostFlow Panel\n";
            report += "3. Dockez le panel dans votre interface\n\n";
            report += "🎯 WORKFLOW PRÊT:\n";
            report += "• Auto-versioning: v001 → v002 → v003\n";
            report += "• Export PNG: Templates automatiques\n";
            report += "• Export ProRes: � LT (WIP) / 💎 HQ (DEF)\n";
            report += "• Structure: Compatible animation RL\n\n";
        } else if (hasPanel && !hasTemplates) {
            report += "✅ INSTALLATION PANEL RÉUSSIE!\n\n";
            report += "🚀 ACTIVATION:\n";
            report += "1. Redémarrez After Effects\n";
            report += "2. Window → RL PostFlow Panel\n\n";
            report += "⚠️ TEMPLATES:\n";
            report += "• Panel fonctionne en mode manuel\n";
            report += "• Créez vos templates PNG/ProRes si besoin\n\n";
        } else if (!hasPanel && hasTemplates) {
            report += "✅ TEMPLATES INSTALLÉS!\n\n";
            report += "🚀 ACTIVATION:\n";
            report += "1. File → Scripts → Run Script File...\n";
            report += "2. Naviguez vers: " + (panelInstall.fallbackPath || "User Presets") + "\n";
            report += "3. Sélectionnez: RL_PostFlow_Panel.jsx\n\n";
        } else {
            report += "⚠️ INSTALLATION PARTIELLE\n\n";
            report += "💡 SOLUTIONS:\n";
            report += "• Permissions: Exécutez en administrateur\n";
            report += "• Alternative: Utilisez install_macos_user.jsx\n";
            report += "• Manuel: Copiez les fichiers depuis LucidLink\n\n";
        }
        
        report += "📁 FICHIERS SOURCES: " + (lucidInfo.panelPath || lucidInfo.basePath + "ae_panel_script/") + "\n";
        report += "🎬 RL PostFlow " + (hasPanel ? "installé" : "disponible") + " pour animation !";
        
        alert(report);
        return hasPanel || hasTemplates;
        
    } catch (error) {
        alert("❌ ERREUR INSTALLATION: " + error.toString() + "\n\n" +
              "💡 Essayez l'installation manuelle ou contactez le support.");
        return false;
    }
}

function detectSystem() {
    // DÉTECTION PRIMAIRE via chemins système spécifiques
    var testMacVolumes = new Folder("/Volumes");
    var testMacApps = new Folder("/Applications");
    var testMacUsers = new Folder("/Users");
    var testWinProgramFiles = new Folder("C:/Program Files");
    var testWinWindows = new Folder("C:/Windows");
    
    var isMac = false;
    var isWindows = false;
    
    // Test macOS d'abord - critères stricts
    if (testMacVolumes.exists && testMacUsers.exists) {
        // Double vérification : /Volumes ET /Users = vraiment macOS
        isMac = true;
        isWindows = false;
    } 
    else if (testMacApps.exists && testMacVolumes.exists) {
        // Alternative : /Applications ET /Volumes
        isMac = true;
        isWindows = false;
    }
    // Test Windows seulement si macOS PAS détecté
    else if (testWinProgramFiles.exists || testWinWindows.exists) {
        isMac = false;
        isWindows = true;
    }
    // Fallback $.os si aucun test physique concluant
    else {
        var osString = $.os.toLowerCase();
        isMac = osString.indexOf("mac") >= 0 || osString.indexOf("macintosh") >= 0;
        isWindows = osString.indexOf("windows") >= 0;
    }
    
    return {
        isWindows: isWindows,
        isMac: isMac,
        name: isMac ? "macOS" : (isWindows ? "Windows" : "Inconnu"),
        os: $.os
    };
}

function detectLucidLink(system) {
    var basePaths = [];
    
    if (system.isMac) {
        basePaths.push("/Volumes/resizelab/o2b-undllm/");
    } else if (system.isWindows) {
        var drives = ["E:", "F:", "G:", "H:", "I:", "J:", "K:", "L:"];
        for (var i = 0; i < drives.length; i++) {
            basePaths.push(drives[i] + "/Volumes/resizelab/o2b-undllm/");
        }
    }
    
    // Tester chaque chemin de base et trouver le dossier ae_panel_script
    for (var i = 0; i < basePaths.length; i++) {
        var testFolder = new Folder(basePaths[i]);
        if (testFolder.exists) {
            // Chercher ae_panel_script dans différents emplacements possibles
            var possiblePaths = [
                basePaths[i] + "2_IN/_ELEMENTS/TOOLS/ae_panel_script/",
                basePaths[i] + "4_OUT/2_FROM_ANIM/_TOOLS/ae_panel_script/",
                basePaths[i] + "_TOOLS/ae_panel_script/"
            ];
            
            for (var j = 0; j < possiblePaths.length; j++) {
                var panelFolder = new Folder(possiblePaths[j]);
                var panelFile = new File(possiblePaths[j] + "RL_PostFlow_Panel.jsx");
                if (panelFolder.exists && panelFile.exists) {
                    return {
                        basePath: basePaths[i],
                        panelPath: possiblePaths[j]
                    };
                }
            }
            
            // Si on trouve la base mais pas le panel, retourner quand même la base
            return {
                basePath: basePaths[i],
                panelPath: null
            };
        }
    }
    return null;
}

function installPanel(system, lucidInfo) {
    try {
        // Utiliser le chemin détecté automatiquement ou rechercher
        var sourcePath;
        if (lucidInfo.panelPath) {
            sourcePath = lucidInfo.panelPath + "RL_PostFlow_Panel.jsx";
        } else {
            // Recherche dans les emplacements possibles
            var possiblePaths = [
                lucidInfo.basePath + "2_IN/_ELEMENTS/TOOLS/ae_panel_script/RL_PostFlow_Panel.jsx",
                lucidInfo.basePath + "4_OUT/2_FROM_ANIM/_TOOLS/ae_panel_script/RL_PostFlow_Panel.jsx",
                lucidInfo.basePath + "_TOOLS/ae_panel_script/RL_PostFlow_Panel.jsx"
            ];
            
            for (var i = 0; i < possiblePaths.length; i++) {
                var testFile = new File(possiblePaths[i]);
                if (testFile.exists) {
                    sourcePath = possiblePaths[i];
                    break;
                }
            }
        }
        
        if (!sourcePath) {
            return { success: false, error: "Fichier panel non trouvé sur LucidLink" };
        }
        
        var sourceFile = new File(sourcePath);
        
        if (!sourceFile.exists) {
            return { success: false, error: "Fichier panel non trouvé sur LucidLink" };
        }
        
        // Destinations possibles
        var destinations = [];
        if (system.isMac) {
            destinations = [
                "/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/",
                "/Applications/Adobe After Effects 2024/Scripts/ScriptUI Panels/"
            ];
        } else if (system.isWindows) {
            destinations = [
                "C:/Program Files/Adobe/Adobe After Effects 2025/Scripts/ScriptUI Panels/",
                "C:/Program Files (x86)/Adobe/Adobe After Effects 2025/Scripts/ScriptUI Panels/"
            ];
        }
        
        // Essayer l'installation dans les dossiers système
        for (var i = 0; i < destinations.length; i++) {
            var destFolder = new Folder(destinations[i]);
            if (destFolder.exists) {
                try {
                    var destFile = new File(destinations[i] + "RL_PostFlow_Panel.jsx");
                    if (sourceFile.copy(destFile) && destFile.exists) {
                        var fileSize = Math.round(destFile.length / 1024 * 100) / 100;
                        return { 
                            success: true, 
                            path: destinations[i],
                            size: fileSize
                        };
                    }
                } catch (e) {
                    // Continuer avec le dossier suivant
                }
            }
        }
        
        // Fallback: User Presets
        var userPath = Folder.myDocuments.fsName + 
                      (system.isMac ? "/Adobe/After Effects 2025/User Presets/" : 
                                     "\\Adobe\\After Effects 2025\\User Presets\\");
        var userFolder = new Folder(userPath);
        if (!userFolder.exists) userFolder.create();
        
        var userFile = new File(userPath + "RL_PostFlow_Panel.jsx");
        if (sourceFile.copy(userFile) && userFile.exists) {
            var fileSize = Math.round(userFile.length / 1024 * 100) / 100;
            return { 
                success: true, 
                path: userPath,
                size: fileSize,
                fallbackPath: userPath,
                isUserPresets: true
            };
        }
        
        return { success: false, error: "Impossible de copier le panel" };
        
    } catch (error) {
        return { success: false, error: error.toString() };
    }
}

function installTemplates(system, lucidInfo) {
    try {
        // Fichiers source templates
        var templateFiles = [
            { name: "RL PostFlow.aom", desc: "Output Modules (PNG 8-bits + ProRes LT/HQ)" },
            { name: "RL PostFlow.ars", desc: "Render Settings (PNG 12.5 fps + ProRes)" }
        ];
        
        // Destination User Presets
        var destPath = Folder.myDocuments.fsName + 
                      (system.isMac ? "/Adobe/After Effects 2025/User Presets/" : 
                                     "\\Adobe\\After Effects 2025\\User Presets\\");
        var destFolder = new Folder(destPath);
        if (!destFolder.exists) destFolder.create();
        
        var installedFiles = [];
        var successCount = 0;
        
        for (var i = 0; i < templateFiles.length; i++) {
            var template = templateFiles[i];
            var sourcePath;
            
            // Recherche dynamique des templates
            if (lucidInfo.panelPath) {
                sourcePath = lucidInfo.panelPath + "templates/" + template.name;
            } else {
                // Recherche dans les emplacements possibles
                var possiblePaths = [
                    lucidInfo.basePath + "2_IN/_ELEMENTS/TOOLS/ae_panel_script/templates/" + template.name,
                    lucidInfo.basePath + "4_OUT/2_FROM_ANIM/_TOOLS/ae_panel_script/templates/" + template.name,
                    lucidInfo.basePath + "_TOOLS/ae_panel_script/templates/" + template.name
                ];
                
                for (var j = 0; j < possiblePaths.length; j++) {
                    var testFile = new File(possiblePaths[j]);
                    if (testFile.exists) {
                        sourcePath = possiblePaths[j];
                        break;
                    }
                }
            }
            
            if (sourcePath) {
                var sourceFile = new File(sourcePath);
                if (sourceFile.exists) {
                    var destFile = new File(destPath + template.name);
                    if (sourceFile.copy(destFile) && destFile.exists) {
                        installedFiles.push(template.name + " (" + template.desc + ")");
                        successCount++;
                    }
                }
            }
        }
        
        if (successCount > 0) {
            return { 
                success: true, 
                count: successCount,
                files: installedFiles
            };
        } else {
            return { success: false, error: "Aucun fichier template trouvé sur LucidLink" };
        }
        
    } catch (error) {
        return { success: false, error: error.toString() };
    }
}

// === POINT D'ENTRÉE ===
installRLPostFlowComplete();
