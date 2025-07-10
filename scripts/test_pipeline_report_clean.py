#!/usr/bin/env python3
"""
Test du rapport de pipeline Discord sans affichage double d'heure
"""

import sys
import asyncio
import json
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.user_notifier import DiscordUserNotifier
from src.integrations.discord.notifier import DiscordNotifier

async def test_pipeline_report():
    """Test le rapport de pipeline sans double affichage d'heure."""
    
    print("🧪 Test du rapport de pipeline Discord (sans double heure)...")
    
    try:
        # Charger la configuration Discord
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        
        if not config_path.exists():
            print(f"❌ Fichier de configuration manquant: {config_path}")
            return False
        
        with open(config_path, 'r') as f:
            config_data = json.load(f)
        
        discord_config = config_data.get('discord', {})
        
        if not discord_config.get('webhook_url'):
            print("❌ URL webhook Discord manquante dans la configuration")
            return False
        
        # Wrapper pour la configuration
        class DiscordConfigWrapper:
            def __init__(self, discord_config):
                self.discord_config = discord_config
            
            def get(self, key, default=None):
                if key == 'discord.webhook_url':
                    return self.discord_config.get('webhook_url', default)
                elif key == 'discord.username':
                    return self.discord_config.get('username', default)
                elif key == 'discord.avatar_url':
                    return self.discord_config.get('avatar_url', default)
                return default
        
        config_wrapper = DiscordConfigWrapper(discord_config)
        discord_notifier = DiscordNotifier(config_wrapper)
        user_notifier = DiscordUserNotifier(discord_notifier=discord_notifier, user_manager=None)
        
        # Statistiques de test
        test_stats = {
            'total_shots': 150,
            'completed_shots': 120,
            'failed_shots': 5,
            'pending_shots': 25,
            'upload_success_rate': 95.5
        }
        
        print(f"📊 Envoi du rapport avec les stats: {test_stats}")
        
        # Envoyer le rapport
        result = await user_notifier.send_pipeline_report(test_stats)
        
        if result:
            print("✅ Rapport de pipeline envoyé avec succès!")
            print("🕐 Vérifiez sur Discord: il ne devrait y avoir qu'un seul timestamp")
            print("   (le timestamp automatique de Discord en bas de l'embed)")
        else:
            print("❌ Échec de l'envoi du rapport")
            
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return False
    
    return result

if __name__ == "__main__":
    asyncio.run(test_pipeline_report())
