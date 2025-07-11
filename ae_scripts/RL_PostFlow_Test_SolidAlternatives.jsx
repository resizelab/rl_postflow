// ==========================================
// Test Spécifique - Alternatives pour créer des Solids
// After Effects 2025 - Recherche de nouvelles API
// ==========================================

alert("🎯 TEST ALTERNATIVES SOLIDS - After Effects 2025");

// Test 1: Méthode classique (pour comparaison)
try {
    alert("TEST 1 - Méthode classique addSolid:\n" +
          "app.project.items.addSolid: " + typeof app.project.items.addSolid);
} catch (e) {
    alert("TEST 1 - Erreur: " + e.message);
}

// Test 2: Via FootageItem et SolidSource
try {
    alert("TEST 2 - Classes Solid/Footage:\n" +
          "FootageItem: " + (typeof FootageItem !== "undefined" ? "disponible" : "non disponible") + "\n" +
          "SolidSource: " + (typeof SolidSource !== "undefined" ? "disponible" : "non disponible"));
} catch (e) {
    alert("TEST 2 - Erreur: " + e.message);
}

// Test 3: Explorer app.project directement
try {
    var projectMethods = [];
    for (var prop in app.project) {
        if (typeof app.project[prop] === "function" && 
            (prop.toLowerCase().indexOf("add") !== -1 || 
             prop.toLowerCase().indexOf("create") !== -1 ||
             prop.toLowerCase().indexOf("solid") !== -1)) {
            projectMethods.push(prop);
        }
    }
    
    alert("TEST 3 - Méthodes app.project (création):\n" + 
          (projectMethods.length > 0 ? projectMethods.join(", ") : "Aucune trouvée"));
} catch (e) {
    alert("TEST 3 - Erreur: " + e.message);
}

// Test 4: Explorer app lui-même
try {
    var appMethods = [];
    for (var prop in app) {
        if (typeof app[prop] === "function" && 
            (prop.toLowerCase().indexOf("create") !== -1 ||
             prop.toLowerCase().indexOf("solid") !== -1)) {
            appMethods.push(prop);
        }
    }
    
    alert("TEST 4 - Méthodes app (création):\n" + 
          (appMethods.length > 0 ? appMethods.join(", ") : "Aucune trouvée"));
} catch (e) {
    alert("TEST 4 - Erreur: " + e.message);
}

// Test 5: Test création via composition et layers
try {
    // Créer comp temporaire
    var testComp = app.project.items.addComp("SOLID_TEST", 1920, 1080, 1.0, 5.0, 25);
    
    var layerMethods = [];
    for (var prop in testComp.layers) {
        if (typeof testComp.layers[prop] === "function") {
            layerMethods.push(prop);
        }
    }
    
    alert("TEST 5 - Méthodes testComp.layers (" + layerMethods.length + "):\n" + 
          layerMethods.slice(0, 15).join(", ") + 
          (layerMethods.length > 15 ? "\n... +" + (layerMethods.length - 15) + " autres" : ""));
    
    // Test création solid via layers
    var solidMethods = [];
    for (var i = 0; i < layerMethods.length; i++) {
        if (layerMethods[i].toLowerCase().indexOf("solid") !== -1 ||
            layerMethods[i].toLowerCase().indexOf("add") !== -1) {
            solidMethods.push(layerMethods[i]);
        }
    }
    
    alert("TEST 5b - Méthodes layers liées solid/add:\n" + 
          (solidMethods.length > 0 ? solidMethods.join(", ") : "Aucune trouvée"));
    
    // Nettoyer
    testComp.remove();
    
} catch (e) {
    alert("TEST 5 - Erreur: " + e.message);
}

// Test 6: Essayer d'autres approches connues
alert("TEST 6 - Tests directs de syntaxes alternatives...");

var testResults = [];

// Test 6a: Ancienne syntaxe
try {
    var result = typeof project.items.addSolid;
    testResults.push("project.items.addSolid: " + result);
} catch (e) {
    testResults.push("project.items.addSolid: erreur");
}

// Test 6b: Via app.project.importFile avec solid
try {
    var result = typeof app.project.importFile;
    testResults.push("app.project.importFile: " + result);
} catch (e) {
    testResults.push("app.project.importFile: erreur");
}

// Test 6c: Via new File/FootageItem
try {
    var result = typeof FootageItem;
    testResults.push("new FootageItem: " + result);
} catch (e) {
    testResults.push("new FootageItem: erreur");
}

alert("TEST 6 - Résultats tests directs:\n" + testResults.join("\n"));

// Test 7: Version After Effects et compatibilité
try {
    var versionInfo = "Version AE: " + app.version + "\n" +
                     "Build: " + app.buildName + "\n" +
                     "Langue: " + app.isoLanguage;
    alert("TEST 7 - Info After Effects:\n" + versionInfo);
} catch (e) {
    alert("TEST 7 - Erreur version: " + e.message);
}

alert("✅ TESTS TERMINÉS - Analyser les résultats pour trouver l'alternative à addSolid");
