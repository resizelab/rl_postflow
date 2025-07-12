#!/usr/bin/env python3
"""
🎬 RL PostFlow - Setup et Installation Multi-Plateforme
======================================================

Script d'installation et de configuration pour Windows/macOS/Linux
- Détection automatique de la plateforme
- Configuration des chemins LucidLink
- Validation de l'environnement
- Guide d'installation interactif

Version: 4.1.1
Date: 12 juillet 2025
"""

import json
import logging
import os
import platform
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from src.utils.cross_platform_paths import CrossPlatformPathManager, get_platform_path_manager
    from src.utils.lucidlink_utils import LucidLinkDetector
    MODULES_AVAILABLE = True
    logger.info("✅ Modules PostFlow disponibles")
except ImportError as e:
    logger.warning(f"⚠️ Modules PostFlow non disponibles: {e}")
    MODULES_AVAILABLE = False


class PostFlowInstaller:
    """Installateur et configurateur PostFlow multi-plateforme"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.current_os = platform.system().lower()
        self.is_windows = self.current_os == 'windows'
        self.is_macos = self.current_os == 'darwin'
        self.is_linux = self.current_os == 'linux'
        
        # Configuration des répertoires
        self.config_dir = self.project_root / "config"
        self.src_dir = self.project_root / "src"
        self.logs_dir = self.project_root / "logs"
        self.data_dir = self.project_root / "data"
        
        # Gestionnaire de chemins (si disponible)
        self.path_manager = None
        if MODULES_AVAILABLE:
            self.path_manager = get_platform_path_manager()
    
    def print_banner(self):
        """Afficher la bannière d'installation"""
        print("🎬 RL POSTFLOW - INSTALLATION MULTI-PLATEFORME")
        print("=" * 60)
        print(f"Plateforme: {self.current_os.upper()}")
        print(f"Python: {platform.python_version()}")
        print(f"Architecture: {platform.machine()}")
        print("=" * 60)
    
    def detect_lucidlink_paths(self) -> List[str]:
        """Détecter les chemins LucidLink possibles"""
        paths = []
        
        if self.is_windows:
            # Chemins Windows typiques
            candidates = [
                "E:\\Volumes\\resizelab\\o2b-undllm",
                "D:\\Volumes\\resizelab\\o2b-undllm",
                "C:\\Volumes\\resizelab\\o2b-undllm",
                "E:\\resizelab\\o2b-undllm",
                "D:\\resizelab\\o2b-undllm",
                "C:\\resizelab\\o2b-undllm"
            ]
        elif self.is_macos:
            # Chemins macOS typiques
            candidates = [
                "/Volumes/resizelab/o2b-undllm",
                "/Volumes/LucidLink/resizelab/o2b-undllm",
                "/Volumes/resizelab",
                "/Users/Shared/LucidLink/resizelab/o2b-undllm"
            ]
        else:  # Linux
            # Chemins Linux typiques
            candidates = [
                "/mnt/lucidlink/resizelab/o2b-undllm",
                "/media/lucidlink/resizelab/o2b-undllm",
                "/home/shared/lucidlink/resizelab/o2b-undllm"
            ]
        
        # Vérifier quels chemins existent
        for candidate in candidates:
            if os.path.exists(candidate):
                paths.append(candidate)
        
        return paths
    
    def create_directory_structure(self) -> bool:
        """Créer la structure de répertoires nécessaire"""
        try:
            logger.info("📁 Création de la structure de répertoires...")
            
            directories = [
                self.config_dir,
                self.logs_dir,
                self.data_dir,
                self.project_root / "backups",
                self.project_root / "temp",
                self.project_root / "output"
            ]
            
            for directory in directories:
                directory.mkdir(exist_ok=True)
                logger.info(f"  ✅ {directory.name}/")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur création répertoires: {e}")
            return False
    
    def check_python_dependencies(self) -> Tuple[bool, List[str]]:
        """Vérifier les dépendances Python"""
        try:
            logger.info("🐍 Vérification des dépendances Python...")
            
            required_packages = [
                'requests',
                'aiohttp',
                'asyncio',
                'pathlib',
                'json',
                'logging'
            ]
            
            missing_packages = []
            
            for package in required_packages:
                try:
                    __import__(package)
                    logger.info(f"  ✅ {package}")
                except ImportError:
                    missing_packages.append(package)
                    logger.warning(f"  ❌ {package}")
            
            return len(missing_packages) == 0, missing_packages
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification dépendances: {e}")
            return False, []
    
    def interactive_lucidlink_setup(self) -> Optional[str]:
        """Configuration interactive de LucidLink"""
        print("\n🔗 CONFIGURATION LUCIDLINK")
        print("-" * 40)
        
        # Détecter les chemins existants
        detected_paths = self.detect_lucidlink_paths()
        
        if detected_paths:
            print("📍 Chemins LucidLink détectés:")
            for i, path in enumerate(detected_paths):
                print(f"  {i+1}. {path}")
            
            while True:
                try:
                    choice = input(f"\nChoisir un chemin (1-{len(detected_paths)}) ou 'c' pour chemin personnalisé: ").strip()
                    
                    if choice.lower() == 'c':
                        custom_path = input("Entrer le chemin LucidLink: ").strip()
                        if custom_path and os.path.exists(custom_path):
                            return custom_path
                        else:
                            print("❌ Chemin non valide ou inexistant")
                            continue
                    
                    index = int(choice) - 1
                    if 0 <= index < len(detected_paths):
                        return detected_paths[index]
                    else:
                        print("❌ Choix invalide")
                        
                except ValueError:
                    print("❌ Veuillez entrer un numéro valide")
        else:
            print("⚠️ Aucun chemin LucidLink détecté automatiquement")
            
            # Proposer les chemins typiques pour la plateforme
            if self.is_windows:
                default_path = "E:\\Volumes\\resizelab\\o2b-undllm"
            elif self.is_macos:
                default_path = "/Volumes/resizelab/o2b-undllm"
            else:
                default_path = "/mnt/lucidlink/resizelab/o2b-undllm"
            
            print(f"💡 Chemin suggéré pour {self.current_os}: {default_path}")
            
            choice = input(f"Utiliser ce chemin? (y/N): ").strip().lower()
            if choice == 'y':
                return default_path
            else:
                custom_path = input("Entrer le chemin LucidLink: ").strip()
                return custom_path if custom_path else None
        
        return None
    
    def create_initial_config(self, lucidlink_path: str) -> bool:
        """Créer la configuration initiale"""
        try:
            logger.info("⚙️ Création de la configuration initiale...")
            
            # Configuration intégrations
            integrations_config = {
                "lucidlink": {
                    "base_path": lucidlink_path,
                    "watch_directory": lucidlink_path,
                    "enabled": True,
                    "watch_folders": True,
                    "notifications_enabled": True,
                    "watch_patterns": [
                        "UNDLM_\\d+_v\\d+\\.(mov|mp4|avi|mxf)$",
                        ".*_v\\d+\\.(mov|mp4|avi|mxf)$"
                    ],
                    "stability_timeout": 30
                },
                "frameio": {
                    "client_id": "YOUR_CLIENT_ID",
                    "client_secret": "YOUR_CLIENT_SECRET",
                    "redirect_uri": "http://localhost:8080/callback",
                    "enabled": True,
                    "upload_enabled": True,
                    "base_url": "https://api.frame.io/v4",
                    "upload_timeout": 300,
                    "max_retries": 3
                },
                "discord": {
                    "webhook_url": "YOUR_DISCORD_WEBHOOK_URL",
                    "username": "PostFlow BOT",
                    "enabled": True
                },
                "google_sheets": {
                    "service_account_file": "config/google_credentials.json",
                    "enabled": True
                },
                "_platform_info": {
                    "os": self.current_os,
                    "lucidlink_path": lucidlink_path,
                    "setup_date": "2025-07-12",
                    "version": "4.1.1"
                }
            }
            
            # Sauvegarder la configuration
            config_file = self.config_dir / "integrations.json"
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(integrations_config, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Configuration créée: {config_file}")
            
            # Configuration pipeline
            pipeline_config = {
                "version": "4.1.1",
                "name": "RL PostFlow Pipeline",
                "description": f"Pipeline automatisé LucidLink → Frame.io ({self.current_os})",
                "watcher": {
                    "enabled": True,
                    "polling_interval": 2.0,
                    "file_extensions": [".mov", ".mp4", ".avi", ".mkv"],
                    "stability_check": {
                        "enabled": True,
                        "max_wait": 60,
                        "check_interval": 2,
                        "required_stable_checks": 3
                    }
                },
                "dashboard": {
                    "enabled": True,
                    "host": "localhost",
                    "port": 8081,
                    "debug": False
                },
                "infrastructure": {
                    "http_server": {
                        "enabled": True,
                        "host": "localhost", 
                        "port": 8080
                    }
                }
            }
            
            pipeline_file = self.project_root / "pipeline_config.json"
            with open(pipeline_file, 'w', encoding='utf-8') as f:
                json.dump(pipeline_config, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Configuration pipeline créée: {pipeline_file}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur création configuration: {e}")
            return False
    
    def test_installation(self) -> bool:
        """Tester l'installation"""
        try:
            logger.info("🧪 Test de l'installation...")
            
            if MODULES_AVAILABLE:
                # Tester les modules PostFlow
                from src.utils.cross_platform_paths import CrossPlatformPathManager
                from src.utils.lucidlink_utils import LucidLinkDetector
                
                # Test du gestionnaire de chemins
                path_manager = CrossPlatformPathManager()
                platform_info = path_manager.get_platform_info()
                logger.info(f"  ✅ Gestionnaire de chemins: {platform_info['os']}")
                
                # Test du détecteur LucidLink
                detector = LucidLinkDetector()
                logger.info(f"  ✅ Détecteur LucidLink: {len(detector.lucidlink_paths)} chemins")
                
                return True
            else:
                logger.warning("⚠️ Modules PostFlow non disponibles, test basique")
                
                # Test basique de la structure
                required_files = [
                    self.config_dir / "integrations.json",
                    self.project_root / "pipeline_config.json"
                ]
                
                for file_path in required_files:
                    if file_path.exists():
                        logger.info(f"  ✅ {file_path.name}")
                    else:
                        logger.error(f"  ❌ {file_path.name}")
                        return False
                
                return True
            
        except Exception as e:
            logger.error(f"❌ Erreur test installation: {e}")
            return False
    
    def run_installation(self) -> bool:
        """Exécuter l'installation complète"""
        try:
            self.print_banner()
            
            print("\n🚀 Démarrage de l'installation PostFlow...")
            
            # Étape 1: Vérifier les dépendances
            print("\n1️⃣ Vérification des dépendances")
            deps_ok, missing = self.check_python_dependencies()
            if not deps_ok:
                print(f"❌ Dépendances manquantes: {missing}")
                print("💡 Installez-les avec: pip install -r requirements.txt")
                return False
            print("✅ Dépendances Python OK")
            
            # Étape 2: Créer la structure
            print("\n2️⃣ Création de la structure")
            if not self.create_directory_structure():
                print("❌ Échec création structure")
                return False
            print("✅ Structure créée")
            
            # Étape 3: Configuration LucidLink
            print("\n3️⃣ Configuration LucidLink")
            lucidlink_path = self.interactive_lucidlink_setup()
            if not lucidlink_path:
                print("❌ Configuration LucidLink annulée")
                return False
            print(f"✅ LucidLink configuré: {lucidlink_path}")
            
            # Étape 4: Créer la configuration
            print("\n4️⃣ Création de la configuration")
            if not self.create_initial_config(lucidlink_path):
                print("❌ Échec création configuration")
                return False
            print("✅ Configuration créée")
            
            # Étape 5: Test de l'installation
            print("\n5️⃣ Test de l'installation")
            if not self.test_installation():
                print("❌ Tests échoués")
                return False
            print("✅ Tests réussis")
            
            # Instructions finales
            print("\n🎉 INSTALLATION TERMINÉE!")
            print("=" * 60)
            print("📋 Prochaines étapes:")
            print("1. Configurer Frame.io dans config/integrations.json")
            print("2. Configurer Discord webhook")
            print("3. Ajouter Google credentials (optionnel)")
            print("4. Lancer PostFlow: python main.py")
            print("=" * 60)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur installation: {e}")
            return False


def main():
    """Fonction principale"""
    try:
        installer = PostFlowInstaller()
        success = installer.run_installation()
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n🛑 Installation interrompue par l'utilisateur")
        return 1
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
