#!/usr/bin/env python3
"""
Test du Fichier Template After Effects
Analyse et test du fichier SQXX_01.aep
"""

import os
import shutil
import subprocess
import tempfile
from pathlib import Path
import time

# Chemin du template AE
TEMPLATE_AE_FILE = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/_AE/SQXX_01.aep")

def test_ae_file_access():
    """Test l'accès au fichier template After Effects."""
    
    print("🎬 TEST FICHIER TEMPLATE AFTER EFFECTS")
    print("=" * 50)
    
    # Vérifier existence
    print(f"📁 Chemin : {TEMPLATE_AE_FILE}")
    
    if not TEMPLATE_AE_FILE.exists():
        print("❌ Fichier template introuvable")
        return False
    
    print("✅ Fichier template trouvé")
    
    # Informations fichier
    stat = TEMPLATE_AE_FILE.stat()
    size_mb = stat.st_size / (1024 * 1024)
    modified = time.ctime(stat.st_mtime)
    
    print(f"📊 Taille : {size_mb:.1f} MB")
    print(f"📅 Modifié : {modified}")
    print(f"🔐 Permissions : {oct(stat.st_mode)[-3:]}")
    
    return True

def test_ae_binary_analysis():
    """Analyse binaire basique du fichier .aep."""
    
    print(f"\n🔍 ANALYSE BINAIRE DU FICHIER")
    print("-" * 30)
    
    try:
        with open(TEMPLATE_AE_FILE, 'rb') as f:
            # Lire les premiers 1024 bytes
            header = f.read(1024)
            
        print(f"📄 Header (premiers 100 bytes) :")
        
        # Afficher en hexadécimal
        hex_dump = ' '.join(f'{b:02x}' for b in header[:100])
        print(f"   Hex: {hex_dump}")
        
        # Chercher des chaînes lisibles
        readable_chars = ''.join(chr(b) if 32 <= b <= 126 else '.' for b in header)
        print(f"   ASCII: {readable_chars[:100]}")
        
        # Chercher des patterns spécifiques
        content = header.decode('utf-8', errors='ignore')
        
        patterns = ['SQXX', 'XXX', 'UNDLM', 'Adobe After Effects']
        found_patterns = []
        
        for pattern in patterns:
            if pattern in content:
                found_patterns.append(pattern)
        
        if found_patterns:
            print(f"🎯 Patterns trouvés : {found_patterns}")
        else:
            print("⚠️  Aucun pattern reconnu dans le header")
            
    except Exception as e:
        print(f"❌ Erreur analyse binaire : {e}")
        return False
    
    return True

def test_ae_file_copy():
    """Test la copie et le renommage du fichier .aep."""
    
    print(f"\n📁 TEST COPIE ET RENOMMAGE")
    print("-" * 30)
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Test 1: Copie simple
            copy1 = temp_path / "SQXX_01.aep"
            shutil.copy2(TEMPLATE_AE_FILE, copy1)
            print(f"✅ Copie simple : {copy1.name}")
            
            # Test 2: Renommage SQ01
            copy2 = temp_path / "SQ01_01.aep"
            shutil.copy2(TEMPLATE_AE_FILE, copy2)
            print(f"✅ Renommage SQ01 : {copy2.name}")
            
            # Test 3: Renommage SQ02
            copy3 = temp_path / "SQ02_01.aep"
            shutil.copy2(TEMPLATE_AE_FILE, copy3)
            print(f"✅ Renommage SQ02 : {copy3.name}")
            
            # Vérifier tailles
            original_size = TEMPLATE_AE_FILE.stat().st_size
            for copy_file in [copy1, copy2, copy3]:
                copy_size = copy_file.stat().st_size
                if copy_size == original_size:
                    print(f"   ✅ {copy_file.name} : Taille correcte")
                else:
                    print(f"   ❌ {copy_file.name} : Taille incorrecte")
                    
            print(f"🎯 Test copie/renommage réussi")
            
    except Exception as e:
        print(f"❌ Erreur test copie : {e}")
        return False
    
    return True

def test_ae_command_line():
    """Test si After Effects est accessible en ligne de commande."""
    
    print(f"\n🖥️  TEST AFTER EFFECTS COMMAND LINE")
    print("-" * 40)
    
    # Chemins possibles d'After Effects
    ae_paths = [
        "/Applications/Adobe After Effects 2024/aerender",
        "/Applications/Adobe After Effects 2023/aerender",
        "/Applications/Adobe After Effects CC 2023/aerender",
        "/Applications/Adobe After Effects CC 2022/aerender",
        "/Applications/Adobe After Effects CC 2021/aerender"
    ]
    
    ae_found = None
    for ae_path in ae_paths:
        if Path(ae_path).exists():
            ae_found = ae_path
            print(f"✅ After Effects trouvé : {ae_path}")
            break
    
    if not ae_found:
        print("❌ After Effects non trouvé en ligne de commande")
        print("📝 Chemins testés :")
        for path in ae_paths:
            print(f"   - {path}")
        return False
    
    # Test version
    try:
        result = subprocess.run([ae_found, "-version"], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"🎬 Version : {result.stdout.strip()}")
        else:
            print(f"⚠️  Erreur version : {result.stderr}")
    except Exception as e:
        print(f"⚠️  Impossible de récupérer la version : {e}")
    
    return True, ae_found

