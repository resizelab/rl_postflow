#!/usr/bin/env python3
"""
Test du système de tracking intelligent intégré au webhook Cloudflare
"""

import sys
import os
import time
import logging
import json
from datetime import datetime

# Ajouter le répertoire parent pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.services.webhook_service import WebhookService
from src.utils.upload_tracker import UploadTracker
from src.integrations.frameio.intelligent_tracker import IntelligentWebhookTracker, integrate_intelligent_tracking

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_intelligent_tracking():
    """Test du tracking intelligent avec le webhook Cloudflare existant"""
    
    print("🧠 Test du Tracking Intelligent avec Cloudflare")
    print("="*60)
    
    # Configuration
    config = {
        "webhook": {
            "enabled": True,
            "port": 8080,
            "auto_start": True,
            "auto_configure_frameio": False
        }
    }
    
    # Créer les composants
    upload_tracker = UploadTracker()
    webhook_service = WebhookService(
        upload_tracker=upload_tracker,
        config=config,
        auto_start=True
    )
    
    try:
        # 1. Démarrer le service webhook (avec Cloudflare)
        print("🌐 Démarrage du service webhook avec Cloudflare...")
        if not webhook_service.start_service():
            print("❌ Échec démarrage service webhook")
            return False
        
        webhook_url = webhook_service.get_webhook_url()
        print(f"✅ Webhook Cloudflare actif: {webhook_url}")
        
        # 2. Intégrer le tracking intelligent
        print("\n🧠 Intégration du tracking intelligent...")
        intelligent_tracker = integrate_intelligent_tracking(webhook_service)
        print("✅ Tracking intelligent intégré")
        
        # 3. Simuler l'enregistrement d'uploads pour tracking
        print("\n📝 Enregistrement d'uploads de test...")
        
        # Upload 1
        upload_id_1 = "upload_test_001"
        filename_1 = "video_projet_001.mp4"
        intelligent_tracker.register_upload_for_tracking(
            upload_id=upload_id_1,
            filename=filename_1,
            project_id="test_project_123",
            workspace_id="test_workspace_456"
        )
        
        # Upload 2
        upload_id_2 = "upload_test_002"
        filename_2 = "animation_scene_05.mov"
        intelligent_tracker.register_upload_for_tracking(
            upload_id=upload_id_2,
            filename=filename_2,
            file_id="frame_file_789",  # Simuler qu'on a déjà le file_id
            project_id="test_project_123",
            workspace_id="test_workspace_456"
        )
        
        print(f"✅ Uploads enregistrés pour tracking: {filename_1}, {filename_2}")
        
        # 4. Simuler des événements webhook Frame.io
        print("\n🔔 Simulation d'événements webhook...")
        
        # Événement file.ready pour upload_1
        webhook_event_1 = {
            "type": "file.ready",
            "account": {"id": "account_123"},
            "project": {"id": "test_project_123"},
            "workspace": {"id": "test_workspace_456"},
            "resource": {
                "id": "frame_file_001",
                "type": "file",
                "name": filename_1,
                "status": "ready",
                "share_link": "https://frame.io/share/abc123"
            },
            "user": {"id": "user_789"}
        }
        
        intelligent_tracker.process_webhook_intelligently(webhook_event_1)
        print(f"✅ Événement file.ready traité pour: {filename_1}")
        
        # Événement comment.created pour upload_2
        webhook_event_2 = {
            "type": "comment.created",
            "account": {"id": "account_123"},
            "project": {"id": "test_project_123"},
            "workspace": {"id": "test_workspace_456"},
            "resource": {
                "id": "frame_file_789",
                "type": "file", 
                "name": filename_2,
                "text": "Looks good! Approved ✅"
            },
            "user": {"id": "user_789"}
        }
        
        intelligent_tracker.process_webhook_intelligently(webhook_event_2)
        print(f"✅ Événement comment.created traité pour: {filename_2}")
        
        # 5. Afficher les statistiques
        print("\n📊 Statistiques du tracking intelligent...")
        stats = intelligent_tracker.get_tracking_statistics()
        
        print(f"📈 Uploads trackés au total: {stats['total_tracked']}")
        print(f"📈 Uploads actifs: {stats['active_tracks']}")
        print(f"📈 Événements traités: {stats['events_processed']}")
        print(f"📈 Commentaires analysés: {stats['comments_analyzed']}")
        
        print("\n📋 Distribution des statuts:")
        for status, count in stats['status_distribution'].items():
            print(f"   {status}: {count}")
        
        print("\n📋 Distribution des statuts de review:")
        for review_status, count in stats['review_status_distribution'].items():
            print(f"   {review_status}: {count}")
        
        # 6. Afficher les détails des uploads
        print("\n📝 Détails des uploads trackés:")
        for upload_id in stats['active_uploads']:
            details = intelligent_tracker.get_upload_details(upload_id)
            if details:
                print(f"\n🔍 Upload {upload_id}:")
                print(f"   📁 Fichier: {details['filename']}")
                print(f"   📊 Statut: {details['status']}")
                print(f"   👁️ Review: {details['review_status']}")
                print(f"   💬 Commentaires: {details['comments_count']}")
                print(f"   🔗 File ID: {details.get('file_id', 'N/A')}")
                print(f"   📅 Créé: {details['created_at']}")
                print(f"   🔄 Événements reçus: {len(details['webhook_events_received'])}")
        
        # 7. Test du routage intelligent
        print("\n🎯 Test du routage intelligent...")
        
        # Test avec file_id connu
        test_lookup_1 = intelligent_tracker._find_upload_for_resource("frame_file_789", "")
        print(f"✅ Routage par file_id: {test_lookup_1}")
        
        # Test avec filename
        test_lookup_2 = intelligent_tracker._find_upload_for_resource("", filename_1)
        print(f"✅ Routage par filename: {test_lookup_2}")
        
        # Test de similarité
        test_lookup_3 = intelligent_tracker._find_upload_for_resource("", "video_projet_001_final.mp4")
        print(f"✅ Routage fuzzy: {test_lookup_3}")
        
        print(f"\n🌐 Webhook disponible: {webhook_url}")
        print("📝 Le tracking intelligent est maintenant actif!")
        print("💡 Tous les événements webhook seront automatiquement trackés")
        print("\n⏹️ Appuyez sur Ctrl+C pour arrêter...")
        
        # Garder le système actif
        try:
            while True:
                time.sleep(5)
                
                # Afficher les stats périodiquement
                current_stats = intelligent_tracker.get_tracking_statistics()
                if current_stats['events_processed'] != stats.get('events_processed', 0):
                    print(f"📊 Nouveaux événements traités: {current_stats['events_processed']}")
                    stats = current_stats
                
        except KeyboardInterrupt:
            print("\n🛑 Arrêt demandé...")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        # Nettoyage
        print("🧹 Nettoyage...")
        if hasattr(webhook_service, 'intelligent_tracker'):
            webhook_service.intelligent_tracker.stop_intelligent_monitoring()
        webhook_service.stop_service()
        print("✅ Test terminé")

