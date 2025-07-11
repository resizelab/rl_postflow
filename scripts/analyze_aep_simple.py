#!/usr/bin/env python3
"""
Analyseur de Structure After Effects - Version Simplifiée
Extrait les informations essentielles du fichier .aep
"""

import re
import json
from pathlib import Path
from typing import Dict, List

def analyze_aep_patterns(file_path: str) -> Dict:
    """Analyse les patterns dans le fichier .aep."""
    
    print(f"🎬 ANALYSE PATTERNS AFTER EFFECTS")
    print("=" * 40)
    
    if not Path(file_path).exists():
        print(f"❌ Fichier non trouvé : {file_path}")
        return {}
    
    # Charger le fichier
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
        print(f"✅ Fichier chargé : {len(data)} bytes ({len(data)/1024/1024:.2f} MB)")
    except Exception as e:
        print(f"❌ Erreur lecture : {e}")
        return {}
    
    # Convertir en texte pour analyse
    text_data = data.decode('latin-1', errors='ignore')
    
    # Analyse des patterns
    patterns = {}
    
    # 1. Patterns SQXX
    sqxx_matches = list(re.finditer(r'SQXX', text_data))
    patterns['SQXX'] = {
        'count': len(sqxx_matches),
        'positions': [m.start() for m in sqxx_matches[:10]],
        'contexts': [text_data[max(0, m.start()-10):m.end()+10] for m in sqxx_matches[:5]]
    }
    
    # 2. Patterns XXX (mais pas SQXX)
    xxx_matches = list(re.finditer(r'(?<!SQ)XXX', text_data))
    patterns['XXX'] = {
        'count': len(xxx_matches),
        'positions': [m.start() for m in xxx_matches[:10]],
        'contexts': [text_data[max(0, m.start()-10):m.end()+10] for m in xxx_matches[:5]]
    }
    
    # 3. Patterns 00XXX
    zxxx_matches = list(re.finditer(r'00XXX', text_data))
    patterns['00XXX'] = {
        'count': len(zxxx_matches),
        'positions': [m.start() for m in zxxx_matches[:10]],
        'contexts': [text_data[max(0, m.start()-10):m.end()+10] for m in zxxx_matches[:5]]
    }
    
    # 4. Patterns UNDLM
    undlm_matches = list(re.finditer(r'UNDLM[_\d]*', text_data))
    patterns['UNDLM'] = {
        'count': len(undlm_matches),
        'positions': [m.start() for m in undlm_matches[:10]],
        'contexts': [text_data[max(0, m.start()-10):m.end()+10] for m in undlm_matches[:5]]
    }
    
    # 5. Recherche compositions
    comp_matches = list(re.finditer(r'(SQXX[^\x00\n]{0,20})', text_data))
    patterns['compositions'] = {
        'count': len(comp_matches),
        'names': [m.group(1).strip() for m in comp_matches[:10]]
    }
    
    # 6. Recherche fichiers sources
    file_matches = list(re.finditer(r'([^\x00\n]*\.(mov|mp4|avi|png|jpg|tga|exr|aep)[^\x00\n]*)', text_data, re.IGNORECASE))
    patterns['source_files'] = {
        'count': len(file_matches),
        'files': [m.group(1).strip() for m in file_matches[:10] if len(m.group(1).strip()) > 5]
    }
    
    # 7. Recherche effets After Effects
    effect_matches = list(re.finditer(r'(ADBE [^\x00\n]{0,30}|CC [^\x00\n]{0,30})', text_data))
    patterns['effects'] = {
        'count': len(effect_matches),
        'effects': [m.group(1).strip() for m in effect_matches[:10]]
    }
    
    return patterns

def print_analysis_report(patterns: Dict, file_path: str):
    """Affiche le rapport d'analyse."""
    
    print(f"\n📊 RAPPORT D'ANALYSE")
    print("-" * 40)
    print(f"📁 Fichier : {Path(file_path).name}")
    
    # Résumé des patterns
    print(f"\n🎯 PATTERNS TROUVÉS :")
    
    for pattern_name, pattern_data in patterns.items():
        if pattern_name in ['SQXX', 'XXX', '00XXX', 'UNDLM']:
            count = pattern_data.get('count', 0)
            status = "✅" if count > 0 else "❌"
            print(f"   {status} {pattern_name:8} : {count:3d} occurrences")
            
            # Afficher quelques contextes
            if count > 0 and 'contexts' in pattern_data:
                for i, context in enumerate(pattern_data['contexts'][:3]):
                    clean_context = ''.join(c if c.isprintable() else '·' for c in context)
                    print(f"      [{i+1}] ...{clean_context}...")
    
    # Compositions
    comps = patterns.get('compositions', {})
    if comps.get('count', 0) > 0:
        print(f"\n🎭 COMPOSITIONS ({comps['count']}) :")
        for comp_name in comps.get('names', [])[:5]:
            clean_name = ''.join(c if c.isprintable() else '·' for c in comp_name)
            print(f"   • {clean_name}")
    
    # Fichiers sources
    files = patterns.get('source_files', {})
    if files.get('count', 0) > 0:
        print(f"\n📦 FICHIERS SOURCES ({files['count']}) :")
        for file_name in files.get('files', [])[:5]:
            clean_name = ''.join(c if c.isprintable() else '·' for c in file_name)
            if len(clean_name.strip()) > 3:
                print(f"   • {clean_name.strip()}")
    
    # Effets
    effects = patterns.get('effects', {})
    if effects.get('count', 0) > 0:
        print(f"\n🎨 EFFETS AFTER EFFECTS ({effects['count']}) :")
        for effect_name in effects.get('effects', [])[:5]:
            clean_name = ''.join(c if c.isprintable() else '·' for c in effect_name)
            if len(clean_name.strip()) > 3:
                print(f"   • {clean_name.strip()}")

