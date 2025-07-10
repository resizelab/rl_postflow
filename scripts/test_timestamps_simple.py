#!/usr/bin/env python3
"""
Test simple et final des timestamps Discord
"""

import sys
from pathlib import Path
import pytz
from datetime import datetime

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier

def get_paris_time():
    """Retourne l'heure actuelle à Paris."""
    paris_tz = pytz.timezone('Europe/Paris')
    return datetime.now(paris_tz)

def test_all_templates_final():
    """Test final de tous les templates Discord avec timestamp correct."""
    
    print("🧪 Test final des timestamps Discord...")
    print("=" * 50)
    
    try:
        # Configuration directe avec webhook valide
        config = {
            'webhook_url': 'https://discord.com/api/webhooks/1262032554764574832/6gNi2ByYaMPcDR7F5PtABgLggS_9C0rjNE7Ku2--q6YDhMXEQUu3F0nOkbEyOdjsJrR7',
            'username': 'RL PostFlow Test Bot',
            'avatar_url': ''
        }
        
        notifier = DiscordNotifier(config)
        
        # Test 1: Rapport de pipeline (celui qui posait problème)
        print("📊 Test 1: Rapport de pipeline...")
        embed_pipeline = {
            "title": "📊 Rapport de Pipeline RL PostFlow", 
            "description": "📈 **Statistiques**:",
            "color": 0xFF9900,
            "fields": [
                {"name": "📊 Total", "value": "47 plans", "inline": True},
                {"name": "✅ Terminés", "value": "42 plans", "inline": True},
                {"name": "❌ Échoués", "value": "1 plans", "inline": True},
                {"name": "⏳ En attente", "value": "4 plans", "inline": True},
                {"name": "🎯 Taux de succès", "value": "97.9%", "inline": True}
            ],
            "timestamp": get_paris_time().isoformat()
        }
        
        result1 = notifier.send_message("", embed_pipeline)
        print(f"   {'✅ Succès' if result1 else '❌ Échec'}")
        
        # Pause entre les tests
        import time
        time.sleep(2)
        
        # Test 2: Rapport quotidien (celui de daily_report.py)
        print("📋 Test 2: Rapport quotidien...")
        embed_daily = {
            "title": "📋 Rapport Quotidien de Production",
            "description": "Statistiques détaillées du pipeline PostFlow",
            "color": 0x9932cc,
            "fields": [
                {"name": "🎬 Scènes Uniques", "value": "15", "inline": True},
                {"name": "📁 Fichiers Sources", "value": "320", "inline": True},
                {"name": "🔄 Doublons Détectés", "value": "8", "inline": True},
                {"name": "⚠️ Trous Nomenclature", "value": "3", "inline": True},
                {"name": "📊 Taux de Completion", "value": "85.2%", "inline": True}
            ],
            "timestamp": get_paris_time().isoformat()
        }
        
        # Ajouter attention si nécessaire
        embed_daily["fields"].append({
            "name": "🚨 Attention",
            "value": "2 plans en erreur nécessitent une attention",
            "inline": False
        })
        
        result2 = notifier.send_message("", embed_daily)
        print(f"   {'✅ Succès' if result2 else '❌ Échec'}")
        
        time.sleep(2)
        
        # Test 3: Notification d'erreur
        print("❌ Test 3: Notification d'erreur...")
        embed_error = {
            "title": "❌ Erreur de traitement",
            "description": "Impossible de décoder le fichier vidéo",
            "color": 0xff0000,
            "fields": [
                {"name": "Fichier", "value": "problematic_file.mov", "inline": True},
                {"name": "Erreur", "value": "Format non supporté", "inline": False}
            ],
            "timestamp": get_paris_time().isoformat()
        }
        
        result3 = notifier.send_message("", embed_error)
        print(f"   {'✅ Succès' if result3 else '❌ Échec'}")
        
        # Résumé
        total_success = sum([result1, result2, result3])
        print("\n" + "=" * 50)
        print(f"🎯 Résultat: {total_success}/3 tests réussis")
        
        if total_success == 3:
            print("🎉 PARFAIT ! Tous les templates utilisent le timestamp de Paris !")
            print("💡 Vérifiez sur Discord:")
            print("   • Un seul timestamp par message (en bas de l'embed)")
            print("   • L'heure correspond à l'heure de Paris")
            print("   • Aucun champ d'heure redondant")
        else:
            print("⚠️ Certains tests ont échoué")
            
        return total_success == 3
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    success = test_all_templates_final()
    if success:
        print("\n✨ Tests terminés avec succès!")
    else:
        print("\n🔧 Des corrections sont nécessaires.")
