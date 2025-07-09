#!/usr/bin/env python3
"""
Test en conditions réelles pour valider les logs de fichiers rejetés
"""

import os
import sys
import logging
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.file_watcher import LucidLinkWatcher

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('test_real_scan.log')
    ]
)

def test_real_lucidlink_scan():
    """Test du scan du vrai répertoire LucidLink."""
    
    # Chemin réel LucidLink
    base_path = Path('/Volumes/resizelab/o2b-undllm')
    test_path = base_path / '4_OUT' / '2_FROM_VFX' / 'BY_SHOT' / 'UNDLM_00001'
    
    print("="*80)
    print("TEST EN CONDITIONS RÉELLES - SCAN LUCIDLINK")
    print("="*80)
    print(f"Répertoire cible: {test_path}")
    
    # Vérifier que le répertoire existe
    if not test_path.exists():
        print(f"❌ Le répertoire {test_path} n'existe pas")
        print("Veuillez vérifier que LucidLink est monté et accessible")
        return False
    
    # Configuration du watcher
    config = {
        'base_path': str(base_path),
        'polling_interval': 1,
        'min_file_age': 0,
        'supported_extensions': ['.mov', '.mp4', '.avi']
    }
    
    # Créer le watcher
    watcher = LucidLinkWatcher(config)
    
    print(f"✅ Répertoire accessible: {test_path}")
    print(f"📁 Contenu du répertoire:")
    
    # Lister le contenu du répertoire
    try:
        files = list(test_path.iterdir())
        print(f"   📊 {len(files)} éléments trouvés")
        
        for item in files[:20]:  # Limiter à 20 pour éviter le spam
            if item.is_file():
                print(f"   📄 {item.name} ({item.suffix})")
            else:
                print(f"   📁 {item.name}/")
        
        if len(files) > 20:
            print(f"   ... et {len(files) - 20} autres éléments")
    
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du répertoire: {e}")
        return False
    
    print("\n" + "-"*80)
    print("LANCEMENT DU SCAN AVEC LOGS DE REJET")
    print("-"*80)
    
    # Effectuer le scan
    try:
        files_found = list(watcher._scan_directory(test_path))
        
        print("-"*80)
        print(f"✅ RÉSULTATS DU SCAN")
        print(f"   📊 {len(files_found)} fichiers valides trouvés")
        
        if files_found:
            print("   📋 Fichiers validés:")
            for file_path in files_found:
                shot_info = watcher._extract_shot_info(file_path.name)
                if shot_info:
                    print(f"     ✓ {file_path.name} -> {shot_info['nomenclature']} v{shot_info['version']}")
                else:
                    print(f"     ? {file_path.name} -> Info non extraite")
        else:
            print("   ℹ️ Aucun fichier valide trouvé dans ce répertoire")
            print("   💡 Vérifiez que les fichiers respectent le format UNDLM_##### et ont les bonnes extensions")
        
    except Exception as e:
        print(f"❌ Erreur pendant le scan: {e}")
        return False
    
    print("\n" + "="*80)
    print("FIN DU TEST EN CONDITIONS RÉELLES")
    print("="*80)
    print(f"📝 Logs sauvegardés dans: test_real_scan.log")
    
    return True

if __name__ == "__main__":
    print("Test du scan LucidLink en conditions réelles")
    success = test_real_lucidlink_scan()
    
    if success:
        print("\n✅ Test terminé avec succès")
    else:
        print("\n❌ Test échoué")
        sys.exit(1)
