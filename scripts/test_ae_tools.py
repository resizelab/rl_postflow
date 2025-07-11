#!/usr/bin/env python3
"""
Test After Effects Automation
Vérifie les outils disponibles pour modifier les fichiers .aep
"""

import os
import subprocess
import sys
from pathlib import Path

def test_after_effects_command_line():
    """Test si After Effects est accessible en ligne de commande"""
    print("🎬 Test After Effects Command Line...")
    
    # Chemins possibles d'After Effects sur macOS
    ae_paths = [
        "/Applications/Adobe After Effects 2024/aerender",
        "/Applications/Adobe After Effects 2023/aerender", 
        "/Applications/Adobe After Effects CC 2024/aerender",
        "/Applications/Adobe After Effects CC 2023/aerender",
        "/Applications/Adobe After Effects CC/aerender"
    ]
    
    for ae_path in ae_paths:
        if os.path.exists(ae_path):
            print(f"   ✅ Trouvé: {ae_path}")
            try:
                # Test version
                result = subprocess.run([ae_path, "-version"], 
                                      capture_output=True, text=True, timeout=30)
                if result.returncode == 0:
                    print(f"   ✅ Version: {result.stdout.strip()}")
                    return ae_path
                else:
                    print(f"   ⚠️  Erreur version: {result.stderr}")
            except subprocess.TimeoutExpired:
                print(f"   ⚠️  Timeout lors du test de version")
            except Exception as e:
                print(f"   ❌ Erreur: {e}")
        else:
            print(f"   ❌ Non trouvé: {ae_path}")
    
    print("   ❌ After Effects non trouvé en ligne de commande")
    return None

def test_aepy_installation():
    """Test si AEPy est installé"""
    print("\n🐍 Test AEPy Installation...")
    
    try:
        import aepy
        print("   ✅ AEPy installé")
        print(f"   ✅ Version: {aepy.__version__ if hasattr(aepy, '__version__') else 'Inconnue'}")
        return True
    except ImportError:
        print("   ❌ AEPy non installé")
        print("   💡 Installation: pip install aepy")
        return False

def test_ae_to_json():
    """Test si ae-to-json est installé"""
    print("\n📦 Test ae-to-json...")
    
    try:
        result = subprocess.run(["ae-to-json", "--version"], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("   ✅ ae-to-json installé")
            print(f"   ✅ Version: {result.stdout.strip()}")
            return True
        else:
            print("   ❌ ae-to-json erreur")
            return False
    except FileNotFoundError:
        print("   ❌ ae-to-json non installé")
        print("   💡 Installation: npm install -g ae-to-json json-to-ae")
        return False
    except subprocess.TimeoutExpired:
        print("   ⚠️  Timeout ae-to-json")
        return False

def check_template_structure():
    """Vérifie la structure du template SQXX"""
    print("\n📁 Test Structure Template...")
    
    template_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX")
    
    if not template_path.exists():
        print(f"   ❌ Template non trouvé: {template_path}")
        return False
    
    print(f"   ✅ Template trouvé: {template_path}")
    
    # Chercher les fichiers .aep
    aep_files = list(template_path.rglob("*.aep"))
    print(f"   📄 Fichiers .aep trouvés: {len(aep_files)}")
    
    for aep_file in aep_files[:5]:  # Afficher les 5 premiers
        print(f"      - {aep_file.relative_to(template_path)}")
    
    if len(aep_files) > 5:
        print(f"      ... et {len(aep_files) - 5} autres")
    
    # Chercher les patterns SQXX et XXX
    patterns_found = {
        'SQXX': 0,
        'XXX': 0,
        'SQ': 0
    }
    
    for file_path in template_path.rglob("*"):
        if file_path.is_file():
            filename = file_path.name
            for pattern in patterns_found:
                if pattern in filename:
                    patterns_found[pattern] += 1
    
    print(f"   🔍 Patterns trouvés:")
    for pattern, count in patterns_found.items():
        print(f"      - {pattern}: {count} fichiers")
    
    return True

def create_test_extendscript():
    """Crée un script ExtendScript de test"""
    print("\n📝 Création Script ExtendScript de Test...")
    
    script_content = '''
// Script de test After Effects
// Affiche les informations du projet courant

try {
    app.beginUndoGroup("Test RL PostFlow");
    
    var project = app.project;
    
    alert("Projet: " + project.file.name + "\\n" +
          "Nombre d'éléments: " + project.numItems + "\\n" +
          "Version AE: " + app.version);
    
    // Liste des compositions
    var comps = [];
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof CompItem) {
            comps.push(item.name);
        }
    }
    
    if (comps.length > 0) {
        alert("Compositions trouvées:\\n" + comps.join("\\n"));
    }
    
    app.endUndoGroup();
    
} catch (error) {
    alert("Erreur: " + error.toString());
}
'''
    
    script_path = Path("/tmp/test_ae_script.jsx")
    script_path.write_text(script_content)
    
    print(f"   ✅ Script créé: {script_path}")
    print(f"   💡 Test manuel: Ouvrir un projet .aep dans AE et exécuter ce script")
    
    return script_path

def main():
    """Test principal"""
    print("🧪 Test des Outils After Effects pour RL PostFlow")
    print("=" * 60)
    
    # Tests
    ae_path = test_after_effects_command_line()
    aepy_available = test_aepy_installation()
    ae_json_available = test_ae_to_json()
    template_ok = check_template_structure()
    script_path = create_test_extendscript()
    
    # Résumé
    print("\n📊 Résumé des Tests:")
    print("=" * 30)
    
    tools_status = [
        ("After Effects CLI", "✅" if ae_path else "❌"),
        ("AEPy Python", "✅" if aepy_available else "❌"),
        ("ae-to-json", "✅" if ae_json_available else "❌"),
        ("Template SQXX", "✅" if template_ok else "❌"),
        ("Script Test", "✅")
    ]
    
    for tool, status in tools_status:
        print(f"   {status} {tool}")
    
    # Recommandations
    print("\n🎯 Recommandations:")
    
    if ae_path:
        print("   ✅ Utiliser ExtendScript + After Effects CLI (recommandé)")
    elif aepy_available:
        print("   ⚠️  Utiliser AEPy Python (alternative)")
    elif ae_json_available:
        print("   ⚠️  Utiliser ae-to-json (solution de contournement)")
    else:
        print("   ❌ Installer au moins un outil:")
        print("      - After Effects + aerender")
        print("      - pip install aepy")
        print("      - npm install -g ae-to-json")
    
    if template_ok:
        print("   ✅ Template prêt pour déploiement")
    else:
        print("   ❌ Vérifier le chemin du template SQXX")
    
    print(f"\n📝 Script de test créé: {script_path}")
    print("   💡 Testez manuellement dans After Effects pour valider")

if __name__ == "__main__":
    main()