def generate_recommendations(patterns: Dict) -> List[str]:
    """Génère des recommandations basées sur l'analyse."""
    
    recommendations = []
    
    # Vérifier SQXX
    sqxx_count = patterns.get('SQXX', {}).get('count', 0)
    if sqxx_count > 0:
        recommendations.append(f"✅ {sqxx_count} occurrences 'SQXX' trouvées - Renommage de séquence possible")
    else:
        recommendations.append("⚠️  Aucune occurrence 'SQXX' - Vérifier que c'est le bon template")
    
    # Vérifier XXX
    xxx_count = patterns.get('XXX', {}).get('count', 0)
    if xxx_count > 0:
        recommendations.append(f"✅ {xxx_count} occurrences 'XXX' trouvées - Renommage de plans possible")
    
    # Vérifier 00XXX
    zxxx_count = patterns.get('00XXX', {}).get('count', 0)
    if zxxx_count > 0:
        recommendations.append(f"✅ {zxxx_count} occurrences '00XXX' trouvées - Renommage détaillé possible")
    
    # Vérifier UNDLM
    undlm_count = patterns.get('UNDLM', {}).get('count', 0)
    if undlm_count > 0:
        recommendations.append(f"✅ {undlm_count} occurrences 'UNDLM' trouvées - Nomenclature cohérente")
    
    # Vérifier compositions
    comp_count = patterns.get('compositions', {}).get('count', 0)
    if comp_count > 0:
        recommendations.append(f"🎭 {comp_count} compositions détectées")
    
    # Vérifier fichiers sources
    files_count = patterns.get('source_files', {}).get('count', 0)
    if files_count > 0:
        recommendations.append(f"📦 {files_count} références de fichiers détectées")
    
    return recommendations

def main():
    """Fonction principale."""
    
    # Chemin du template
    template_path = "/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX/_AE/SQXX_01.aep"
    
    # Analyser
    patterns = analyze_aep_patterns(template_path)
    
    if not patterns:
        return
    
    # Afficher le rapport
    print_analysis_report(patterns, template_path)
    
    # Recommandations
    recommendations = generate_recommendations(patterns)
    
    print(f"\n🚀 RECOMMANDATIONS :")
    for rec in recommendations:
        print(f"   {rec}")
    
    print(f"\n📋 PLAN D'ACTION :")
    print(f"   1. ✅ Template analysé et patterns identifiés")
    print(f"   2. 🔄 Créer script de renommage (copie binaire + sed)")
    print(f"   3. 🧪 Tester sur SQ01 d'abord")
    print(f"   4. 🚀 Déployer sur toutes les séquences")
    
    # Sauvegarder le rapport (version JSON-safe)
    output_path = Path(__file__).parent.parent / "temp" / "aep_analysis_simple.json"
    output_path.parent.mkdir(exist_ok=True)
    
    # Nettoyer les données pour JSON
    json_patterns = {}
    for key, value in patterns.items():
        if isinstance(value, dict):
            json_patterns[key] = {
                'count': value.get('count', 0),
                'sample_positions': value.get('positions', [])[:5] if 'positions' in value else [],
                'sample_names': value.get('names', [])[:5] if 'names' in value else [],
                'sample_files': value.get('files', [])[:5] if 'files' in value else [],
                'sample_effects': value.get('effects', [])[:5] if 'effects' in value else []
            }
    
    report = {
        'file_path': template_path,
        'file_size_mb': Path(template_path).stat().st_size / 1024 / 1024,
        'patterns': json_patterns,
        'recommendations': recommendations,
        'analysis_date': '2025-07-10'
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Rapport sauvegardé : {output_path}")

if __name__ == "__main__":
    main()
