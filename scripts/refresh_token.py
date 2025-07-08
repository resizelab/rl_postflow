#!/usr/bin/env python3
"""
Script pour forcer le rafraîchissement du token Frame.io
"""

import sys
import asyncio
from pathlib import Path

# Ajouter src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio import create_frameio_auth

async def main():
    """Rafraîchir le token Frame.io"""
    print("🔄 Rafraîchissement du token Frame.io...")
    
    try:
        # Créer l'authentification
        auth = create_frameio_auth()
        
        # Vérifier l'état actuel du token
        print(f"Token valide actuellement: {auth.is_token_valid()}")
        
        # Forcer le rafraîchissement
        print("🔄 Tentative de rafraîchissement...")
        success = await auth.ensure_valid_token()
        
        if success:
            print("✅ Token rafraîchi avec succès")
            
            # Tester la connexion
            print("🧪 Test de connexion...")
            connection_ok = await auth.test_connection()
            
            if connection_ok:
                print("✅ Connexion Frame.io OK")
                
                # Afficher les informations du token
                print(f"📊 Informations du token:")
                print(f"  - Token valide: {auth.is_token_valid()}")
                
                return 0
            else:
                print("❌ Échec du test de connexion")
                return 1
        else:
            print("❌ Échec du rafraîchissement du token")
            
            # Générer une nouvelle URL d'autorisation
            auth_url = auth.generate_auth_url()
            print(f"🔗 Nouvelle URL d'autorisation nécessaire:")
            print(f"   {auth_url}")
            
            return 1
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
