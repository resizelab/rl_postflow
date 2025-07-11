#!/usr/bin/env python3
"""
Analyse Avancée du Fichier Template AE
Recherche des patterns SQXX dans le fichier .aep
"""

import os
import re
from pathlib import Path

TEMPLATE_AE_FILE = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/_AE/SQXX_01.aep")

def analyze_ae_patterns():
    """Analyse approfondie des patterns dans le fichier .aep."""
    
    print("🔍 ANALYSE PATTERNS FICHIER AFTER EFFECTS")
    print("=" * 50)
    
    if not TEMPLATE_AE_FILE.exists():
        print("❌ Fichier non trouvé")
        return False
    
    try:
        with open(TEMPLATE_AE_FILE, 'rb') as f:
            content = f.read()
        
        print(f"📄 Taille totale : {len(content)} bytes")
        
        # Convertir en string pour recherche de patterns
        # Essayer différents encodages
        text_content = ""
        
        # UTF-8 avec ignorance des erreurs
        try:
            text_content = content.decode('utf-8', errors='ignore')
            print("✅ Décodage UTF-8 réussi")
        except:
            # ISO-8859-1 (Latin-1) en fallback
            try:
                text_content = content.decode('iso-8859-1', errors='ignore')
                print("✅ Décodage ISO-8859-1 réussi")
            except:
                print("❌ Impossible de décoder le fichier")
                return False
        
        # Rechercher les patterns
        patterns = {
            'SQXX': r'SQXX',
            'XXX (3 X)': r'(?<!S)XXX',
            '00XXX': r'00XXX',
            'UNDLM': r'UNDLM',
            'Adobe': r'Adobe',
            'After Effects': r'After\\s*Effects',
            'Composition': r'[Cc]omposition',
            'Layer': r'[Ll]ayer',
            'Source': r'[Ss]ource',
            'File path': r'[Ff]ile|[Pp]ath'
        }
        
        found_patterns = {}
        
        for pattern_name, pattern_regex in patterns.items():
            matches = re.findall(pattern_regex, text_content, re.IGNORECASE)
            if matches:
                found_patterns[pattern_name] = len(matches)
                print(f"🎯 {pattern_name} : {len(matches)} occurrence(s)")
        
        if not found_patterns:
            print("⚠️  Aucun pattern text trouvé")
            
            # Recherche binaire directe
            print("\\n🔍 Recherche binaire...")
            binary_patterns = {
                'SQXX': b'SQXX',
                'XXX': b'XXX',
                '00XXX': b'00XXX',
                'UNDLM': b'UNDLM'
            }
            
            for name, pattern in binary_patterns.items():
                if pattern in content:
                    count = content.count(pattern)
                    print(f"🎯 {name} (binaire) : {count} occurrence(s)")
                    found_patterns[name] = count
        
        # Analyser la structure de fichier
        print("\\n📋 ANALYSE STRUCTURE FICHIER")
        print("-" * 30)
        
        # Rechercher les chunks RIFF
        if content.startswith(b'RIFX'):
            print("✅ Format RIFF (Big Endian) détecté")
            
            # Lire la taille du fichier dans le header
            file_size = int.from_bytes(content[4:8], byteorder='big')
            print(f"📊 Taille déclarée : {file_size} bytes")
            
            # Type de fichier
            file_type = content[8:12]
            print(f"📝 Type fichier : {file_type}")
            
        elif content.startswith(b'RIFF'):
            print("✅ Format RIFF (Little Endian) détecté")
        else:
            print("⚠️  Format non reconnu")
        
        # Rechercher des chaînes intéressantes
        print("\\n🔤 CHAÎNES REMARQUABLES")
        print("-" * 25)
        
        # Extraire les chaînes lisibles de plus de 4 caractères
        readable_strings = re.findall(rb'[\\x20-\\x7E]{4,}', content)
        interesting_strings = []
        
        for string in readable_strings[:50]:  # Limiter à 50 premières
            decoded = string.decode('ascii', errors='ignore')
            if any(keyword in decoded.lower() for keyword in ['sq', 'undlm', 'layer', 'comp', 'source']):
                interesting_strings.append(decoded)
        
        for string in interesting_strings[:10]:  # Afficher les 10 premières
            print(f"   📝 {string}")
        
        # Résumé
        print("\\n📊 RÉSUMÉ ANALYSE")
        print("-" * 20)
        
        if found_patterns:
            print("✅ Patterns trouvés :")
            for pattern, count in found_patterns.items():
                print(f"   • {pattern} : {count}")
            
            # Recommandations
            print("\\n💡 RECOMMANDATIONS")
            print("-" * 20)
            
            if 'SQXX' in found_patterns:
                print("✅ Pattern SQXX trouvé - Renommage possible")
            else:
                print("⚠️  Pattern SQXX non trouvé - Vérifier le template")
                
            if any('XXX' in p for p in found_patterns.keys()):
                print("✅ Pattern XXX trouvé - Renommage plans possible")
            else:
                print("⚠️  Pattern XXX non trouvé - Vérifier la nomenclature")
        else:
            print("❌ Aucun pattern utilisable trouvé")
            print("💡 Le fichier pourrait être :")
            print("   • Compilé/Optimisé (patterns dans chunks binaires)")
            print("   • Utilisant une nomenclature différente")
            print("   • Nécessitant une approche ExtendScript")
        
        return len(found_patterns) > 0
        
    except Exception as e:
        print(f"❌ Erreur analyse : {e}")
        return False

