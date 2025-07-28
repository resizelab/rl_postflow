/*
 * Test de diagnostic LucidLink
 * Pour identifier pourquoi la détection échoue
 */

function diagnosticLucidLink() {
    var isWindows = ($.os.indexOf("Windows") >= 0);
    var isMac = !isWindows;
    
    var diagnostic = "🔍 DIAGNOSTIC LUCIDLINK\n";
    diagnostic += "══════════════════════════════════════\n\n";
    diagnostic += "🖥️ Système détecté: " + (isWindows ? "Windows" : "macOS") + "\n";
    diagnostic += "🛠️ $.os: " + $.os + "\n\n";
    
    var driveLetters = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    diagnostic += "📁 TEST DES LECTEURS:\n";
    diagnostic += "─────────────────────\n";
    
    var foundPaths = [];
    
    for (var i = 0; i < driveLetters.length; i++) {
        var letter = driveLetters[i];
        
        // Test 1: Lecteur de base
        var drivePath = letter + ":/";
        var driveFolder = new Folder(drivePath);
        var driveExists = driveFolder.exists;
        
        diagnostic += letter + ":/ -> " + (driveExists ? "✅ EXISTE" : "❌ N'EXISTE PAS") + "\n";
        
        if (driveExists) {
            // Test 2: Dossier Volumes
            var volumesPath = letter + ":/Volumes";
            var volumesFolder = new Folder(volumesPath);
            var volumesExists = volumesFolder.exists;
            
            diagnostic += "  " + volumesPath + " -> " + (volumesExists ? "✅ EXISTE" : "❌ N'EXISTE PAS") + "\n";
            
            if (volumesExists) {
                // Test 3: Dossier resizelab
                var resizelabPath = letter + ":/Volumes/resizelab";
                var resizelabFolder = new Folder(resizelabPath);
                var resizelabExists = resizelabFolder.exists;
                
                diagnostic += "  " + resizelabPath + " -> " + (resizelabExists ? "✅ EXISTE" : "❌ N'EXISTE PAS") + "\n";
                
                if (resizelabExists) {
                    // Test 4: Dossier o2b-undllm
                    var o2bPath = letter + ":/Volumes/resizelab/o2b-undllm";
                    var o2bFolder = new Folder(o2bPath);
                    var o2bExists = o2bFolder.exists;
                    
                    diagnostic += "  " + o2bPath + " -> " + (o2bExists ? "✅ EXISTE" : "❌ N'EXISTE PAS") + "\n";
                    
                    if (o2bExists) {
                        foundPaths.push(o2bPath);
                        
                        // Test 5: Structure interne
                        var structure = [
                            { name: "2_IN", path: o2bPath + "/2_IN" },
                            { name: "_ELEMENTS", path: o2bPath + "/_ELEMENTS" },
                            { name: "4_OUT", path: o2bPath + "/4_OUT" }
                        ];
                        
                        for (var j = 0; j < structure.length; j++) {
                            var structFolder = new Folder(structure[j].path);
                            var structExists = structFolder.exists;
                            diagnostic += "    " + structure[j].name + " -> " + (structExists ? "✅ EXISTE" : "❌ N'EXISTE PAS") + "\n";
                        }
                        
                        // Test 6: Panel
                        var panelPath = o2bPath + "/2_IN/_ELEMENTS/TOOLS/ae_panel_script/RL_PostFlow_Panel.jsx";
                        var panelFile = new File(panelPath);
                        var panelExists = panelFile.exists;
                        diagnostic += "    Panel -> " + (panelExists ? "✅ TROUVÉ" : "❌ NON TROUVÉ") + "\n";
                    }
                }
            }
        }
        diagnostic += "\n";
    }
    
    diagnostic += "🎯 RÉSUMÉ:\n";
    diagnostic += "─────────\n";
    diagnostic += "Chemins LucidLink trouvés: " + foundPaths.length + "\n";
    
    if (foundPaths.length > 0) {
        for (var i = 0; i < foundPaths.length; i++) {
            diagnostic += "• " + foundPaths[i] + "\n";
        }
    } else {
        diagnostic += "❌ AUCUN CHEMIN LUCIDLINK TROUVÉ\n\n";
        diagnostic += "💡 VÉRIFICATIONS:\n";
        diagnostic += "• LucidLink est-il démarré ?\n";
        diagnostic += "• Le montage resizelab est-il connecté ?\n";
        diagnostic += "• Y a-t-il des fichiers dans E:/Volumes/resizelab/ ?\n";
    }
    
    alert(diagnostic);
}

// Exécuter le diagnostic
diagnosticLucidLink();
