#!/usr/bin/env python3
"""
Script simple pour tester l'arrêt propre en conditions réelles
"""

import subprocess
import time
import signal
import sys
import os

def test_shutdown():
    """Test simple d'arrêt en conditions réelles"""
    print("🧪 Test d'arrêt propre en conditions réelles")
    print("=" * 50)
    
    # Démarrer le pipeline
    print("1. Démarrage du pipeline...")
    process = subprocess.Popen([
        sys.executable, "main.py", "--no-dashboard"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Attendre que le pipeline démarre
    print("2. Attente du démarrage (5 secondes)...")
    time.sleep(5)
    
    # Vérifier que le processus est encore actif
    if process.poll() is None:
        print("✅ Pipeline démarré avec succès")
        
        # Envoyer SIGTERM pour un arrêt propre
        print("3. Envoi de SIGTERM pour arrêt propre...")
        process.send_signal(signal.SIGTERM)
        
        # Attendre que le processus se termine
        print("4. Attente de l'arrêt (15 secondes max)...")
        try:
            stdout, stderr = process.communicate(timeout=15)
            print(f"✅ Processus terminé avec code: {process.returncode}")
            
            if process.returncode == 0:
                print("✅ Arrêt propre réussi !")
            else:
                print("⚠️ Arrêt avec code d'erreur")
                print("STDERR:", stderr[-500:])  # Derniers 500 caractères
                
        except subprocess.TimeoutExpired:
            print("❌ Timeout - processus bloqué")
            process.kill()
            process.wait()
            return False
    else:
        print("❌ Pipeline n'a pas démarré correctement")
        stdout, stderr = process.communicate()
        print("STDERR:", stderr[-500:])
        return False
    
    return True

if __name__ == "__main__":
    os.chdir("/Users/home/Library/CloudStorage/OneDrive-Personnel/WORK/_DEV/rl_postflow")
    
    try:
        success = test_shutdown()
        if success:
            print("\n🎉 Test d'arrêt propre réussi !")
        else:
            print("\n❌ Test d'arrêt échoué")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Test interrompu")
        sys.exit(1)
