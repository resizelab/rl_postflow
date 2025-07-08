#!/usr/bin/env python3
"""
Script de Test Interactif pour l'Intégration Frame.io
Permet de tester tous les composants de manière interactive
"""

import asyncio
import sys
import os
from pathlib import Path
import tempfile
import json
from datetime import datetime
import logging

# Ajouter le chemin source
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FrameIOInteractiveTester:
    """Testeur interactif pour l'intégration Frame.io"""
    
    def __init__(self):
        self.temp_dir = Path(tempfile.mkdtemp(prefix="frameio_test_"))
        self.test_files = []
        logger.info(f"Répertoire de test temporaire: {self.temp_dir}")
    
    def print_banner(self):
        """Affiche la bannière d'accueil"""
        print("\n" + "="*60)
        print("🎬 FRAME.IO INTEGRATION TESTER")
        print("="*60)
        print("Ce script permet de tester interactivement tous les")
        print("composants de l'intégration LucidLink → Frame.io")
        print("="*60 + "\n")
    
    def print_menu(self):
        """Affiche le menu principal"""
        print("\n📋 MENU PRINCIPAL")
        print("-" * 30)
        print("1. 🔍 Tester le Parser de Fichiers")
        print("2. 🏗️  Tester la Structure Frame.io")
        print("3. 📤 Tester l'Upload de Fichiers")
        print("4. 🔔 Tester les Notifications Discord")
        print("5. 🔄 Tester le Workflow Complet")
        print("6. 🌐 Tester la Connectivité API")
        print("7. 📊 Tester les Performances")
        print("8. 🛠️  Créer des Fichiers de Test")
        print("9. 📋 Voir les Logs")
        print("10. ❌ Quitter")
        print("-" * 30)
    
    def create_test_files(self):
        """Crée des fichiers de test"""
        print("\n🛠️ CRÉATION DE FICHIERS DE TEST")
        print("-" * 40)
        
        test_filenames = [
            "SC01_UNDLM_00412_V002.mov",
            "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov",
            "SCENE_42_SHOT_001_V003.r3d",
            "SC10_UNDLM_00523_V001.mp4",
            "TEST_FILE_INVALID.txt"
        ]
        
        self.test_files = []
        for filename in test_filenames:
            file_path = self.temp_dir / filename
            
            # Créer un fichier avec du contenu minimal
            with open(file_path, 'wb') as f:
                f.write(b"Test video content - " + filename.encode())
            
            self.test_files.append(file_path)
            print(f"✅ Créé: {filename}")
        
        print(f"\n📁 {len(self.test_files)} fichiers créés dans {self.temp_dir}")
        input("Appuyez sur Entrée pour continuer...")
    
    def test_parser(self):
        """Test du parser de fichiers"""
        print("\n🔍 TEST DU PARSER")
        print("-" * 25)
        
        try:
            from src.integrations.frameio.parser import FrameIOFileParser
            parser = FrameIOFileParser()
            
            test_files = [
                "SC01_UNDLM_00412_V002.mov",
                "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov",
                "SCENE_42_SHOT_001_V003.r3d",
                "SC10_UNDLM_00523_V001.mp4",
                "fichier_invalide.txt"
            ]
            
            for filename in test_files:
                print(f"\n📄 Test: {filename}")
                metadata = parser.parse_filename(filename)
                
                if metadata:
                    print(f"  ✅ Nomenclature: {metadata.nomenclature}")
                    print(f"  📂 Scène: {metadata.scene_name}")
                    print(f"  🎬 Shot: {metadata.shot_id}")
                    print(f"  📊 Version: {metadata.version}")
                    print(f"  🏷️  Tags: {metadata.tags}")
                    print(f"  📝 Description: {metadata.description}")
                else:
                    print("  ❌ Parsing échoué (attendu pour fichier invalide)")
        
        except Exception as e:
            print(f"❌ Erreur lors du test du parser: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_structure(self):
        """Test de la structure Frame.io"""
        print("\n🏗️ TEST DE LA STRUCTURE")
        print("-" * 30)
        
        try:
            from src.integrations.frameio.structure import FrameIOStructureManager
            manager = FrameIOStructureManager()
            
            # Test de création de structure pour plusieurs scènes/shots
            test_cases = [
                ("SC01", "UNDLM_00412"),
                ("SC10", "UNDLM_00523"),
                ("13H49_-_RECUPERATION_DES_2_SURVIVANTS", "S01")
            ]
            
            for scene, shot in test_cases:
                print(f"\n🎬 Test structure: {scene} / {shot}")
                
                try:
                    structure = await manager.ensure_shot_structure(scene, shot)
                    print(f"  ✅ Structure créée/vérifiée")
                    print(f"  📂 Scene ID: {structure.get('scene_id', 'N/A')}")
                    print(f"  🎬 Shot ID: {structure.get('shot_id', 'N/A')}")
                    print(f"  📁 Chemin: {structure.get('path', 'N/A')}")
                except Exception as e:
                    print(f"  ❌ Erreur: {e}")
        
        except Exception as e:
            print(f"❌ Erreur lors du test de structure: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_upload(self):
        """Test d'upload de fichiers"""
        print("\n📤 TEST D'UPLOAD")
        print("-" * 20)
        
        if not self.test_files:
            print("❌ Aucun fichier de test disponible. Créez d'abord des fichiers de test.")
            input("Appuyez sur Entrée pour continuer...")
            return
        
        try:
            from src.integrations.frameio.integration import FrameIOIntegration
            integration = FrameIOIntegration()
            
            # Tester l'upload avec le premier fichier valide
            test_file = self.test_files[0]  # SC01_UNDLM_00412_V002.mov
            
            print(f"📄 Test upload: {test_file.name}")
            print("⏳ Upload en cours...")
            
            result = await integration.process_file(test_file)
            
            if result and result.get('success'):
                print(f"✅ Upload réussi!")
                print(f"  🔗 Lien: {result.get('review_link', 'N/A')}")
                print(f"  📊 Statut: {result.get('status', 'N/A')}")
                print(f"  ⏱️  Durée: {result.get('duration', 'N/A')}")
            else:
                print(f"❌ Upload échoué: {result}")
        
        except Exception as e:
            print(f"❌ Erreur lors du test d'upload: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_discord_notification(self):
        """Test des notifications Discord"""
        print("\n🔔 TEST NOTIFICATIONS DISCORD")
        print("-" * 35)
        
        try:
            from src.integrations.frameio.notifier import FrameIODiscordNotifier
            notifier = FrameIODiscordNotifier()
            
            # Test de notification simple
            test_metadata = {
                'filename': 'SC01_UNDLM_00412_V002.mov',
                'scene_name': 'SC01',
                'shot_id': 'UNDLM_00412',
                'version': 'V002',
                'nomenclature': 'SC01_UNDLM_00412_V002',
                'review_link': 'https://app.frame.io/reviews/test-link',
                'file_size': 1024*1024*50,  # 50MB
                'duration': 30.5,
                'upload_time': datetime.now().isoformat()
            }
            
            print("📨 Envoi de notification de test...")
            
            success = await notifier.send_upload_notification(test_metadata)
            
            if success:
                print("✅ Notification envoyée avec succès!")
            else:
                print("❌ Échec de l'envoi de notification")
        
        except Exception as e:
            print(f"❌ Erreur lors du test Discord: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_complete_workflow(self):
        """Test du workflow complet"""
        print("\n🔄 TEST WORKFLOW COMPLET")
        print("-" * 30)
        
        if not self.test_files:
            print("❌ Aucun fichier de test disponible. Créez d'abord des fichiers de test.")
            input("Appuyez sur Entrée pour continuer...")
            return
        
        try:
            from src.integrations.frameio.integration import FrameIOIntegration
            integration = FrameIOIntegration()
            
            # Test avec le premier fichier valide
            test_file = self.test_files[0]
            
            print(f"🎬 Test workflow complet avec: {test_file.name}")
            print("⏳ Traitement en cours...")
            
            # Étapes du workflow
            steps = [
                "1. 🔍 Parsing du fichier",
                "2. 🏗️  Création de la structure",
                "3. 📤 Upload du fichier",
                "4. 🔔 Notification Discord"
            ]
            
            for step in steps:
                print(f"  {step}")
            
            result = await integration.process_file(test_file)
            
            print(f"\n📊 RÉSULTAT FINAL:")
            if result and result.get('success'):
                print("✅ Workflow terminé avec succès!")
                print(f"  🔗 Lien de review: {result.get('review_link', 'N/A')}")
                print(f"  ⏱️  Durée totale: {result.get('total_duration', 'N/A')}")
                print(f"  📊 Statut: {result.get('status', 'N/A')}")
            else:
                print("❌ Workflow échoué")
                print(f"  🔍 Détails: {result}")
        
        except Exception as e:
            print(f"❌ Erreur lors du test de workflow: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_connectivity(self):
        """Test de connectivité API"""
        print("\n🌐 TEST DE CONNECTIVITÉ")
        print("-" * 30)
        
        try:
            # Test Frame.io
            print("🎬 Test connexion Frame.io...")
            from src.integrations.frameio.auth import FrameIOAuth
            auth = FrameIOAuth()
            
            frameio_ok = await auth.test_connection()
            if frameio_ok:
                print("  ✅ Frame.io OK")
            else:
                print("  ❌ Frame.io KO")
            
            # Test Discord
            print("🔔 Test connexion Discord...")
            from src.integrations.frameio.notifier import FrameIODiscordNotifier
            notifier = FrameIODiscordNotifier()
            
            discord_ok = await notifier.test_connection()
            if discord_ok:
                print("  ✅ Discord OK")
            else:
                print("  ❌ Discord KO")
            
            # Test base de données
            print("🗄️  Test base de données...")
            db_path = Path("data/postflow.db")
            if db_path.exists():
                print("  ✅ Base de données OK")
            else:
                print("  ❌ Base de données introuvable")
        
        except Exception as e:
            print(f"❌ Erreur lors du test de connectivité: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    async def test_performance(self):
        """Test de performances"""
        print("\n📊 TEST DE PERFORMANCES")
        print("-" * 30)
        
        if not self.test_files:
            print("❌ Aucun fichier de test disponible. Créez d'abord des fichiers de test.")
            input("Appuyez sur Entrée pour continuer...")
            return
        
        try:
            import time
            from src.integrations.frameio.integration import FrameIOIntegration
            integration = FrameIOIntegration()
            
            # Test de performance avec parsing multiple
            print("🔍 Test performance parsing...")
            start_time = time.time()
            
            from src.integrations.frameio.parser import FrameIOFileParser
            parser = FrameIOFileParser()
            
            for _ in range(100):
                for test_file in self.test_files:
                    parser.parse_filename(test_file.name)
            
            parse_time = time.time() - start_time
            print(f"  ⏱️  Temps parsing (500 fichiers): {parse_time:.2f}s")
            
            # Test de performance structure
            print("🏗️  Test performance structure...")
            start_time = time.time()
            
            from src.integrations.frameio.structure import FrameIOStructureManager
            manager = FrameIOStructureManager()
            
            # Test cache uniquement
            for i in range(10):
                await manager.ensure_shot_structure(f"TEST_SCENE_{i}", f"SHOT_{i}")
            
            structure_time = time.time() - start_time
            print(f"  ⏱️  Temps structure (10 créations): {structure_time:.2f}s")
            
            print(f"\n📈 RÉSULTATS PERFORMANCE:")
            print(f"  🔍 Parsing: {parse_time:.2f}s pour 500 fichiers")
            print(f"  🏗️  Structure: {structure_time:.2f}s pour 10 structures")
            print(f"  📊 Vitesse parsing: {500/parse_time:.0f} fichiers/s")
        
        except Exception as e:
            print(f"❌ Erreur lors du test de performance: {e}")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    def view_logs(self):
        """Affiche les logs récents"""
        print("\n📋 LOGS RÉCENTS")
        print("-" * 20)
        
        log_files = [
            "logs/frameio_integration.log",
            "logs/frameio_bridge.log",
            "logs/pipeline.log"
        ]
        
        for log_file in log_files:
            log_path = Path(log_file)
            if log_path.exists():
                print(f"\n📄 {log_file}:")
                try:
                    with open(log_path, 'r') as f:
                        lines = f.readlines()
                        # Afficher les 10 dernières lignes
                        for line in lines[-10:]:
                            print(f"  {line.strip()}")
                except Exception as e:
                    print(f"  ❌ Erreur lecture: {e}")
            else:
                print(f"\n📄 {log_file}: Non trouvé")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    def cleanup(self):
        """Nettoie les fichiers temporaires"""
        try:
            import shutil
            shutil.rmtree(self.temp_dir)
            logger.info(f"Nettoyage terminé: {self.temp_dir}")
        except Exception as e:
            logger.warning(f"Erreur lors du nettoyage: {e}")
    
    async def run(self):
        """Lance le testeur interactif"""
        self.print_banner()
        
        while True:
            self.print_menu()
            
            try:
                choice = input("\n🎯 Votre choix (1-10): ").strip()
                
                if choice == '1':
                    self.test_parser()
                elif choice == '2':
                    await self.test_structure()
                elif choice == '3':
                    await self.test_upload()
                elif choice == '4':
                    await self.test_discord_notification()
                elif choice == '5':
                    await self.test_complete_workflow()
                elif choice == '6':
                    await self.test_connectivity()
                elif choice == '7':
                    await self.test_performance()
                elif choice == '8':
                    self.create_test_files()
                elif choice == '9':
                    self.view_logs()
                elif choice == '10':
                    print("\n👋 Au revoir!")
                    break
                else:
                    print("❌ Choix invalide. Veuillez choisir entre 1 et 10.")
            
            except KeyboardInterrupt:
                print("\n\n👋 Interruption utilisateur. Au revoir!")
                break
            except Exception as e:
                print(f"❌ Erreur: {e}")
                input("Appuyez sur Entrée pour continuer...")
        
        self.cleanup()

if __name__ == "__main__":
    tester = FrameIOInteractiveTester()
    asyncio.run(tester.run())
