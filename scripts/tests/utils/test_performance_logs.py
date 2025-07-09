#!/usr/bin/env python3
"""
Test de performance pour valider l'impact des logs sur les performances du watcher
"""

import os
import sys
import time
import tempfile
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.file_watcher import LucidLinkWatcher

def test_performance_with_many_files():
    """Test de performance avec un grand nombre de fichiers."""
    
    print("="*80)
    print("TEST DE PERFORMANCE - SCAN AVEC NOMBREUX FICHIERS")
    print("="*80)
    
    # Créer un répertoire temporaire
    with tempfile.TemporaryDirectory() as temp_dir:
        test_path = Path(temp_dir) / "4_OUT" / "2_FROM_VFX" / "BY_SHOT" / "UNDLM_00001"
        test_path.mkdir(parents=True, exist_ok=True)
        
        # Créer un grand nombre de fichiers de test
        num_files = 100
        valid_files = []
        invalid_files = []
        
        print(f"📝 Création de {num_files} fichiers de test...")
        
        start_creation = time.time()
        
        for i in range(num_files):
            if i % 3 == 0:
                # Fichier valide
                filename = f"UNDLM_{i:05d}_v001.mov"
                valid_files.append(filename)
            elif i % 3 == 1:
                # Fichier avec nomenclature incorrecte
                filename = f"bad_file_{i}.mov"
                invalid_files.append(filename)
            else:
                # Fichier avec extension non supportée
                filename = f"UNDLM_{i:05d}_v001.avi"
                invalid_files.append(filename)
            
            file_path = test_path / filename
            file_path.write_text("dummy content")
        
        creation_time = time.time() - start_creation
        print(f"✅ {num_files} fichiers créés en {creation_time:.2f} secondes")
        print(f"   📊 {len(valid_files)} fichiers valides")
        print(f"   📊 {len(invalid_files)} fichiers invalides")
        
        # Configuration du watcher
        config = {
            'base_path': temp_dir,
            'polling_interval': 1,
            'min_file_age': 0,
            'supported_extensions': ['.mov', '.mp4']
        }
        
        # Test avec logs activés
        print("\n" + "-"*60)
        print("SCAN AVEC LOGS ACTIVÉS")
        print("-"*60)
        
        # Configurer le logging pour capturer les messages
        log_handler = logging.StreamHandler()
        log_handler.setLevel(logging.WARNING)  # Seulement les avertissements
        
        watcher = LucidLinkWatcher(config)
        
        start_scan = time.time()
        files_found = list(watcher._scan_directory(test_path))
        scan_time = time.time() - start_scan
        
        print(f"✅ Scan terminé en {scan_time:.3f} secondes")
        print(f"   📊 {len(files_found)} fichiers valides trouvés")
        print(f"   ⚡ Performance: {len(files_found)/scan_time:.1f} fichiers/seconde")
        
        # Analyser les résultats
        print("\n" + "-"*60)
        print("ANALYSE DES RÉSULTATS")
        print("-"*60)
        
        expected_valid = len(valid_files)
        actual_valid = len(files_found)
        
        print(f"📊 Fichiers valides attendus: {expected_valid}")
        print(f"📊 Fichiers valides trouvés: {actual_valid}")
        print(f"📊 Fichiers invalides rejetés: {num_files - actual_valid}")
        
        # Vérifier quelques fichiers
        if files_found:
            print("\n📋 Échantillon de fichiers validés:")
            for i, file_path in enumerate(files_found[:5]):
                shot_info = watcher._extract_shot_info(file_path.name)
                if shot_info:
                    print(f"   ✓ {file_path.name} -> {shot_info['nomenclature']} v{shot_info['version']}")
                
                if len(files_found) > 5:
                    print(f"   ... et {len(files_found) - 5} autres fichiers")
                    break
        
        # Métriques de performance
        print(f"\n⚡ MÉTRIQUES DE PERFORMANCE")
        print(f"   📊 Temps total: {scan_time:.3f} secondes")
        print(f"   📊 Fichiers/seconde: {num_files/scan_time:.1f}")
        print(f"   📊 Fichiers valides/seconde: {actual_valid/scan_time:.1f}")
        
        # Validation des performances
        if scan_time < 2.0:  # Moins de 2 secondes pour 100 fichiers
            print("   ✅ Performance excellente")
        elif scan_time < 5.0:  # Moins de 5 secondes
            print("   ✅ Performance acceptable")
        else:
            print("   ⚠️ Performance à améliorer")
        
        return scan_time, actual_valid, num_files

if __name__ == "__main__":
    print("Test de performance du watcher avec logs")
    
    try:
        scan_time, valid_files, total_files = test_performance_with_many_files()
        
        print("\n" + "="*80)
        print("RÉSUMÉ DU TEST DE PERFORMANCE")
        print("="*80)
        print(f"✅ Test terminé avec succès")
        print(f"📊 {total_files} fichiers traités en {scan_time:.3f} secondes")
        print(f"📊 {valid_files} fichiers valides identifiés")
        print(f"⚡ Performance: {total_files/scan_time:.1f} fichiers/seconde")
        
    except Exception as e:
        print(f"❌ Erreur pendant le test: {e}")
        sys.exit(1)
