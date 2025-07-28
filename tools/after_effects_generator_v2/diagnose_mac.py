#!/usr/bin/env python3
"""
Diagnostic Mac - Vérification des Chemins et Fichiers Sources
Script spécialisé pour diagnostiquer les problèmes de chemins sur Mac
"""

import sys
import os
from pathlib import Path
from datetime import datetime

# Ajouter le chemin parent pour les imports
sys.path.append(str(Path(__file__).parent))

from platform_detector import PlatformPathManager

def check_volume_mounts():
    """Vérifie tous les volumes montés sur Mac."""
    
    print("🔍 ANALYSE VOLUMES MONTÉS")
    print("=" * 30)
    
    volumes_path = Path("/Volumes")
    if not volumes_path.exists():
        print("❌ /Volumes non trouvé (pas un Mac ?)")
        return []
    
    mounted_volumes = []
    for volume in volumes_path.iterdir():
        if volume.is_dir() and not volume.name.startswith('.'):
            size_info = ""
            try:
                # Compter les éléments pour avoir une idée
                items = list(volume.iterdir())
                size_info = f"({len(items)} éléments)"
            except PermissionError:
                size_info = "(accès restreint)"
            except:
                size_info = "(erreur d'accès)"
            
            mounted_volumes.append(volume.name)
            print(f"   📁 {volume.name} {size_info}")
    
    print(f"\n💾 Total volumes montés : {len(mounted_volumes)}")
    return mounted_volumes

def check_resizelab_candidates(volumes):
    """Cherche des volumes qui pourraient être resizelab."""
    
    print("\n🎯 RECHERCHE CANDIDATS RESIZELAB")
    print("=" * 35)
    
    candidates = []
    potential_names = ['resizelab', 'ResizeLab', 'RESIZELAB', 'resize', 'lab']
    
    for volume in volumes:
        volume_lower = volume.lower()
        if any(name.lower() in volume_lower for name in potential_names):
            volume_path = Path(f"/Volumes/{volume}")
            candidates.append({
                'name': volume,
                'path': volume_path,
                'accessible': volume_path.exists()
            })
            print(f"   🎯 {volume} - {volume_path}")
    
    if not candidates:
        print("   ❌ Aucun volume candidat trouvé")
        print("   💡 Vérifiez que LucidLink est bien connecté")
    
    return candidates

def check_o2b_structure(base_path):
    """Vérifie si la structure o2b-undllm existe."""
    
    print(f"\n🏗️  VÉRIFICATION STRUCTURE O2B")
    print("=" * 35)
    print(f"Base : {base_path}")
    
    o2b_path = base_path / "o2b-undllm"
    if not o2b_path.exists():
        print(f"   ❌ Dossier o2b-undllm non trouvé")
        print(f"   📁 Contenu de {base_path} :")
        try:
            for item in base_path.iterdir():
                if item.is_dir():
                    print(f"      📁 {item.name}")
                else:
                    print(f"      📄 {item.name}")
        except PermissionError:
            print(f"      ❌ Accès refusé")
        return False
    
    print(f"   ✅ o2b-undllm trouvé")
    
    # Vérifier les sous-dossiers critiques
    critical_paths = [
        "2_IN/_FROM_EDIT/BY_SHOTS",
        "2_IN/_FROM_GRADING/BY_SHOTS", 
        "3_PROJECTS/2_ANIM/SEQUENCES",
        "3_PROJECTS/2_ANIM/_TEMPLATES"
    ]
    
    results = {}
    for rel_path in critical_paths:
        full_path = o2b_path / rel_path
        exists = full_path.exists()
        results[rel_path] = exists
        status = "✅" if exists else "❌"
        print(f"   {status} {rel_path}")
        
        # Si c'est un dossier de fichiers sources, compter les fichiers
        if exists and "BY_SHOTS" in rel_path:
            try:
                mov_files = list(full_path.glob("*.mov"))
                mp4_files = list(full_path.glob("*.mp4"))
                total_files = len(mov_files) + len(mp4_files)
                print(f"      📹 {total_files} fichiers vidéo")
            except:
                print(f"      ❌ Erreur lecture fichiers")
    
    return all(results.values())

