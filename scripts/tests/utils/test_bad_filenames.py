#!/usr/bin/env python3
"""
Test pour créer des fichiers temporaires mal nommés et valider les logs
"""

import os
import sys
import tempfile
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.file_watcher import LucidLinkWatcher

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_bad_filename_logs():
    """Test avec des fichiers mal nommés dans un répertoire temporaire."""
    
    # Chemin réel LucidLink pour créer des fichiers temporaires
    base_path = Path('/Volumes/resizelab/o2b-undllm')
    test_path = base_path / '4_OUT' / '2_FROM_VFX' / 'BY_SHOT' / 'UNDLM_00001'
    
    print("="*80)
    print("TEST DE FICHIERS MAL NOMMÉS - LOGS DE REJET")
    print("="*80)
    print(f"Répertoire cible: {test_path}")
    
    # Vérifier que le répertoire existe
    if not test_path.exists():
        print(f"❌ Le répertoire {test_path} n'existe pas")
        return False
    
    # Créer des fichiers temporaires mal nommés
    temp_files = []
    test_filenames = [
        'mauvais_nom.mov',
        'test_video.mp4',
        'UNDL_001.mov',  # Trop court
        'UNDLM_ABC.mov',  # Lettres au lieu de chiffres
        'UNDLM_00001_draft_v2.mov',  # Format mixte
        'UNDLM_123456.mov',  # Trop de chiffres
        'UNDLM_00001.mkv',  # Extension non supportée
        'UNDLM_00001_test.avi',  # Extension non supportée
    ]
    
    print(f"📝 Création de {len(test_filenames)} fichiers temporaires...")
    
    try:
        # Créer les fichiers temporaires
        for filename in test_filenames:
            temp_file = test_path / filename
            temp_file.write_text("dummy content for testing")
            temp_files.append(temp_file)
            print(f"   ✓ Créé: {filename}")
        
        # Configuration du watcher
        config = {
            'base_path': str(base_path),
            'polling_interval': 1,
            'min_file_age': 0,
            'supported_extensions': ['.mov', '.mp4']
        }
        
        watcher = LucidLinkWatcher(config)
        
        print("\n" + "-"*80)
        print("SCAN AVEC FICHIERS MAL NOMMÉS")
        print("-"*80)
        
        # Effectuer le scan
        files_found = list(watcher._scan_directory(test_path))
        
        print("-"*80)
        print(f"✅ RÉSULTATS DU SCAN")
        print(f"   📊 {len(files_found)} fichiers valides trouvés")
        
        for file_path in files_found:
            shot_info = watcher._extract_shot_info(file_path.name)
            if shot_info:
                print(f"     ✓ {file_path.name} -> {shot_info['nomenclature']} v{shot_info['version']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur pendant le test: {e}")
        return False
    
    finally:
        # Nettoyer les fichiers temporaires
        print("\n" + "-"*80)
        print("NETTOYAGE DES FICHIERS TEMPORAIRES")
        print("-"*80)
        
        for temp_file in temp_files:
            try:
                if temp_file.exists():
                    temp_file.unlink()
                    print(f"   🗑️ Supprimé: {temp_file.name}")
            except Exception as e:
                print(f"   ❌ Erreur lors de la suppression de {temp_file.name}: {e}")
        
        print("✅ Nettoyage terminé")

if __name__ == "__main__":
    print("Test des logs de fichiers mal nommés")
    success = test_bad_filename_logs()
    
    if success:
        print("\n✅ Test terminé avec succès")
    else:
        print("\n❌ Test échoué")
        sys.exit(1)
