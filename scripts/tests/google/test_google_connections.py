#!/usr/bin/env python3
"""
Test du GoogleConnectionManager
"""

import sys
import os
# Ajouter le chemin vers la racine du projet
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from src.integrations.google import connection_manager, OptimizedSheetsStatusAdapter

def test_connection_manager():
    print("🧪 Test du GoogleConnectionManager...")
    
    try:
        # Initialiser le gestionnaire
        print("📝 Initialisation...")
        connection_manager.initialize(
            'config/google_credentials.json',
            '1mVni49q63ItOvChyUmh7AD_BXN-MsMhz4krzGzMOUKI'  # ID du spreadsheet réel
        )
        
        # Vérifier les stats
        stats = connection_manager.get_stats()
        print(f"📊 Stats: {stats}")
        
        # Tester la connexion
        print("🔗 Test connexion...")
        if connection_manager.test_connection():
            print("✅ Connexion Google réussie !")
        else:
            print("❌ Connexion Google échouée")
            return False
        
        # Tester l'adaptateur optimisé
        print("🔧 Test adaptateur optimisé...")
        adapter = OptimizedSheetsStatusAdapter(
            connection_manager,
            '1mVni49q63ItOvChyUmh7AD_BXN-MsMhz4krzGzMOUKI',
            'SHOTS_TRACK'
        )
        
        # Test de vérification de connexion (synchrone pour simplifier)
        try:
            print("🔍 Test accès au service Sheets...")
            sheets_service = connection_manager.get_sheets_service()
            if sheets_service:
                print("✅ Service Sheets accessible !")
            else:
                print("❌ Service Sheets non accessible")
                return False
        except Exception as e:
            print(f"❌ Erreur accès service Sheets: {e}")
            return False
        
        print("🎉 Tous les tests réussis !")
        return True
        
    except Exception as e:
        print(f"❌ Erreur test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_connection_manager()
