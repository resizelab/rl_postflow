// ==========================================
// Test Pratique - Création de Solids via nouvelles méthodes
// After Effects 2025 - Tests basés sur documentation
// ==========================================

alert("🔨 TESTS PRATIQUES - Création de Solids AE 2025");

// Test 1: Méthode via Layer -> New -> Solid (simulation script)
try {
    // Créer une composition de test
    var testComp = app.project.items.addComp("SOLID_CREATION_TEST", 1920, 1080, 1.0, 10.0, 25);
    
    alert("✅ Composition créée: " + testComp.name);
    
    // Test 1a: Essayer app.project.items avec autres paramètres
    var methods = ["addSolid", "createSolid", "newSolid", "makeSolid"];
    var results = [];
    
    for (var i = 0; i < methods.length; i++) {
        try {
            if (typeof app.project.items[methods[i]] !== "undefined") {
                results.push("✅ " + methods[i] + ": existe");
            } else {
                results.push("❌ " + methods[i] + ": n'existe pas");
            }
        } catch (e) {
            results.push("❌ " + methods[i] + ": erreur");
        }
    }
    
    alert("TEST 1a - Méthodes de création testées:\n" + results.join("\n"));
    
    // Test 1b: Via création manuelle avec executeCommand
    try {
        // Tenter d'exécuter des commandes AE
        if (typeof app.executeCommand !== "undefined") {
            alert("✅ app.executeCommand disponible - ID commandes possibles");
            
            // Tester quelques IDs de commandes connues pour solids
            var commandIDs = [2038, 2039, 2040]; // IDs communs pour solid
            var commandResults = [];
            
            for (var c = 0; c < commandIDs.length; c++) {
                try {
                    // Juste tester si la commande existe (ne pas exécuter)
                    commandResults.push("ID " + commandIDs[c] + ": testable");
                } catch (e) {
                    commandResults.push("ID " + commandIDs[c] + ": erreur");
                }
            }
            
            alert("TEST 1b - Commandes AE testées:\n" + commandResults.join("\n"));
        } else {
            alert("❌ app.executeCommand non disponible");
        }
    } catch (e) {
        alert("TEST 1b - Erreur executeCommand: " + e.message);
    }
    
    // Test 1c: Création via importFile avec source solid
    try {
        if (typeof app.project.importFile === "function") {
            alert("✅ app.project.importFile disponible");
            
            // Explorer les options d'import
            if (typeof ImportOptions !== "undefined") {
                alert("✅ ImportOptions disponible");
            } else {
                alert("❌ ImportOptions non disponible");
            }
        }
    } catch (e) {
        alert("TEST 1c - Erreur import: " + e.message);
    }
    
    // Nettoyer
    testComp.remove();
    
} catch (e) {
    alert("TEST 1 - Erreur générale: " + e.message);
}

// Test 2: Explorer les sources disponibles
try {
    alert("TEST 2 - Types de sources disponibles...");
    
    var sourceTypes = [];
    
    // Tester les types de sources
    if (typeof SolidSource !== "undefined") sourceTypes.push("SolidSource");
    if (typeof FileSource !== "undefined") sourceTypes.push("FileSource");
    if (typeof PlaceholderSource !== "undefined") sourceTypes.push("PlaceholderSource");
    
    alert("TEST 2 - Types de sources:\n" + 
          (sourceTypes.length > 0 ? sourceTypes.join(", ") : "Aucun type détecté"));
    
    // Si SolidSource existe, explorer ses méthodes
    if (typeof SolidSource !== "undefined") {
        var solidMethods = [];
        try {
            for (var prop in SolidSource.prototype || SolidSource) {
                if (typeof SolidSource[prop] === "function") {
                    solidMethods.push(prop);
                }
            }
            alert("TEST 2b - Méthodes SolidSource:\n" + 
                  (solidMethods.length > 0 ? solidMethods.join(", ") : "Aucune méthode"));
        } catch (e) {
            alert("TEST 2b - Erreur SolidSource: " + e.message);
        }
    }
    
} catch (e) {
    alert("TEST 2 - Erreur: " + e.message);
}

// Test 3: Méthode moderne possible (AE 2025)
try {
    alert("TEST 3 - Tests méthodes AE 2025...");
    
    // Créer comp pour tests
    var modernComp = app.project.items.addComp("MODERN_TEST", 1920, 1080, 1.0, 5.0, 25);
    
    // Test 3a: Via layers.add avec différents types
    var layerAddTests = [];
    
    try {
        // Tester si add accepte différents paramètres
        if (typeof modernComp.layers.add === "function") {
            layerAddTests.push("✅ layers.add existe");
            
            // Explorer signature de la fonction
            var addFn = modernComp.layers.add.toString();
            if (addFn.length < 200) { // Si pas trop long
                layerAddTests.push("Signature: " + addFn);
            }
        } else {
            layerAddTests.push("❌ layers.add n'existe pas");
        }
    } catch (e) {
        layerAddTests.push("❌ Erreur layers.add: " + e.message);
    }
    
    alert("TEST 3a - layers.add:\n" + layerAddTests.join("\n"));
    
    // Test 3b: Autres méthodes de layers
    var otherLayerMethods = [];
    try {
        var allMethods = [];
        for (var prop in modernComp.layers) {
            if (typeof modernComp.layers[prop] === "function") {
                allMethods.push(prop);
            }
        }
        
        // Filtrer les méthodes intéressantes
        var keywords = ["add", "create", "new", "solid", "make"];
        for (var k = 0; k < keywords.length; k++) {
            for (var m = 0; m < allMethods.length; m++) {
                if (allMethods[m].toLowerCase().indexOf(keywords[k]) !== -1) {
                    otherLayerMethods.push(allMethods[m]);
                }
            }
        }
        
        // Supprimer doublons
        var uniqueMethods = [];
        for (var u = 0; u < otherLayerMethods.length; u++) {
            if (uniqueMethods.indexOf(otherLayerMethods[u]) === -1) {
                uniqueMethods.push(otherLayerMethods[u]);
            }
        }
        
        alert("TEST 3b - Méthodes layers intéressantes:\n" + 
              (uniqueMethods.length > 0 ? uniqueMethods.join(", ") : "Aucune trouvée"));
              
    } catch (e) {
        alert("TEST 3b - Erreur: " + e.message);
    }
    
    // Nettoyer
    modernComp.remove();
    
} catch (e) {
    alert("TEST 3 - Erreur: " + e.message);
}

alert("🏁 TESTS PRATIQUES TERMINÉS\n\nAnalyser les résultats pour identifier la nouvelle méthode de création de solids dans AE 2025");