def test_extendscript_simple():
    """Test d'un script ExtendScript simple."""
    
    print(f"\n📝 TEST SCRIPT EXTENDSCRIPT")
    print("-" * 30)
    
    # Script ExtendScript simple
    script_content = '''
// Test script simple
try {
    // Juste écrire dans un fichier de log
    var logFile = new File("/tmp/ae_test_log.txt");
    logFile.open("w");
    logFile.write("Test ExtendScript réussi\\n");
    logFile.write("Date: " + new Date().toString() + "\\n");
    logFile.close();
    
    alert("Script ExtendScript exécuté avec succès");
} catch (e) {
    alert("Erreur: " + e.toString());
}
'''
    
    try:
        # Créer fichier script temporaire
        script_path = "/tmp/test_ae_script.jsx"
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        print(f"✅ Script créé : {script_path}")
        
        # Test si on peut l'exécuter (sans After Effects pour l'instant)
        if Path(script_path).exists():
            print(f"✅ Script accessible")
            
            # Afficher le contenu
            print(f"📄 Contenu du script :")
            print(script_content[:200] + "...")
            
        return True
        
    except Exception as e:
        print(f"❌ Erreur création script : {e}")
        return False

def test_real_ae_execution():
    """Test d'exécution réelle avec After Effects (si disponible)."""
    
    print(f"\n🚀 TEST EXÉCUTION RÉELLE AFTER EFFECTS")
    print("-" * 40)
    
    # Vérifier si AE est disponible
    ae_test = test_ae_command_line()
    if not ae_test or not ae_test[0]:
        print("⚠️  After Effects non disponible, test annulé")
        return False
    
    ae_path = ae_test[1]
    
    # Script pour ouvrir et fermer le projet
    script_content = f'''
try {{
    // Ouvrir le projet template
    var projectFile = new File("{TEMPLATE_AE_FILE}");
    if (projectFile.exists) {{
        app.open(projectFile);
        
        // Log des informations du projet
        var logFile = new File("/tmp/ae_project_info.txt");
        logFile.open("w");
        logFile.write("Projet ouvert: " + app.project.file.name + "\\n");
        logFile.write("Nombre d'éléments: " + app.project.numItems + "\\n");
        
        // Lister les éléments
        for (var i = 1; i <= app.project.numItems; i++) {{
            var item = app.project.item(i);
            logFile.write("Item " + i + ": " + item.name + " (type: " + item.typeName + ")\\n");
        }}
        
        logFile.close();
        
        // Fermer sans sauvegarder
        app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    }}
    
    app.quit();
}} catch (e) {{
    var errorFile = new File("/tmp/ae_error.txt");
    errorFile.open("w");
    errorFile.write("Erreur: " + e.toString() + "\\n");
    errorFile.close();
    app.quit();
}}
'''
    
    script_path = "/tmp/test_real_ae.jsx"
    try:
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        print(f"📝 Script créé pour test réel")
        print(f"⚠️  ATTENTION: Ceci va lancer After Effects")
        
        response = input("Continuer ? (y/n): ").strip().lower()
        if response != 'y':
            print("🚫 Test réel annulé")
            return False
        
        print(f"🚀 Lancement After Effects...")
        
        # Exécuter le script
        result = subprocess.run([
            ae_path,
            "-noui",  # Interface minimale
            "-script", script_path
        ], capture_output=True, text=True, timeout=30)
        
        print(f"📤 Code retour: {result.returncode}")
        
        # Vérifier les logs
        log_file = Path("/tmp/ae_project_info.txt")
        error_file = Path("/tmp/ae_error.txt")
        
        if log_file.exists():
            print(f"✅ Log projet créé:")
            print(log_file.read_text())
        
        if error_file.exists():
            print(f"❌ Erreur détectée:")
            print(error_file.read_text())
        
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print(f"⏱️  Timeout - After Effects prend trop de temps")
        return False
    except Exception as e:
        print(f"❌ Erreur exécution : {e}")
        return False

def main():
    """Fonction principale de test."""
    
    print("🧪 TEST COMPLET FICHIER TEMPLATE AFTER EFFECTS")
    print("=" * 60)
    
    tests = [
        ("Accès fichier", test_ae_file_access),
        ("Analyse binaire", test_ae_binary_analysis),
        ("Copie/renommage", test_ae_file_copy),
        ("ExtendScript", test_extendscript_simple)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results[test_name] = result
            status = "✅ RÉUSSI" if result else "❌ ÉCHOUÉ"
            print(f"Résultat: {status}")
        except Exception as e:
            results[test_name] = False
            print(f"❌ ERREUR: {e}")
    
    # Résumé
    print(f"\n🏁 RÉSUMÉ DES TESTS")
    print("=" * 30)
    
    for test_name, result in results.items():
        status = "✅" if result else "❌"
        print(f"{status} {test_name}")
    
    success_count = sum(results.values())
    total_count = len(results)
    
    print(f"\n📊 Score: {success_count}/{total_count}")
    
    if success_count == total_count:
        print("🎉 TOUS LES TESTS RÉUSSIS")
        
        # Proposer test réel
        response = input("\n❓ Lancer le test réel avec After Effects ? (y/n): ").strip().lower()
        if response == 'y':
            test_real_ae_execution()
    else:
        print("⚠️  Certains tests ont échoué")
    
    return success_count == total_count

if __name__ == "__main__":
    main()
