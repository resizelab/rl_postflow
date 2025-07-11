// ==========================================
// Test Complet - Exploration API After Effects 2025
// Objectif: Trouver la méthode pour créer des solids
// ==========================================

alert("🔍 DÉBUT DES TESTS API AFTER EFFECTS 2025");

// Test 1: Vérifications de base
alert("📋 TEST 1 - Vérifications de base:\n" +
      "• app.project existe: " + (app.project != null) + "\n" +
      "• app.project.items existe: " + (app.project.items != null) + "\n" +
      "• Type de app.project.items: " + typeof app.project.items);

// Test 2: Explorer toutes les méthodes disponibles sur app.project.items
var itemsMethods = [];
var itemsProperties = [];

for (var prop in app.project.items) {
    try {
        if (typeof app.project.items[prop] === "function") {
            itemsMethods.push(prop);
        } else {
            itemsProperties.push(prop + ": " + typeof app.project.items[prop]);
        }
    } catch (e) {
        // Ignorer les propriétés inaccessibles
    }
}

alert("📋 TEST 2 - Méthodes disponibles sur app.project.items (" + itemsMethods.length + " trouvées):\n" +
      itemsMethods.slice(0, 10).join(", ") + 
      (itemsMethods.length > 10 ? "\n... et " + (itemsMethods.length - 10) + " autres" : ""));

// Test 3: Recherche spécifique de méthodes liées aux solids
var solidRelatedMethods = [];
for (var i = 0; i < itemsMethods.length; i++) {
    var method = itemsMethods[i];
    if (method.toLowerCase().indexOf("solid") !== -1 || 
        method.toLowerCase().indexOf("add") !== -1 ||
        method.toLowerCase().indexOf("create") !== -1) {
        solidRelatedMethods.push(method);
    }
}

alert("📋 TEST 3 - Méthodes liées aux solids/création:\n" + 
      (solidRelatedMethods.length > 0 ? solidRelatedMethods.join(", ") : "Aucune trouvée"));

// Test 4: Explorer les méthodes add* spécifiquement
var addMethods = [];
for (var i = 0; i < itemsMethods.length; i++) {
    var method = itemsMethods[i];
    if (method.toLowerCase().indexOf("add") === 0) {
        addMethods.push(method);
    }
}

alert("📋 TEST 4 - Méthodes add* disponibles:\n" + 
      (addMethods.length > 0 ? addMethods.join(", ") : "Aucune trouvée"));

// Test 5: Tester les méthodes add courantes
var testResults = [];

// Test addComp
try {
    if (typeof app.project.items.addComp === "function") {
        testResults.push("✅ addComp: disponible");
    } else {
        testResults.push("❌ addComp: non disponible");
    }
} catch (e) {
    testResults.push("❌ addComp: erreur - " + e.message);
}

// Test addFolder
try {
    if (typeof app.project.items.addFolder === "function") {
        testResults.push("✅ addFolder: disponible");
    } else {
        testResults.push("❌ addFolder: non disponible");
    }
} catch (e) {
    testResults.push("❌ addFolder: erreur - " + e.message);
}

alert("📋 TEST 5 - Tests méthodes courantes:\n" + testResults.join("\n"));

// Test 6: Explorer les constantes et enums
var constants = [];
try {
    if (typeof FootageItem !== "undefined") constants.push("FootageItem");
    if (typeof CompItem !== "undefined") constants.push("CompItem");
    if (typeof FolderItem !== "undefined") constants.push("FolderItem");
    if (typeof SolidSource !== "undefined") constants.push("SolidSource");
} catch (e) {
    // Ignorer
}

alert("📋 TEST 6 - Classes/Types disponibles:\n" + 
      (constants.length > 0 ? constants.join(", ") : "Types de base non détectés"));

// Test 7: Chercher dans la documentation intégrée
var helpInfo = "";
try {
    if (app.project.items.toString) {
        helpInfo = "toString: " + app.project.items.toString();
    }
} catch (e) {
    helpInfo = "Pas d'info toString disponible";
}

alert("📋 TEST 7 - Info objet items:\n" + helpInfo);

// Test 8: Explorer les alternatives possibles
alert("📋 TEST 8 - Tests alternatifs pour création solids...");

// Test via Layer/Composition
var altMethods = [];
try {
    // Créer une comp temporaire pour tester
    var tempComp = app.project.items.addComp("TEST_TEMP", 100, 100, 1.0, 1.0, 25);
    
    // Explorer les méthodes de layers
    for (var prop in tempComp.layers) {
        if (typeof tempComp.layers[prop] === "function" && 
            (prop.toLowerCase().indexOf("add") !== -1 || prop.toLowerCase().indexOf("solid") !== -1)) {
            altMethods.push("layers." + prop);
        }
    }
    
    // Nettoyer
    tempComp.remove();
    
} catch (e) {
    altMethods.push("Erreur test composition: " + e.message);
}

alert("📋 TEST 8 - Méthodes alternatives (layers):\n" + 
      (altMethods.length > 0 ? altMethods.join(", ") : "Aucune trouvée"));

alert("🏁 FIN DES TESTS - Voir résultats ci-dessus");