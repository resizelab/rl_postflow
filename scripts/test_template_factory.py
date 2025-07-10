#!/usr/bin/env python3
"""
Test du Template Factory Discord
Validation du système centralisé de templates
"""

import sys
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_template_factory():
    """Test le système de templates centralisé."""
    
    print("🧪 Test Template Factory Discord...")
    print("=" * 50)
    
    try:
        from src.integrations.discord.template_factory import DiscordTemplateFactory
        from src.integrations.discord import DiscordNotifier
        
        # Configuration Discord
        config = {
            'webhook_url': 'https://discord.com/api/webhooks/1391301937516777482/Nv0fk2t_JnNPRM02G1-ZZWsOM9BblevES_LO7zZEmp4scLSYkW-qfntYPC7yYeThTafM',
            'username': 'Template Factory Test',
            'avatar_url': ''
        }
        
        notifier = DiscordNotifier(config)
        
        tests_results = []
        
        # Test 1: Template de base
        print("🏗️ Test 1: Template de base...")
        embed1 = DiscordTemplateFactory.create_base_embed(
            "Test Template de Base",
            "Description du template",
            0x00ff00,
            [{"name": "Test", "value": "Valeur test", "inline": True}]
        )
        result1 = notifier.send_message("", embed1)
        tests_results.append(("Template de base", result1))
        print(f"   {'✅ Succès' if result1 else '❌ Échec'}")
        
        import time
        time.sleep(2)
        
        # Test 2: Template fichier traité
        print("📁 Test 2: Template fichier traité...")
        embed2 = DiscordTemplateFactory.create_file_processed_embed(
            "test_video.mov",
            "https://app.frame.io/test",
            "https://example.com/thumbnail.jpg"
        )
        result2 = notifier.send_message("", embed2)
        tests_results.append(("Fichier traité", result2))
        print(f"   {'✅ Succès' if result2 else '❌ Échec'}")
        
        time.sleep(2)
        
        # Test 3: Template rapport pipeline
        print("📊 Test 3: Template rapport pipeline...")
        stats = {
            'total_shots': 100,
            'completed_shots': 85,
            'failed_shots': 5,
            'pending_shots': 10,
            'upload_success_rate': 95.5
        }
        embed3 = DiscordTemplateFactory.create_pipeline_report_embed(stats)
        result3 = notifier.send_message("", embed3)
        tests_results.append(("Rapport pipeline", result3))
        print(f"   {'✅ Succès' if result3 else '❌ Échec'}")
        
        time.sleep(2)
        
        # Test 4: Template upload shot
        print("🎬 Test 4: Template upload shot...")
        embed4 = DiscordTemplateFactory.create_shot_upload_embed(
            "UNDLM_001_010",
            "Scene_001",
            "v003",
            "https://app.frame.io/shot/test"
        )
        result4 = notifier.send_message("", embed4)
        tests_results.append(("Upload shot", result4))
        print(f"   {'✅ Succès' if result4 else '❌ Échec'}")
        
        time.sleep(2)
        
        # Test 5: Template rapport quotidien
        print("📋 Test 5: Template rapport quotidien...")
        embed5 = DiscordTemplateFactory.create_daily_report_embed(
            unique_scenes=15,
            source_files=320,
            duplicates=8,
            gaps=3,
            completion_rate=85.2,
            errors=2
        )
        result5 = notifier.send_message("", embed5)
        tests_results.append(("Rapport quotidien", result5))
        print(f"   {'✅ Succès' if result5 else '❌ Échec'}")
        
        # Résumé
        success_count = sum([result for _, result in tests_results])
        print(f"\n🎯 Résultat: {success_count}/{len(tests_results)} templates fonctionnent")
        
        if success_count == len(tests_results):
            print("🎉 PARFAIT ! Tous les templates fonctionnent avec timestamp Paris !")
            print("💡 Avantages du Template Factory:")
            print("   • Timestamp Paris automatique sur tous les embeds")
            print("   • Code réutilisable et centralisé")
            print("   • Cohérence visuelle garantie")
            print("   • Maintenance simplifiée")
        else:
            print("⚠️ Certains templates ne fonctionnent pas.")
            
        return success_count == len(tests_results)
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_template_factory()
    if success:
        print("\n✨ Template Factory validé!")
    else:
        print("\n🔧 Corrections nécessaires.")
