#!/usr/bin/env python3
"""
Test direct de la fonction main()
"""

import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Mock des arguments pour le test
sys.argv = ['main.py', '--test', '--no-dashboard']

async def test_main():
    try:
        print("🧪 Test de la fonction main()...")
        
        # Import et test
        from main import main
        
        print("✅ Import main() OK")
        
        # Tester avec timeout
        result = await asyncio.wait_for(main(), timeout=30)
        
        print(f"✅ main() terminé avec code: {result}")
        
    except asyncio.TimeoutError:
        print("❌ Timeout - main() bloqué")
    except Exception as e:
        print(f"❌ Erreur main(): {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_main())
