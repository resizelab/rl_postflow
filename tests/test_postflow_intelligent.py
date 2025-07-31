#!/usr/bin/env python3
"""
Test complet du système avec tracking intelligent intégré
Utilise la configuration existante et ajoute le tracking intelligent
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

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def load_config():
    """Charge la configuration du projet"""
    try:
        with open('pipeline_config.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erreur chargement config: {e}")
        # Configuration de fallback
        return {
            "webhook": {
                "enabled": True,
                "port": 8080,
                "auto_start": True,
                "intelligent_tracking": True
            }
        }

def test_postflow_with_intelligent_tracking():
    """Test PostFlow avec tracking intelligent"""
    
    print("🚀 Test PostFlow avec Tracking Intelligent")
    print("="*60)
    
    # Charger la configuration
    config = load_config()
    print(f"✅ Configuration chargée")
    print(f"📋 Webhook activé: {config['webhook']['enabled']}")
    print(f"📋 Tracking intelligent: {config['webhook'].get('intelligent_tracking', False)}")
    
    # Créer les services
    upload_tracker = UploadTracker()
    webhook_service = WebhookService(
        upload_tracker=upload_tracker,
        config=config,
        auto_start=True
    )
    
    try:
        # 1. Démarrer le service webhook
        print("\n🌐 Démarrage du service webhook...")
        if not webhook_service.start_service():
            print("❌ Échec démarrage service webhook")
            return False
        
        webhook_url = webhook_service.get_webhook_url()
        print(f"✅ Service webhook actif: {webhook_url}")
        
        # Vérifier si le tracking intelligent est actif
        if webhook_service.intelligent_tracker:
            print("🧠 Tracking intelligent activé")
        else:
            print("⚠️ Tracking intelligent non disponible")
        
        # 2. Simuler des uploads avec tracking intelligent
        print("\n📝 Simulation d'uploads avec tracking...")
        
        test_uploads = [
            {
                "upload_id": "postflow_upload_001",
                "filename": "documentary_scene_01.mp4",
                "project": "UNDLM Documentary",
                "file_id": None  # Sera obtenu après upload Frame.io
            },
            {
                "upload_id": "postflow_upload_002", 
                "filename": "intro_animation.mov",
                "project": "UNDLM Documentary",
                "file_id": "frame_io_abc123"  # Simuler qu'on a déjà le file_id
            },
            {
                "upload_id": "postflow_upload_003",
                "filename": "background_music.wav",
                "project": "UNDLM Documentary", 
                "file_id": None
            }
        ]
        
        # Enregistrer les uploads pour tracking
        for upload_data in test_uploads:
            success = webhook_service.register_upload_for_intelligent_tracking(
                upload_id=upload_data["upload_id"],
                filename=upload_data["filename"],
                file_id=upload_data["file_id"],
                project_id="test_project_undlm",
                workspace_id="test_workspace_undlm"
            )
            
            if success:
                print(f"✅ Upload enregistré: {upload_data['filename']}")
            else:
                print(f"❌ Échec enregistrement: {upload_data['filename']}")
        
        # 3. Simuler des événements webhook Frame.io
        print("\n🔔 Simulation d'événements webhook Frame.io...")
        
        # Événement 1: file.ready pour documentary_scene_01.mp4
        webhook_event_1 = {
            "type": "file.ready",
            "account": {"id": "account_undlm"},
            "project": {"id": "test_project_undlm"},
            "workspace": {"id": "test_workspace_undlm"},
            "resource": {
                "id": "frame_file_doc_001",
                "type": "file",
                "name": "documentary_scene_01.mp4",
                "status": "ready",
                "share_link": "https://frame.io/share/doc001"
            },
            "user": {"id": "user_postflow"}
        }
        
        # Traiter via le webhook manager (simulation)
        if webhook_service.webhook_manager:
            webhook_service.webhook_manager.process_webhook_sync(webhook_event_1)
            print("✅ Événement file.ready traité")
        
        # Événement 2: comment.created pour intro_animation.mov
        webhook_event_2 = {
            "type": "comment.created",
            "account": {"id": "account_undlm"},
            "project": {"id": "test_project_undlm"},
            "workspace": {"id": "test_workspace_undlm"},
            "resource": {
                "id": "frame_io_abc123",
                "type": "file",
                "name": "intro_animation.mov",
                "text": "Animation looks great! Ready to approve ✅"
            },
            "user": {"id": "user_reviewer"}
        }
        
        if webhook_service.webhook_manager:
            webhook_service.webhook_manager.process_webhook_sync(webhook_event_2)
            print("✅ Événement comment.created traité")
        
        # Événement 3: comment.created avec rejet
        webhook_event_3 = {
            "type": "comment.created",
            "account": {"id": "account_undlm"},
            "project": {"id": "test_project_undlm"}, 
            "workspace": {"id": "test_workspace_undlm"},
            "resource": {
                "id": "frame_file_doc_001",
                "type": "file",
                "name": "documentary_scene_01.mp4",
                "text": "Color correction needs work. Please fix the shadows."
            },
            "user": {"id": "user_reviewer"}
        }
        
        if webhook_service.webhook_manager:
            webhook_service.webhook_manager.process_webhook_sync(webhook_event_3)
            print("✅ Événement comment.created (feedback) traité")
        
        # 4. Afficher les statistiques du tracking intelligent
        time.sleep(2)  # Laisser le temps au système de traiter
        
        print("\n📊 Statistiques du Tracking Intelligent")
        print("-" * 40)
        
        stats = webhook_service.get_intelligent_tracking_stats()
        
        if "error" not in stats:
            print(f"📈 Total uploads trackés: {stats.get('total_tracked', 0)}")
            print(f"📈 Uploads actifs: {stats.get('active_tracks', 0)}")
            print(f"📈 Événements traités: {stats.get('events_processed', 0)}")
            print(f"📈 Commentaires analysés: {stats.get('comments_analyzed', 0)}")
            
            print("\n📋 Distribution des statuts:")
            for status, count in stats.get('status_distribution', {}).items():
                print(f"   {status}: {count}")
            
            print("\n📋 Distribution des reviews:")
            for review_status, count in stats.get('review_status_distribution', {}).items():
                print(f"   {review_status}: {count}")
        else:
            print(f"❌ Erreur récupération stats: {stats['error']}")
        
        # 5. Afficher les détails de chaque upload
        print("\n📝 Détails des Uploads Trackés")
        print("-" * 40)
        
        for upload_data in test_uploads:
            upload_id = upload_data["upload_id"]
            details = webhook_service.get_upload_tracking_details(upload_id)
            
            if details:
                print(f"\n🔍 {upload_data['filename']}:")
                print(f"   📊 Statut: {details.get('status', 'N/A')}")
                print(f"   👁️ Review: {details.get('review_status', 'N/A')}")
                print(f"   💬 Commentaires: {details.get('comments_count', 0)}")
                print(f"   🔗 File ID: {details.get('file_id', 'N/A')}")
                print(f"   📅 Créé: {details.get('created_at', 'N/A')}")
                
                events = details.get('webhook_events_received', [])
                if events:
                    print(f"   🔔 Événements reçus:")
                    for event in events[-3:]:  # 3 derniers événements
                        print(f"      • {event}")
            else:
                print(f"❌ Pas de détails pour: {upload_data['filename']}")
        
        # 6. Test des fonctionnalités avancées
        print("\n🎯 Test des fonctionnalités avancées")
        print("-" * 40)
        
        # Test du webhook standard
        print("🧪 Test webhook standard...")
        test_result = webhook_service.test_webhook()
        print(f"✅ Test webhook: {'Réussi' if test_result else 'Échoué'}")
        
        # Test service status
        service_status = webhook_service.get_service_status()
        print(f"📊 Statut service: {service_status.get('status', 'Unknown')}")
        print(f"📊 URL webhook: {service_status.get('webhook_url', 'N/A')}")
        
        print(f"\n🌐 Système complet actif!")
        print(f"   Webhook Cloudflare: {webhook_url}")
        print(f"   Tracking intelligent: {'Actif' if webhook_service.intelligent_tracker else 'Inactif'}")
        print(f"   Configuration: pipeline_config.json")
        
        print("\n💡 Comment utiliser dans votre code:")
        print("   1. webhook_service.register_upload_for_intelligent_tracking(upload_id, filename)")
        print("   2. Les événements webhook sont automatiquement trackés")
        print("   3. webhook_service.get_intelligent_tracking_stats() pour les stats")
        print("   4. webhook_service.get_upload_tracking_details(upload_id) pour les détails")
        
        print("\n⏹️ Appuyez sur Ctrl+C pour arrêter...")
        
        # Surveillance continue
        try:
            while True:
                time.sleep(30)
                
                # Afficher les stats mises à jour
                current_stats = webhook_service.get_intelligent_tracking_stats()
                if "error" not in current_stats:
                    events_count = current_stats.get('events_processed', 0)
                    if events_count != stats.get('events_processed', 0):
                        print(f"📊 Nouveaux événements traités: {events_count}")
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
        webhook_service.stop_service()
        print("✅ Test terminé")

if __name__ == "__main__":
    test_postflow_with_intelligent_tracking()
