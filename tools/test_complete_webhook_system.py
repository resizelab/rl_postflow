#!/usr/bin/env python3
"""
Test complet du système webhook PostFlow
Lance le dashboard avec la page webhook intégrée
"""

import sys
import os
import time
import logging
import threading
from pathlib import Path

# Ajouter le répertoire parent pour les imports
sys.path.append(str(Path(__file__).parent.parent))

# Changer le répertoire de travail vers la racine du projet
os.chdir(Path(__file__).parent.parent)

from src.services.webhook_service import WebhookService
from src.utils.upload_tracker import UploadTracker
import dashboard

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_complete_system():
    """Test du système complet webhook + dashboard"""
    
    print("🚀 Test système complet PostFlow Webhook + Dashboard")
    print("="*60)
    
    # Configuration de test
    config = {
        "webhook": {
            "enabled": True,
            "port": 8080,
            "auto_start": True,
            "auto_configure_frameio": False
        }
    }
    
    # Créer le tracker d'uploads
    upload_tracker = UploadTracker()
    
    # Créer le service webhook
    webhook_service = WebhookService(
        upload_tracker=upload_tracker,
        config=config,
        auto_start=True
    )
    
    try:
        # Démarrer le service webhook
        print("🎣 Démarrage du service webhook...")
        if webhook_service.start_service():
            webhook_url = webhook_service.get_webhook_url()
            print(f"✅ Service webhook actif: {webhook_url}")
            
            # Ajouter le service webhook au dashboard globalement
            dashboard.webhook_service = webhook_service
            
            # Modifier les routes API du dashboard pour utiliser le service
            @dashboard.app.route('/api/webhook/status')
            def api_webhook_status_live():
                """API: Statut du service webhook (version live)"""
                try:
                    status = webhook_service.get_service_status()
                    return dashboard.jsonify(status)
                except Exception as e:
                    return dashboard.jsonify({"error": str(e)}), 500

            @dashboard.app.route('/api/webhook/test', methods=['POST'])
            def api_webhook_test_live():
                """API: Tester le webhook (version live)"""
                try:
                    success = webhook_service.test_webhook()
                    if success:
                        return dashboard.jsonify({"status": "success", "message": "Test webhook réussi"})
                    else:
                        return dashboard.jsonify({"status": "error", "message": "Test webhook échoué"}), 500
                except Exception as e:
                    return dashboard.jsonify({"error": str(e)}), 500
            
            # Démarrer le dashboard
            print("🌐 Démarrage du dashboard avec page webhook...")
            print(f"📊 Dashboard disponible sur: http://localhost:8081")
            print(f"🎣 Page webhook disponible sur: http://localhost:8081/webhook")
            print(f"🔗 Webhook Frame.io disponible sur: {webhook_url}")
            
            print("\n" + "="*60)
            print("🎉 SYSTÈME COMPLET ACTIF !")
            print("="*60)
            print("📌 URLs importantes:")
            print(f"   • Dashboard: http://localhost:8081")
            print(f"   • Webhook Manager: http://localhost:8081/webhook")
            print(f"   • Frame.io Webhook: {webhook_url}")
            print(f"   • API Status: http://localhost:8081/api/webhook/status")
            print("="*60)
            print("⏹️  Appuyez sur Ctrl+C pour arrêter...")
            
            # Lancer le dashboard Flask
            dashboard.main()
            
        else:
            print("❌ Échec démarrage service webhook")
            return False
    
    except KeyboardInterrupt:
        print("\n🛑 Arrêt demandé...")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    
    finally:
        # Nettoyage
        print("🧹 Nettoyage...")
        webhook_service.stop_service()
        print("✅ Test terminé")

if __name__ == "__main__":
    test_complete_system()
