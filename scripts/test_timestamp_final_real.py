#!/usr/bin/env python3
"""
Test rapide avec vraie config Discord
"""

import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.utils.config import ConfigManager

async def test_timestamp_with_real_config():
    """Test avec la vraie configuration Discord."""
    
    print("🧪 Test timestamp avec vraie configuration...")
    
    try:
        # Charger la vraie configuration
        config = ConfigManager()
        
        # Créer le notifier avec la vraie config
        notifier = DiscordUserNotifier.create_from_config(config)
        
        if not notifier:
            print("❌ Impossible de créer le notifier Discord")
            return False
        
        # Test simple du rapport de pipeline
        print("📊 Test du rapport de pipeline (sans champ d'heure redondant)...")
        
        test_stats = {
            'total_shots': 47,
            'completed_shots': 42,
            'failed_shots': 1,
            'pending_shots': 4,
            'upload_success_rate': 97.9
        }
        
        result = await notifier.send_pipeline_report(test_stats)
        
        if result:
            print("✅ Rapport envoyé avec succès!")
            print("🕐 Vérifiez sur Discord:")
            print("   • Un seul timestamp en bas: 'Aujourd'hui à XX:XX'")
            print("   • Pas de champ '⏰ Mis à jour' dans l'embed")
            print("   • L'heure correspond à Paris")
        else:
            print("❌ Échec de l'envoi")
            
        return result
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_timestamp_with_real_config())
