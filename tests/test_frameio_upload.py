#!/usr/bin/env python3
"""
Test d'upload Frame.io avec un fichier spécifique
Utilise la CLI main.py --file pour tester l'upload complet
"""

import os
import sys
import tempfile
import subprocess
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def create_test_file():
    """Créer un fichier de test avec nomenclature correcte"""
    
    # Créer un fichier temporaire avec nomenclature valide
    temp_dir = Path(__file__).parent / "temp"
    temp_dir.mkdir(exist_ok=True)
    
    # Nom de fichier avec nomenclature : SQ01_UNDLM_00001_v001.mov
    test_filename = "SQ01_UNDLM_00001_v001.mov"
    test_file = temp_dir / test_filename
    
    # Créer un fichier vidéo simple (10 secondes de couleur unie)
    print(f"📹 Création du fichier test: {test_file}")
    
    # Vérifier si ffmpeg est disponible
    try:
        result = subprocess.run(['which', 'ffmpeg'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ ffmpeg n'est pas installé. Création d'un fichier texte à la place.")
            
            # Créer un fichier texte simple
            with open(test_file, 'w') as f:
                f.write("Fichier de test pour upload Frame.io\n")
                f.write(f"Nomenclature: {test_filename}\n")
                f.write("Contenu: Test d'upload vers Frame.io\n")
                f.write("Date: 2025-01-08\n")
        else:
            # Créer une vidéo de test avec ffmpeg
            cmd = [
                'ffmpeg', '-f', 'lavfi', '-i', 'color=c=blue:size=1920x1080:d=5',
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-y', str(test_file)
            ]
            
            print(f"🎬 Exécution: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                print(f"❌ Erreur ffmpeg: {result.stderr}")
                # Fallback vers un fichier texte
                with open(test_file, 'w') as f:
                    f.write("Fichier de test pour upload Frame.io (fallback)\n")
    
    except Exception as e:
        print(f"❌ Erreur création fichier: {e}")
        # Fallback vers un fichier texte
        with open(test_file, 'w') as f:
            f.write("Fichier de test pour upload Frame.io (fallback)\n")
    
    print(f"✅ Fichier créé: {test_file}")
    print(f"📊 Taille: {test_file.stat().st_size} bytes")
    
    return test_file

def test_frameio_upload():
    """Tester l'upload Frame.io avec la CLI"""
    
    print("🎬 === TEST D'UPLOAD FRAME.IO ===")
    print()
    
    # Créer le fichier de test
    test_file = create_test_file()
    
    if not test_file.exists():
        print("❌ Impossible de créer le fichier de test")
        return False
    
    # Lancer l'upload via la CLI
    print(f"🚀 Lancement de l'upload: {test_file.name}")
    print("📋 Commande: python main.py --file <file> --debug")
    print()
    
    cmd = [
        'python', 'main.py', 
        '--file', str(test_file),
        '--debug',
        '--no-dashboard'
    ]
    
    try:
        # Exécuter la commande
        result = subprocess.run(
            cmd, 
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )
        
        print("📋 === SORTIE DE LA COMMANDE ===")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️ === ERREURS ===")
            print(result.stderr)
        
        print(f"📊 Code de sortie: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ Upload terminé avec succès!")
            
            # Analyser la sortie pour extraire les informations importantes
            lines = result.stdout.split('\n')
            for line in lines:
                if 'Frame.io' in line and ('http' in line or 'https' in line):
                    print(f"🔗 Lien Frame.io: {line}")
                if 'FROM_VFX' in line:
                    print(f"📁 Structure: {line}")
                if 'Review URL' in line:
                    print(f"👁️  Review URL: {line}")
        else:
            print("❌ Upload échoué")
            return False
            
    except subprocess.TimeoutExpired:
        print("⏰ Timeout - L'upload prend plus de 5 minutes")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution: {e}")
        return False
    
    return True

def test_force_upload():
    """Tester l'upload avec --force"""
    
    print("\n🔄 === TEST D'UPLOAD AVEC --FORCE ===")
    print()
    
    # Utiliser le même fichier de test
    test_file = Path(__file__).parent / "temp" / "SQ01_UNDLM_00001_v001.mov"
    
    if not test_file.exists():
        print("❌ Fichier de test non trouvé")
        return False
    
    print(f"🔄 Test --force avec: {test_file.name}")
    
    cmd = [
        'python', 'main.py', 
        '--file', str(test_file),
        '--force',
        '--debug',
        '--no-dashboard'
    ]
    
    try:
        result = subprocess.run(
            cmd, 
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        print("📋 === SORTIE AVEC --FORCE ===")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️ === ERREURS ===")
            print(result.stderr)
        
        print(f"📊 Code de sortie: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ Upload --force terminé avec succès!")
            return True
        else:
            print("❌ Upload --force échoué")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution --force: {e}")
        return False

if __name__ == "__main__":
    success = test_frameio_upload()
    if success:
        force_success = test_force_upload()
        if force_success:
            print("\n🎉 === TOUS LES TESTS RÉUSSIS ===")
        else:
            print("\n⚠️ === TEST --FORCE ÉCHOUÉ ===")
    else:
        print("\n❌ === TEST PRINCIPAL ÉCHOUÉ ===")
