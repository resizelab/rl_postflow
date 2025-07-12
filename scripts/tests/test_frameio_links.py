#!/usr/bin/env python3
"""
Test des liens Frame.io et des partages
"""
import asyncio
import sys
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.integrations.frameio.upload import FrameIOUploadManager
from src.utils.config import ConfigManager

async def test_frameio_links():
    """Test des liens Frame.io avec des file_ids existants"""
    try:
        config = ConfigManager('config/integrations.json')
        manager = FrameIOUploadManager(config)
        
        print("🧪 Test des liens Frame.io...")
        
        # Test avec des file_ids récents de vos logs
        test_file_ids = [
            "1d5b2082-a4bf-4999-a2ad-86bcbc459947",  # Dernier upload
            "333efea1-4b57-49a2-813a-2a9c7b76f61b",  # Upload précédent
        ]
        
        for file_id in test_file_ids:
            print(f"\n📁 Test file_id: {file_id}")
            
            # Test 1: Récupérer les infos du fichier
            file_info = await manager._get_file_info(file_id)
            if file_info:
                print(f"  ✅ Fichier trouvé: {file_info.get('name', 'N/A')}")
                print(f"  📊 Statut: {file_info.get('status', 'N/A')}")
                print(f"  🎯 Projet: {file_info.get('project_id', 'N/A')}")
            else:
                print(f"  ❌ Fichier non trouvé")
                continue
            
            # Test 2: Générer le lien de review
            review_link = await manager.get_file_review_link(file_id)
            print(f"  🔗 Lien de review: {review_link}")
            
            # Test 3: Tester l'accessibilité du lien (très basique)
            import httpx
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(review_link, timeout=10)
                    if response.status_code == 200:
                        print(f"  ✅ Lien accessible (HTTP 200)")
                    else:
                        print(f"  ⚠️ Lien retourne HTTP {response.status_code}")
            except Exception as e:
                print(f"  ❌ Erreur test accessibilité: {e}")
        
        print("\n🎯 Tests terminés!")
        
    except Exception as e:
        print(f"❌ Erreur test: {e}")

if __name__ == "__main__":
    asyncio.run(test_frameio_links())