def run_platform_detector_test():
    """Test le détecteur de plateforme actuel."""
    
    print("\n🧪 TEST DÉTECTEUR PLATEFORME")
    print("=" * 32)
    
    try:
        manager = PlatformPathManager()
        print(f"   Plateforme : {manager.platform}")
        print(f"   Est Mac : {manager.is_mac}")
        print(f"   Est Windows : {manager.is_windows}")
        
        print("\n📁 Chemins détectés :")
        for key, path in manager.paths.items():
            if key != "config":
                exists = Path(path).exists() if isinstance(path, str) else path.exists()
                status = "✅" if exists else "❌"
                print(f"   {status} {key}: {path}")
        
        # Test validation
        paths_ok, results = manager.validate_paths()
        print(f"\n🎯 Validation : {'✅ OK' if paths_ok else '❌ ÉCHEC'}")
        
        return manager, paths_ok
        
    except Exception as e:
        print(f"   ❌ Erreur : {e}")
        return None, False

def main():
    """Fonction principale de diagnostic."""
    
    print("🔍 DIAGNOSTIC MAC - CHEMINS ET FICHIERS SOURCES")
    print("=" * 52)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Vérifier qu'on est bien sur Mac
    import platform
    if platform.system() != "Darwin":
        print(f"⚠️  Attention : Ce script est conçu pour Mac")
        print(f"   Plateforme détectée : {platform.system()}")
        print()
    
    # 1. Analyser les volumes montés
    volumes = check_volume_mounts()
    
    # 2. Chercher des candidats resizelab
    candidates = check_resizelab_candidates(volumes)
    
    # 3. Tester chaque candidat
    valid_candidates = []
    for candidate in candidates:
        if candidate['accessible']:
            print(f"\n🔬 TEST CANDIDAT : {candidate['name']}")
            print("-" * 30)
            if check_o2b_structure(candidate['path']):
                valid_candidates.append(candidate)
                print(f"   ✅ Structure complète trouvée !")
            else:
                print(f"   ❌ Structure incomplète")
    
    # 4. Tester le détecteur actuel
    manager, detector_ok = run_platform_detector_test()
    
    # 5. Rapport final
    print("\n📊 RAPPORT FINAL")
    print("=" * 17)
    
    if valid_candidates:
        print(f"✅ {len(valid_candidates)} candidat(s) valide(s) trouvé(s) :")
        for candidate in valid_candidates:
            print(f"   📁 {candidate['path']}")
    else:
        print("❌ Aucun candidat valide trouvé")
    
    print(f"🧪 Détecteur actuel : {'✅ OK' if detector_ok else '❌ ÉCHEC'}")
    
    # 6. Recommandations
    print("\n💡 RECOMMANDATIONS")
    print("=" * 18)
    
    if not valid_candidates:
        print("❌ PROBLÈME DE MONTAGE LUCIDLINK")
        print("   1. Vérifiez que LucidLink est lancé")
        print("   2. Vérifiez la connexion Internet")
        print("   3. Relancez LucidLink si nécessaire")
        print("   4. Vérifiez les identifiants dans LucidLink")
    elif not detector_ok:
        print("⚠️  PROBLÈME DE DÉTECTION")
        print(f"   1. Le volume est monté à : {valid_candidates[0]['path']}")
        print("   2. Mais le détecteur ne le trouve pas")
        print("   3. Modifiez platform_detector.py pour ajouter ce chemin")
    else:
        print("✅ TOUT SEMBLE OK")
        print("   1. Les chemins sont corrects")
        print("   2. Vérifiez que les fichiers .mov existent bien")
        print("   3. Relancez le script After Effects")
    
    return 0 if valid_candidates and detector_ok else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
