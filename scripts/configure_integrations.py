"""
Configuration des intégrations UNDLM PostFlow
Discord, Frame.io, et Google Sheets
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
import requests


class IntegrationsConfigurator:
    """Configurateur pour les intégrations externes."""
    
    def __init__(self, config_path: str = "pipeline_config.json"):
        """
        Initialise le configurateur.
        
        Args:
            config_path: Chemin vers le fichier de configuration
        """
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.setup_log = []
    
    def load_config(self) -> Dict[str, Any]:
        """Charge la configuration actuelle."""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r') as f:
                    return json.load(f)
            else:
                return self.get_default_config()
        except Exception as e:
            print(f"❌ Erreur lors du chargement de la configuration : {e}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Retourne la configuration par défaut."""
        return {
            "project_name": "UNDLM Documentary",
            "discord": {
                "webhook_url": "",
                "channel_name": "postproduction",
                "notifications_enabled": False,
                "bot_name": "RL PostFlow Bot"
            },
            "frameio": {
                "api_token": "",
                "project_id": "",
                "root_folder_id": "",
                "upload_enabled": False,
                "auto_notify": True
            },
            "google_sheets": {
                "credentials_file": "",
                "spreadsheet_id": "",
                "worksheet_name": "Shot Tracking",
                "sync_enabled": False,
                "auto_update": True,
                "backup_enabled": True
            },
            "lucidlink": {
                "base_path": "/Volumes/resizelab/o2b-undllm",
                "volume_name": "o2b-undllm",
                "auto_verify_sources": True,
                "create_directories": True
            },
            "after_effects": {
                "template_path": "UNDLM_SHOT_TEMPLATE.aep",
                "export_format": "mov",
                "resolution": "HD",
                "frame_rate": 25,
                "auto_render": False
            }
        }
    
    def save_config(self) -> bool:
        """Sauvegarde la configuration."""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
            return True
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde : {e}")
            return False
    
    def install_required_packages(self) -> bool:
        """Installe les packages Python requis."""
        print("📦 Installation des packages requis...")
        
        packages = [
            "requests",
            "gspread",
            "google-auth",
            "google-auth-oauthlib",
            "google-auth-httplib2"
        ]
        
        try:
            for package in packages:
                print(f"   Installing {package}...")
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            
            print("✅ Packages installés avec succès")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur lors de l'installation des packages : {e}")
            return False
    
    def configure_discord(self) -> bool:
        """Configure l'intégration Discord."""
        print("\\n🎮 Configuration Discord")
        print("=" * 50)
        
        print("\\n📋 Étapes pour configurer Discord :")
        print("1. Créer un serveur Discord ou utiliser un existant")
        print("2. Aller dans les paramètres du serveur > Intégrations > Webhooks")
        print("3. Créer un nouveau webhook")
        print("4. Copier l'URL du webhook")
        print("5. Nommer le channel (ex: postproduction)")
        
        webhook_url = input("\\n🔗 URL du webhook Discord : ").strip()
        
        if not webhook_url:
            print("❌ URL du webhook requise")
            return False
        
        # Test du webhook
        if self.test_discord_webhook(webhook_url):
            channel_name = input("📢 Nom du channel (défaut: postproduction) : ").strip() or "postproduction"
            bot_name = input("🤖 Nom du bot (défaut: RL PostFlow Bot) : ").strip() or "RL PostFlow Bot"
            
            self.config["discord"]["webhook_url"] = webhook_url
            self.config["discord"]["channel_name"] = channel_name
            self.config["discord"]["bot_name"] = bot_name
            self.config["discord"]["notifications_enabled"] = True
            
            print("✅ Discord configuré avec succès")
            self.setup_log.append("Discord: Configuré")
            return True
        else:
            print("❌ Échec du test du webhook Discord")
            return False
    
    def test_discord_webhook(self, webhook_url: str) -> bool:
        """Test le webhook Discord."""
        try:
            payload = {
                "content": "🎬 Test de configuration UNDLM PostFlow",
                "username": "Setup Bot",
                "embeds": [{
                    "title": "Configuration Test",
                    "description": "Discord webhook configuré avec succès !",
                    "color": 0x00ff00,
                    "timestamp": datetime.now().isoformat()
                }]
            }
            
            response = requests.post(webhook_url, json=payload)
            response.raise_for_status()
            
            print("✅ Test Discord réussi - message envoyé sur le serveur")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Erreur lors du test Discord : {e}")
            return False
    
    def configure_frameio(self) -> bool:
        """Configure l'intégration Frame.io."""
        print("\\n🎬 Configuration Frame.io")
        print("=" * 50)
        
        print("\\n📋 Étapes pour configurer Frame.io :")
        print("1. Créer un compte Frame.io ou utiliser un existant")
        print("2. Aller dans Account Settings > API Tokens")
        print("3. Créer un nouveau token API")
        print("4. Créer un projet pour UNDLM")
        print("5. Récupérer l'ID du projet depuis l'URL")
        
        api_token = input("\\n🔑 Token API Frame.io : ").strip()
        
        if not api_token:
            print("❌ Token API requis")
            return False
        
        # Test du token
        if self.test_frameio_token(api_token):
            project_id = input("📁 ID du projet Frame.io : ").strip()
            
            if not project_id:
                print("❌ ID du projet requis")
                return False
            
            self.config["frameio"]["api_token"] = api_token
            self.config["frameio"]["project_id"] = project_id
            self.config["frameio"]["upload_enabled"] = True
            
            print("✅ Frame.io configuré avec succès")
            self.setup_log.append("Frame.io: Configuré")
            return True
        else:
            print("❌ Échec du test du token Frame.io")
            return False
    
    def test_frameio_token(self, api_token: str) -> bool:
        """Test le token Frame.io."""
        try:
            headers = {
                "Authorization": f"Bearer {api_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get("https://api.frame.io/v2/me", headers=headers)
            response.raise_for_status()
            
            user_info = response.json()
            print(f"✅ Test Frame.io réussi - connecté en tant que {user_info.get('name', 'Unknown')}")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Erreur lors du test Frame.io : {e}")
            return False
    
    def configure_google_sheets(self) -> bool:
        """Configure l'intégration Google Sheets."""
        print("\\n📊 Configuration Google Sheets")
        print("=" * 50)
        
        print("\\n📋 Étapes pour configurer Google Sheets :")
        print("1. Aller sur https://console.cloud.google.com/")
        print("2. Créer un nouveau projet ou utiliser un existant")
        print("3. Activer l'API Google Sheets")
        print("4. Créer un compte de service")
        print("5. Télécharger le fichier JSON des credentials")
        print("6. Créer un nouveau Google Sheets")
        print("7. Partager le sheet avec l'email du compte de service")
        
        credentials_file = input("\\n📄 Chemin vers le fichier JSON des credentials : ").strip()
        
        if not credentials_file:
            print("❌ Fichier de credentials requis")
            return False
        
        credentials_path = Path(credentials_file)
        if not credentials_path.exists():
            print(f"❌ Fichier non trouvé : {credentials_path}")
            return False
        
        spreadsheet_id = input("📋 ID du Google Sheets (depuis l'URL) : ").strip()
        
        if not spreadsheet_id:
            print("❌ ID du spreadsheet requis")
            return False
        
        # Test de la connexion
        if self.test_google_sheets_connection(credentials_file, spreadsheet_id):
            worksheet_name = input("📄 Nom de la feuille (défaut: Shot Tracking) : ").strip() or "Shot Tracking"
            
            self.config["google_sheets"]["credentials_file"] = credentials_file
            self.config["google_sheets"]["spreadsheet_id"] = spreadsheet_id
            self.config["google_sheets"]["worksheet_name"] = worksheet_name
            self.config["google_sheets"]["sync_enabled"] = True
            
            print("✅ Google Sheets configuré avec succès")
            self.setup_log.append("Google Sheets: Configuré")
            return True
        else:
            print("❌ Échec du test de connexion Google Sheets")
            return False
    
    def test_google_sheets_connection(self, credentials_file: str, spreadsheet_id: str) -> bool:
        """Test la connexion Google Sheets."""
        try:
            # Import here to avoid dependency issues
            import gspread
            from google.oauth2.service_account import Credentials
            
            # Define the scope
            scope = [
                "https://spreadsheets.google.com/feeds",
                "https://www.googleapis.com/auth/drive"
            ]
            
            # Load credentials
            creds = Credentials.from_service_account_file(credentials_file, scopes=scope)
            
            # Create client
            client = gspread.authorize(creds)
            
            # Try to open the spreadsheet
            spreadsheet = client.open_by_key(spreadsheet_id)
            
            print(f"✅ Test Google Sheets réussi - connecté au spreadsheet '{spreadsheet.title}'")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors du test Google Sheets : {e}")
            return False
    
    def create_example_files(self) -> bool:
        """Crée des fichiers d'exemple pour la configuration."""
        print("\\n📄 Création des fichiers d'exemple...")
        
        # Exemple de credentials Google Sheets
        example_credentials = {
            "type": "service_account",
            "project_id": "your-project-id",
            "private_key_id": "your-private-key-id",
            "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
            "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
            "client_id": "your-client-id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
        }
        
        # Sauvegarder l'exemple
        try:
            with open("google_sheets_credentials_example.json", "w") as f:
                json.dump(example_credentials, f, indent=2)
            
            print("✅ Fichier d'exemple créé : google_sheets_credentials_example.json")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la création des fichiers d'exemple : {e}")
            return False
    
    def run_full_configuration(self) -> bool:
        """Exécute la configuration complète."""
        print("🚀 Configuration des intégrations UNDLM PostFlow")
        print("=" * 60)
        
        # Installation des packages
        if not self.install_required_packages():
            print("❌ Échec de l'installation des packages")
            return False
        
        # Configuration Discord
        discord_success = False
        if input("\\n🎮 Configurer Discord ? (y/n) : ").lower() == 'y':
            discord_success = self.configure_discord()
        
        # Configuration Frame.io
        frameio_success = False
        if input("\\n🎬 Configurer Frame.io ? (y/n) : ").lower() == 'y':
            frameio_success = self.configure_frameio()
        
        # Configuration Google Sheets
        sheets_success = False
        if input("\\n📊 Configurer Google Sheets ? (y/n) : ").lower() == 'y':
            sheets_success = self.configure_google_sheets()
        
        # Sauvegarde de la configuration
        if self.save_config():
            print("\\n✅ Configuration sauvegardée")
        else:
            print("\\n❌ Erreur lors de la sauvegarde")
        
        # Création des fichiers d'exemple
        self.create_example_files()
        
        # Résumé
        print("\\n📊 Résumé de la configuration :")
        print("=" * 40)
        
        for log_entry in self.setup_log:
            print(f"✅ {log_entry}")
        
        if not any([discord_success, frameio_success, sheets_success]):
            print("⚠️ Aucune intégration configurée")
        
        print("\\n🎉 Configuration terminée !")
        print("\\n📋 Prochaines étapes :")
        print("1. Vérifier le fichier pipeline_config.json")
        print("2. Tester les intégrations avec python test_integrations.py")
        print("3. Lancer le pipeline avec python main.py")
        
        return True
    
    def generate_test_script(self) -> bool:
        """Génère un script de test des intégrations."""
        test_script = '''"""
Script de test des intégrations UNDLM PostFlow
"""

import json
import sys
from pathlib import Path

# Ajouter le chemin du projet
sys.path.append(str(Path(__file__).parent))

from src.integrations.discord import DiscordNotifier, DiscordConfig
from src.integrations.frameio import FrameIOClient, FrameIOConfig
from src.integrations.google_sheets import GoogleSheetsClient, GoogleSheetsConfig


def load_config():
    """Charge la configuration."""
    with open("pipeline_config.json", "r") as f:
        return json.load(f)


def test_discord():
    """Test Discord."""
    print("🎮 Test Discord...")
    config = load_config()
    
    if not config["discord"]["webhook_url"]:
        print("❌ Discord non configuré")
        return False
    
    discord_config = DiscordConfig(
        webhook_url=config["discord"]["webhook_url"],
        channel_name=config["discord"]["channel_name"],
        bot_name=config["discord"]["bot_name"]
    )
    
    notifier = DiscordNotifier(discord_config)
    success = notifier.send_message("🎬 Test d'intégration UNDLM PostFlow")
    
    if success:
        print("✅ Discord test réussi")
        return True
    else:
        print("❌ Discord test échoué")
        return False


def test_frameio():
    """Test Frame.io."""
    print("🎬 Test Frame.io...")
    config = load_config()
    
    if not config["frameio"]["api_token"]:
        print("❌ Frame.io non configuré")
        return False
    
    frameio_config = FrameIOConfig(
        api_token=config["frameio"]["api_token"],
        project_id=config["frameio"]["project_id"]
    )
    
    client = FrameIOClient(frameio_config)
    success = client.test_connection()
    
    if success:
        print("✅ Frame.io test réussi")
        return True
    else:
        print("❌ Frame.io test échoué")
        return False


def test_google_sheets():
    """Test Google Sheets."""
    print("📊 Test Google Sheets...")
    config = load_config()
    
    if not config["google_sheets"]["credentials_file"]:
        print("❌ Google Sheets non configuré")
        return False
    
    sheets_config = GoogleSheetsConfig(
        credentials_file=config["google_sheets"]["credentials_file"],
        spreadsheet_id=config["google_sheets"]["spreadsheet_id"],
        worksheet_name=config["google_sheets"]["worksheet_name"]
    )
    
    client = GoogleSheetsClient(sheets_config)
    success = client.connect()
    
    if success:
        print("✅ Google Sheets test réussi")
        return True
    else:
        print("❌ Google Sheets test échoué")
        return False


def main():
    """Main test function."""
    print("🚀 Test des intégrations UNDLM PostFlow")
    print("=" * 50)
    
    results = []
    
    # Test Discord
    results.append(test_discord())
    
    # Test Frame.io
    results.append(test_frameio())
    
    # Test Google Sheets
    results.append(test_google_sheets())
    
    # Résumé
    print("\\n📊 Résumé des tests :")
    print("=" * 30)
    
    successful = sum(results)
    total = len(results)
    
    print(f"✅ Tests réussis : {successful}/{total}")
    
    if successful == total:
        print("🎉 Toutes les intégrations fonctionnent !")
    else:
        print("⚠️ Certaines intégrations nécessitent une configuration")


if __name__ == "__main__":
    main()
'''
        
        try:
            with open("test_integrations.py", "w") as f:
                f.write(test_script)
            
            print("✅ Script de test créé : test_integrations.py")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la création du script de test : {e}")
            return False


def main():
    """Fonction principale."""
    configurator = IntegrationsConfigurator()
    configurator.run_full_configuration()
    configurator.generate_test_script()


if __name__ == "__main__":
    main()
