#!/usr/bin/env python3
"""
Test comparatif de performance entre connexions multiples et persistantes
"""

import sys
import os
import time
import asyncio
# Ajouter le chemin vers la racine du projet
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from src.integrations.google import connection_manager, OptimizedSheetsStatusAdapter
from src.integrations.sheets.simple_user_manager import SimpleGoogleSheetsUserManager

async def test_performance_comparison():
    print("🏎️ Test comparatif de performance...")
    
    spreadsheet_id = '1mVni49q63ItOvChyUmh7AD_BXN-MsMhz4krzGzMOUKI'
    credentials_file = 'config/google_credentials.json'
    
    # === TEST 1: MÉTHODE ANCIENNE (nouvelle connexion à chaque fois) ===
    print("\n📊 TEST 1: Méthode ancienne (nouvelles connexions)")
    start_time = time.time()
    
    try:
        # Simuler 5 mises à jour comme dans l'ancienne méthode
        for i in range(5):
            print(f"  🔄 Connexion {i+1}/5...")
            user_manager = SimpleGoogleSheetsUserManager(credentials_file)
            service = user_manager.get_service()  # Nouvelle connexion à chaque fois !
            
            # Simuler une opération basique
            result = service.spreadsheets().get(
                spreadsheetId=spreadsheet_id,
                fields='properties.title'
            ).execute()
            
            print(f"  ✅ Connexion {i+1} réussie: {result['properties']['title']}")
    
    except Exception as e:
        print(f"❌ Erreur méthode ancienne: {e}")
    
    old_method_time = time.time() - start_time
    print(f"⏱️ Temps méthode ancienne: {old_method_time:.2f}s")
    
    # === TEST 2: MÉTHODE NOUVELLE (connexion persistante) ===
    print("\n📊 TEST 2: Méthode nouvelle (connexion persistante)")
    start_time = time.time()
    
    try:
        # Initialiser une seule fois
        connection_manager.initialize(credentials_file, spreadsheet_id)
        
        # Simuler 5 mises à jour avec la même connexion
        for i in range(5):
            print(f"  🔄 Opération {i+1}/5...")
            service = connection_manager.get_sheets_service()  # Connexion réutilisée !
            
            # Même opération basique
            result = service.spreadsheets().get(
                spreadsheetId=spreadsheet_id,
                fields='properties.title'
            ).execute()
            
            print(f"  ✅ Opération {i+1} réussie: {result['properties']['title']}")
    
    except Exception as e:
        print(f"❌ Erreur méthode nouvelle: {e}")
    
    new_method_time = time.time() - start_time
    print(f"⏱️ Temps méthode nouvelle: {new_method_time:.2f}s")
    
    # === COMPARAISON ===
    print(f"\n🏆 RÉSULTATS:")
    print(f"📊 Méthode ancienne: {old_method_time:.2f}s")
    print(f"📊 Méthode nouvelle: {new_method_time:.2f}s")
    
    if old_method_time > new_method_time:
        improvement = ((old_method_time - new_method_time) / old_method_time) * 100
        print(f"🚀 AMÉLIORATION: {improvement:.1f}% plus rapide !")
        print(f"⚡ Gain de temps: {old_method_time - new_method_time:.2f}s")
    else:
        print("📊 Pas d'amélioration significative détectée")
    
    # === TEST 3: TEST D'ADAPTATEUR OPTIMISÉ ===
    print(f"\n📊 TEST 3: Adaptateur optimisé")
    start_time = time.time()
    
    try:
        adapter = OptimizedSheetsStatusAdapter(
            connection_manager,
            spreadsheet_id,
            'SHOTS_TRACK'
        )
        
        # Test de recherche de shot
        row_number = await adapter.find_shot_row('UNDLM_00036')
        if row_number:
            print(f"✅ Shot trouvé à la ligne: {row_number}")
        else:
            print("❌ Shot non trouvé")
            
    except Exception as e:
        print(f"❌ Erreur adaptateur optimisé: {e}")
    
    adapter_time = time.time() - start_time
    print(f"⏱️ Temps adaptateur optimisé: {adapter_time:.2f}s")

if __name__ == "__main__":
    asyncio.run(test_performance_comparison())