def demo_intelligent_features():
    """Démo des fonctionnalités intelligentes"""
    
    print("🎯 Démonstration des Fonctionnalités Intelligentes")
    print("="*60)
    
    features = [
        {
            "titre": "🔍 Routage Intelligent",
            "description": "Trouve automatiquement l'upload correspondant",
            "methodes": [
                "✅ Par file_id Frame.io (le plus précis)",
                "✅ Par nom de fichier exact",
                "✅ Par similarité de nom (fuzzy matching)",
                "✅ Mise à jour automatique des mappings"
            ]
        },
        {
            "titre": "💬 Analyse de Commentaires",
            "description": "Détermine automatiquement le statut de review",
            "methodes": [
                "✅ Détection mots-clés d'approbation",
                "✅ Détection mots-clés de rejet", 
                "✅ Score de sentiment global",
                "✅ Pondération par récence des commentaires",
                "✅ Niveau de confiance de l'analyse"
            ]
        },
        {
            "titre": "📊 Tracking d'État",
            "description": "Suit l'évolution de chaque upload",
            "methodes": [
                "✅ Statuts: PENDING → UPLOADING → PROCESSING → READY → COMPLETED",
                "✅ Review: NOT_STARTED → PENDING → APPROVED/REJECTED/CHANGES_NEEDED",
                "✅ Historique des événements webhook",
                "✅ Timestamps détaillés"
            ]
        },
        {
            "titre": "🔄 Monitoring Automatique",
            "description": "Surveillance continue en arrière-plan",
            "methodes": [
                "✅ Vérification périodique des commentaires",
                "✅ Nettoyage automatique des anciens tracks",
                "✅ Statistiques en temps réel",
                "✅ Gestion d'erreurs robuste"
            ]
        },
        {
            "titre": "🧠 Intégration Transparente",
            "description": "S'intègre dans le système existant",
            "methodes": [
                "✅ Compatible avec webhook Cloudflare existant",
                "✅ Enrichit les données sans les remplacer",
                "✅ API simple pour enregistrer les uploads",
                "✅ Statistiques détaillées disponibles"
            ]
        }
    ]
    
    for feature in features:
        print(f"\n{feature['titre']}")
        print("-" * 40)
        print(f"{feature['description']}")
        print()
        for methode in feature['methodes']:
            print(f"  {methode}")
    
    print(f"\n💡 Comment utiliser:")
    print("1. Votre webhook Cloudflare continue de fonctionner normalement")
    print("2. Enregistrez chaque upload avec intelligent_tracker.register_upload_for_tracking()")
    print("3. Le système track automatiquement tous les événements")
    print("4. Consultez les stats avec intelligent_tracker.get_tracking_statistics()")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Test tracking intelligent")
    parser.add_argument("--demo", action="store_true", help="Afficher la démo des fonctionnalités")
    parser.add_argument("--test", action="store_true", help="Lancer le test complet")
    
    args = parser.parse_args()
    
    if args.demo:
        demo_intelligent_features()
    elif args.test:
        test_intelligent_tracking()
    else:
        print("Utilisez --demo ou --test")
        print("Exemple: python test_intelligent_tracking.py --test")
