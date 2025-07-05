#!/usr/bin/env python3
"""
Script de configuration des intégrations PostFlow
"""

import os
import sys
import json
from pathlib import Path

def setup_integrations():
    """Configure les intégrations PostFlow interactivement."""
    print("🔧 Configuration des intégrations PostFlow")
    print("=" * 50)
    
    # Charger la configuration existante
    config_path = Path("config/integrations.json")
    if config_path.exists():
        with open(config_path) as f:
            config = json.load(f)
    else:
        config = {}
    
    # Configuration Frame.io
    print("\n📽️ Configuration Frame.io")
    print("-" * 25)
    frameio_token = input("Token API Frame.io (optionnel): ").strip()
    if frameio_token:
        config["frameio"] = {
            "api_token": frameio_token,
            "project_id": input("ID du projet Frame.io: ").strip(),
            "root_folder_id": input("ID du dossier racine: ").strip(),
            "upload_enabled": True,
            "base_url": "https://api.frame.io/v2"
        }
        print("✅ Frame.io configuré")
    else:
        print("⏭️ Frame.io ignoré")
    
    # Configuration Discord
    print("\n💬 Configuration Discord")
    print("-" * 24)
    discord_webhook = input("URL du webhook Discord (optionnel): ").strip()
    if discord_webhook:
        config["discord"] = {
            "webhook_url": discord_webhook,
            "username": "PostFlow Bot",
            "avatar_url": input("URL de l'avatar (optionnel): ").strip() or None
        }
        print("✅ Discord configuré")
    else:
        print("⏭️ Discord ignoré")
    
    # Configuration Google Sheets
    print("\n📊 Configuration Google Sheets")
    print("-" * 30)
    sheets_id = input("ID du Google Sheet (optionnel): ").strip()
    if sheets_id:
        config["google_sheets"] = {
            "service_account_file": "config/google_credentials.json",
            "spreadsheet_id": sheets_id,
            "worksheet_name": input("Nom de la feuille (défaut: Shot_Tracking): ").strip() or "Shot_Tracking"
        }
        print("✅ Google Sheets configuré")
        print("⚠️  N'oubliez pas de placer le fichier google_credentials.json dans config/")
    else:
        print("⏭️ Google Sheets ignoré")
    
    # Configuration After Effects
    print("\n🎬 Configuration After Effects")
    print("-" * 32)
    ae_path = input("Chemin vers les templates AE (défaut: templates/ae): ").strip()
    if not ae_path:
        ae_path = "templates/ae"
    
    config["after_effects"] = {
        "templates_path": ae_path,
        "output_path": "output/ae_renders",
        "default_template": input("Template par défaut (défaut: postflow_template.aep): ").strip() or "postflow_template.aep"
    }
    print("✅ After Effects configuré")
    
    # Configuration EbSynth
    print("\n🎨 Configuration EbSynth")
    print("-" * 23)
    ebsynth_path = input("Chemin vers EbSynth (optionnel): ").strip()
    if ebsynth_path:
        config["ebsynth"] = {
            "executable_path": ebsynth_path,
            "temp_directory": "temp/ebsynth",
            "default_settings": {
                "edge_method": "PAGE",
                "syn_weight": 1.0,
                "maximum_patches": 1000
            }
        }
        print("✅ EbSynth configuré")
    else:
        print("⏭️ EbSynth ignoré")
    
    # Sauvegarder la configuration
    print(f"\n💾 Sauvegarde dans {config_path}")
    config_path.parent.mkdir(exist_ok=True)
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=4)
    
    print("\n🎉 Configuration terminée !")
    print("\n📋 Prochaines étapes :")
    print("• Tester la configuration : python scripts/test_integrations.py")
    print("• Lancer le dashboard : python dashboard.py")
    print("• Démarrer le watcher : python main.py")
    
    return config

def test_configuration():
    """Teste la configuration des intégrations."""
    print("\n🧪 Test de la configuration")
    print("-" * 27)
    
    config_path = Path("config/integrations.json")
    if not config_path.exists():
        print("❌ Fichier de configuration non trouvé")
        return False
    
    with open(config_path) as f:
        config = json.load(f)
    
    success = True
    
    # Test Frame.io
    if "frameio" in config:
        if config["frameio"].get("api_token"):
            print("✅ Frame.io: Token présent")
        else:
            print("⚠️ Frame.io: Token manquant")
            success = False
    
    # Test Discord
    if "discord" in config:
        if config["discord"].get("webhook_url"):
            print("✅ Discord: Webhook présent")
        else:
            print("⚠️ Discord: Webhook manquant")
            success = False
    
    # Test Google Sheets
    if "google_sheets" in config:
        credentials_path = Path(config["google_sheets"]["service_account_file"])
        if credentials_path.exists():
            print("✅ Google Sheets: Credentials trouvés")
        else:
            print("⚠️ Google Sheets: Credentials manquants")
            success = False
    
    # Test After Effects
    if "after_effects" in config:
        templates_path = Path(config["after_effects"]["templates_path"])
        if templates_path.exists():
            print("✅ After Effects: Dossier templates trouvé")
        else:
            print("⚠️ After Effects: Dossier templates manquant")
            templates_path.mkdir(parents=True, exist_ok=True)
    
    return success

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_configuration()
    else:
        setup_integrations()
