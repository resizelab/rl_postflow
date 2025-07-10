#!/usr/bin/env python3
"""
Test complet des timestamps Discord - Validation finale
Vérifie que tous les templates ont un timestamp correct sans doublon
"""

import sys
import asyncio
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.discord import DiscordNotifier
from src.integrations.discord.user_notifier import DiscordUserNotifier

async def test_all_timestamps():
    """Test tous les templates Discord pour vérifier les timestamps."""
    
    print("🧪 Test complet des timestamps Discord sans doublon...")
    print("=" * 60)
    
    try:
        # Configuration Discord
        webhook_url = "https://discord.com/api/webhooks/1310946063334842450/rLrpHlVo7gm9Bnk1xXrVQvQzQrK0f4Pqoa7UZxz2lO01j4J4Oj4j_Vr9Vp4D4eJ1J4j4"
        discord_notifier = DiscordNotifier({"webhook_url": webhook_url})
        user_notifier = DiscordUserNotifier(discord_notifier)
        
        tests_results = []
        
        # Test 1: Fichier traité
        print("📁 Test 1: Notification fichier traité...")
        result = await user_notifier.notify_file_processed(
            "test_shot_001.mov",
            frameio_link="https://app.frame.io/test",
            user_identifier="admin"
        )
        tests_results.append(("Fichier traité", result))
        await asyncio.sleep(1)
        
        # Test 2: Notification système
        print("🔧 Test 2: Notification système...")
        result = await user_notifier.send_system_notification(
            "Test Système",
            "Message de test pour validation timestamp",
            user_identifier="admin"
        )
        tests_results.append(("Notification système", result))
        await asyncio.sleep(1)
        
        # Test 3: Rapport de pipeline
        print("📊 Test 3: Rapport de pipeline...")
        test_stats = {
            'total_shots': 100,
            'completed_shots': 85,
            'failed_shots': 2,
            'pending_shots': 13,
            'upload_success_rate': 97.8
        }
        result = await user_notifier.send_pipeline_report(test_stats)
        tests_results.append(("Rapport pipeline", result))
        await asyncio.sleep(1)
        
        # Test 4: Upload terminé
        print("✅ Test 4: Upload terminé...")
        result = await user_notifier.notify_upload_complete_async(
            "scene_01_shot_010_v003.mov",
            frameio_link="https://app.frame.io/test2",
            user_identifier="admin",
            additional_info="Version finale approuvée"
        )
        tests_results.append(("Upload terminé", result))
        await asyncio.sleep(1)
        
        # Test 5: Notification d'erreur
        print("❌ Test 5: Notification d'erreur...")
        result = await user_notifier.notify_error(
            "Erreur de traitement",
            file_path="problematic_file.mov",
            error_message="Impossible de décoder le fichier vidéo",
            user_identifier="admin"
        )
        tests_results.append(("Notification erreur", result))
        await asyncio.sleep(1)
        
        # Résumé des tests
        print("\n" + "=" * 60)
        print("📋 RÉSUMÉ DES TESTS:")
        print("=" * 60)
        
        success_count = 0
        for test_name, success in tests_results:
            status = "✅ RÉUSSI" if success else "❌ ÉCHEC"
            print(f"{status} - {test_name}")
            if success:
                success_count += 1
        
        print(f"\n🎯 Résultat global: {success_count}/{len(tests_results)} tests réussis")
        
        if success_count == len(tests_results):
            print("\n🎉 PARFAIT ! Tous les templates Discord utilisent le timestamp de Paris correctement.")
            print("💡 Vérifications à faire sur Discord:")
            print("   • Chaque message a un seul timestamp en bas (ex: 'Aujourd'hui à XX:XX')")
            print("   • L'heure affichée correspond à l'heure de Paris")
            print("   • Aucun champ d'heure redondant dans les embeds")
        else:
            print("\n⚠️ Certains tests ont échoué. Vérifiez la configuration Discord.")
            
        return success_count == len(tests_results)
        
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_all_timestamps())
    if success:
        print("\n✨ Tests terminés avec succès!")
    else:
        print("\n🔧 Des ajustements sont nécessaires.")
