#!/usr/bin/env python3
"""
Test d'envoi du daily report sans double affichage d'heure
"""

import sys
import json
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord.notifier import DiscordNotifier

def test_daily_report():
    """Test le daily report sans double affichage d'heure."""
    
    print("🧪 Test du daily report Discord (sans double heure)...")
    
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
        notifier = DiscordNotifier(config_wrapper)
        
        # Stats de test pour le daily report
        stats = {
            'completion_percentage': 85.2,
            'status_counts': {
                'error': 2
            }
        }
        
        unique_scenes = 15
        source_files = 320
        duplicates = 8
        gaps = 3
        
        print(f"📊 Envoi du daily report avec les stats: {stats}")
        
        # Créer l'embed (copié et modifié du daily_report.py)
        embed = {
            "title": "📋 Rapport Quotidien de Production",
            "description": "Statistiques détaillées du pipeline PostFlow",
            "color": 0x9932cc,  # Violet
            "fields": [
                {"name": "🎬 Scènes Uniques", "value": str(unique_scenes), "inline": True},
                {"name": "📁 Fichiers Sources", "value": str(source_files), "inline": True},
                {"name": "🔄 Doublons Détectés", "value": str(duplicates), "inline": True},
                {"name": "⚠️ Trous Nomenclature", "value": str(gaps), "inline": True},
                {"name": "📊 Taux de Completion", "value": f"{stats['completion_percentage']:.1f}%", "inline": True}
            ]
        }
        
        # Ajouter une analyse des erreurs si il y en a
        if stats['status_counts']['error'] > 0:
            embed["fields"].append({
                "name": "🚨 Attention",
                "value": f"{stats['status_counts']['error']} plans en erreur nécessitent une attention",
                "inline": False
            })
        
        result = notifier.send_message("📋 **Rapport Quotidien Détaillé**", embed)
        
        if result:
            print("✅ Daily report envoyé avec succès!")
            print("🕐 Vérifiez sur Discord: il ne devrait y avoir qu'un seul timestamp")
            print("   (le timestamp automatique de Discord en bas de l'embed)")
        else:
            print("❌ Échec de l'envoi du daily report")
            
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return False
    
    return result

if __name__ == "__main__":
    test_daily_report()