def test_file_modification_strategy():
    """Test différentes stratégies de modification."""
    
    print("\\n🛠️ TEST STRATÉGIES DE MODIFICATION")
    print("=" * 40)
    
    strategies = {
        "1. Copie simple + renommage fichier": "✅ Toujours possible",
        "2. Remplacement text dans fichier": "⚠️  Risqué - corruption possible",
        "3. ExtendScript après copie": "✅ Recommandé - API officielle",
        "4. Parser binaire AE": "❌ Complexe - format propriétaire"
    }
    
    for strategy, status in strategies.items():
        print(f"{status} {strategy}")
    
    print("\\n🎯 STRATÉGIE RECOMMANDÉE")
    print("-" * 25)
    print("1. 📁 Copier le dossier template complet")
    print("2. 🔄 Renommer les fichiers (.aep, .psd, dossiers)")
    print("3. 📝 Utiliser ExtendScript pour modifier le contenu")
    print("4. ✅ Valider la structure générée")

def generate_extendscript_template():
    """Génère un template ExtendScript pour la modification."""
    
    print("\\n📝 GÉNÉRATION SCRIPT EXTENDSCRIPT")
    print("=" * 35)
    
    script_content = '''
// Script ExtendScript pour renommer les éléments du projet
// Généré automatiquement par RL PostFlow

function renameProjectElements(sequenceId, shotNumber) {
    try {
        var project = app.project;
        
        if (!project) {
            alert("Aucun projet ouvert");
            return false;
        }
        
        var modified = 0;
        
        // Parcourir tous les éléments du projet
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            var originalName = item.name;
            var newName = originalName;
            
            // Remplacer SQXX par le numéro de séquence
            if (newName.indexOf("SQXX") !== -1) {
                newName = newName.replace(/SQXX/g, "SQ" + sequenceId.toString().padStart(2, "0"));
                modified++;
            }
            
            // Remplacer XXX par le numéro de plan si fourni
            if (shotNumber && newName.indexOf("XXX") !== -1) {
                newName = newName.replace(/XXX/g, shotNumber.toString().padStart(3, "0"));
                modified++;
            }
            
            // Appliquer le nouveau nom
            if (newName !== originalName) {
                item.name = newName;
                $.writeln("Renommé: " + originalName + " -> " + newName);
            }
        }
        
        // Sauvegarder le projet
        project.save();
        
        alert("Modification terminée. " + modified + " éléments modifiés.");
        return true;
        
    } catch (e) {
        alert("Erreur: " + e.toString());
        return false;
    }
}

// Exemple d'utilisation
// renameProjectElements(1, 1); // Pour SQ01, plan 001
'''
    
    script_path = "/tmp/ae_rename_template.jsx"
    
    try:
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        print(f"✅ Script généré : {script_path}")
        print("📄 Contenu :")
        print(script_content[:300] + "...")
        
        return script_path
        
    except Exception as e:
        print(f"❌ Erreur génération script : {e}")
        return None

def main():
    """Fonction principale."""
    
    print("🎬 ANALYSE AVANCÉE TEMPLATE AFTER EFFECTS")
    print("=" * 50)
    
    # Analyse des patterns
    patterns_found = analyze_ae_patterns()
    
    # Test stratégies
    test_file_modification_strategy()
    
    # Génération script
    script_path = generate_extendscript_template()
    
    # Conclusion
    print("\\n🏁 CONCLUSION")
    print("=" * 15)
    
    if patterns_found:
        print("✅ Fichier template analysable")
        print("✅ Patterns de renommage identifiés")
        print("🎯 Déploiement automatique possible")
    else:
        print("⚠️  Patterns non trouvés dans l'analyse text")
        print("🎯 Utiliser ExtendScript pour modification sûre")
    
    if script_path:
        print(f"✅ Script ExtendScript prêt : {script_path}")
    
    print("\\n🚀 PROCHAINES ÉTAPES")
    print("1. Tester le script ExtendScript sur une copie")
    print("2. Valider le renommage des éléments")
    print("3. Intégrer dans le déployeur Python")

if __name__ == "__main__":
    main()
