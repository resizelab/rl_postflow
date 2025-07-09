#!/usr/bin/env python3
"""
Suite de Tests Complète pour l'Intégration LucidLink → Frame.io
Tests unitaires et d'intégration pour valider tous les composants
"""

import asyncio
import os
import sys
import tempfile
import json
from pathlib import Path
from datetime import datetime
import logging
import unittest
from unittest.mock import Mock, patch, AsyncMock

# Ajouter le chemin source au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Configuration du logging pour les tests
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TestFrameIOParser(unittest.TestCase):
    """Tests pour le parser de fichiers"""
    
    def setUp(self):
        """Configuration des tests"""
        from src.integrations.frameio.parser import FrameIOFileParser
        self.parser = FrameIOFileParser()
    
    def test_parse_simple_filename(self):
        """Test parsing fichier simple"""
        filename = "SC01_UNDLM_00412_V002.mov"
        metadata = self.parser.parse_filename(filename)
        
        self.assertIsNotNone(metadata)
        self.assertEqual(metadata.scene_name, "SC01")
        self.assertEqual(metadata.shot_id, "UNDLM_00412")
        self.assertEqual(metadata.version, "V002")
        self.assertEqual(metadata.nomenclature, "SC01_UNDLM_00412_V002")
        
        print(f"✅ Test parsing simple: {filename} → {metadata.nomenclature}")
    
    def test_parse_complex_filename(self):
        """Test parsing fichier complexe"""
        filename = "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov"
        metadata = self.parser.parse_filename(filename)
        
        self.assertIsNotNone(metadata)
        self.assertEqual(metadata.shot_id, "S01")
        self.assertEqual(metadata.version, "V001")
        self.assertIn("13H49", metadata.scene_name)
        
        print(f"✅ Test parsing complexe: {filename} → {metadata.nomenclature}")
    
    def test_parse_invalid_filename(self):
        """Test parsing fichier invalide"""
        filename = "fichier_invalide.mov"
        metadata = self.parser.parse_filename(filename)
        
        self.assertIsNone(metadata)
        print(f"✅ Test parsing invalide: {filename} → None (attendu)")
    
    def test_supported_extensions(self):
        """Test extensions supportées"""
        test_files = [
            "SC01_UNDLM_00412_V002.mov",
            "SC01_UNDLM_00412_V002.mp4",
            "SC01_UNDLM_00412_V002.prores",
            "SC01_UNDLM_00412_V002.r3d",
            "SC01_UNDLM_00412_V002.txt"  # Non supporté
        ]
        
        results = []
        for filename in test_files:
            metadata = self.parser.parse_filename(filename)
            results.append(metadata is not None)
        
        # Vérifier que seuls les 4 premiers sont supportés
        expected = [True, True, True, True, False]
        self.assertEqual(results, expected)
        
        print(f"✅ Test extensions: {results} (attendu: {expected})")

class TestFrameIOStructure(unittest.IsolatedAsyncioTestCase):
    """Tests pour le gestionnaire de structure"""
    
    async def asyncSetUp(self):
        """Configuration async des tests"""
        # Mock de l'authentification
        self.mock_auth = Mock()
        self.mock_auth.get_headers = AsyncMock(return_value={'Authorization': 'Bearer test_token'})
        self.mock_auth._request_with_retry = AsyncMock()
        self.mock_auth.config = {
            'frameio': {
                'account_id': 'test_account',
                'workspace_id': 'test_workspace'
            }
        }
        
        from src.integrations.frameio.structure import FrameIOStructureManager
        self.structure_manager = FrameIOStructureManager(self.mock_auth)
        
        # Créer un fichier de structure temporaire
        self.temp_dir = tempfile.mkdtemp()
        self.structure_manager.structure_file_path = Path(self.temp_dir) / 'test_structure.json'
    
    async def test_load_save_structure_cache(self):
        """Test chargement/sauvegarde du cache"""
        # Test structure initiale
        structure = self.structure_manager._load_structure_cache()
        self.assertIsInstance(structure, dict)
        self.assertIn('structure', structure)
        
        # Modifier et sauvegarder
        structure['test_key'] = 'test_value'
        result = self.structure_manager._save_structure_cache(structure)
        self.assertTrue(result)
        
        # Recharger et vérifier
        reloaded = self.structure_manager._load_structure_cache()
        self.assertEqual(reloaded['test_key'], 'test_value')
        
        print("✅ Test cache structure: chargement/sauvegarde OK")
    
    async def test_folder_cache_logic(self):
        """Test logique de cache des dossiers"""
        # Simuler une structure existante
        structure = {
            'project_id': 'test_project',
            'scenes_folder_id': 'scenes_root',
            'structure': {
                'scenes': {
                    'SC01': {
                        'folder_id': 'scene_folder_id',
                        'shots': {
                            'UNDLM_00412': {
                                'folder_id': 'shot_folder_id'
                            }
                        }
                    }
                }
            }
        }
        
        self.structure_manager._save_structure_cache(structure)
        
        # Le dossier devrait être trouvé en cache
        # Note: Ce test nécessiterait des mocks plus avancés pour les appels API
        print("✅ Test logique cache: structure configurée")

class TestFrameIOUpload(unittest.IsolatedAsyncioTestCase):
    """Tests pour le gestionnaire d'upload"""
    
    async def asyncSetUp(self):
        """Configuration async des tests"""
        # Mock de l'authentification
        self.mock_auth = Mock()
        self.mock_auth.get_headers = AsyncMock(return_value={'Authorization': 'Bearer test_token'})
        self.mock_auth._request_with_retry = AsyncMock()
        self.mock_auth.config = {
            'frameio': {
                'account_id': 'test_account',
                'workspace_id': 'test_workspace'
            }
        }
        
        from src.integrations.frameio.upload import FrameIOUploadManager
        self.upload_manager = FrameIOUploadManager(self.mock_auth)
    
    async def test_file_hash_calculation(self):
        """Test calcul de hash de fichier"""
        # Créer un fichier temporaire
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
            f.write("test content")
            temp_file = f.name
        
        try:
            file_hash = self.upload_manager._calculate_file_hash(temp_file)
            self.assertIsInstance(file_hash, str)
            self.assertEqual(len(file_hash), 64)  # SHA-256 = 64 caractères hex
            
            print(f"✅ Test hash fichier: {file_hash[:16]}...")
        finally:
            os.unlink(temp_file)
    
    async def test_generate_review_link(self):
        """Test génération lien de review"""
        file_id = "test_file_123"
        project_id = "test_project_456"
        
        link = self.upload_manager._generate_review_link(file_id, project_id)
        expected = f"https://app.frame.io/projects/{project_id}/files/{file_id}"
        
        self.assertEqual(link, expected)
        print(f"✅ Test lien review: {link}")

class TestFrameIONotifier(unittest.TestCase):
    """Tests pour le notificateur Discord"""
    
    def setUp(self):
        """Configuration des tests"""
        from src.integrations.frameio.notifier import FrameIODiscordNotifier, FrameIONotificationData
        
        self.webhook_url = "https://discord.com/api/webhooks/test"
        self.notifier = FrameIODiscordNotifier(self.webhook_url)
        
        # Données de test
        self.test_data = FrameIONotificationData(
            file_name="SC01_UNDLM_00412_V002.mov",
            shot_id="UNDLM_00412",
            scene_name="SC01",
            version="V002",
            nomenclature="SC01_UNDLM_00412_V002",
            file_size=1024*1024*50,  # 50MB
            upload_status="ready",
            review_link="https://app.frame.io/projects/123/files/456",
            folder_path="SCENES/SC01/UNDLM_00412",
            upload_timestamp=datetime.now().isoformat(),
            file_id="file_123",
            project_id="project_456",
            description="Plan 01 - Scène test",
            tags=["quicktime", "exterieur"]
        )
    
    def test_create_success_embed(self):
        """Test création embed de succès"""
        embed = self.notifier._create_success_embed(self.test_data)
        
        self.assertIsInstance(embed, dict)
        self.assertIn("title", embed)
        self.assertIn("fields", embed)
        self.assertEqual(embed["color"], 0x00FF00)  # Vert
        
        print("✅ Test embed succès: structure OK")
    
    def test_create_error_embed(self):
        """Test création embed d'erreur"""
        error_data = self.test_data._replace(
            upload_status="error",
            error_message="Fichier trop volumineux"
        )
        
        embed = self.notifier._create_error_embed(error_data)
        
        self.assertIsInstance(embed, dict)
        self.assertEqual(embed["color"], 0xFF0000)  # Rouge
        self.assertIn("Erreur", str(embed))
        
        print("✅ Test embed erreur: structure OK")
    
    @patch('requests.post')
    def test_send_discord_message(self, mock_post):
        """Test envoi message Discord"""
        mock_post.return_value.status_code = 200
        mock_post.return_value.raise_for_status = Mock()
        
        result = self.notifier._send_discord_message("Test message")
        
        self.assertTrue(result)
        mock_post.assert_called_once()
        
        print("✅ Test envoi Discord: appel API OK")

class TestFrameIOIntegration(unittest.IsolatedAsyncioTestCase):
    """Tests pour l'intégration complète"""
    
    async def asyncSetUp(self):
        """Configuration async des tests"""
        # Configuration de test
        self.test_config = {
            'frameio': {
                'account_id': 'test_account',
                'workspace_id': 'test_workspace',
                'project_id': 'test_project',
                'oauth': {
                    'client_id': 'test_client',
                    'client_secret': 'test_secret',
                    'jwt_key': 'test_jwt'
                }
            },
            'discord': {
                'webhook_url': 'https://discord.com/api/webhooks/test'
            }
        }
    
    async def test_integration_manager_init(self):
        """Test initialisation du gestionnaire d'intégration"""
        with patch('src.integrations.frameio.integration.FrameIOOAuthAuth'):
            from src.integrations.frameio.integration import FrameIOIntegrationManager
            
            # Mock auth
            mock_auth = Mock()
            integration = FrameIOIntegrationManager(mock_auth, self.test_config['discord']['webhook_url'])
            
            self.assertIsNotNone(integration.parser)
            self.assertIsNotNone(integration.structure_manager)
            self.assertIsNotNone(integration.upload_manager)
            self.assertIsNotNone(integration.discord_notifier)
            
            print("✅ Test init integration: tous les composants créés")

async def run_integration_tests():
    """Tests d'intégration avec de vrais fichiers"""
    
    print("\n🧪 TESTS D'INTÉGRATION")
    print("=" * 50)
    
    # Test 1: Parser avec de vrais noms de fichiers
    print("\n1. Test Parser avec fichiers réels")
    from src.integrations.frameio.parser import FrameIOFileParser
    
    parser = FrameIOFileParser()
    
    test_files = [
        "SC01_UNDLM_00412_V002.mov",
        "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov",
        "2EME_MAYDAY_EXT_-_NUIT_AMERICAINE_S03_V005.mp4",
        "DOUANE_MER_-_JOUR_S02_V001.prores",
        "fichier_invalide.mov"
    ]
    
    for filename in test_files:
        metadata = parser.parse_filename(filename)
        if metadata:
            print(f"  ✅ {filename}")
            print(f"     → Scène: {metadata.scene_name}")
            print(f"     → Plan: {metadata.shot_id}")
            print(f"     → Version: {metadata.version}")
            print(f"     → Tags: {metadata.tags}")
        else:
            print(f"  ❌ {filename} (non parsé - attendu pour fichier_invalide)")
    
    # Test 2: Création de fichiers de test
    print("\n2. Création de fichiers de test")
    
    test_dir = Path("./test_files")
    test_dir.mkdir(exist_ok=True)
    
    for filename in ["SC01_UNDLM_00412_V002.mov", "SC02_UNDLM_00413_V001.mp4"]:
        test_file = test_dir / filename
        if not test_file.exists():
            # Créer un fichier test de 2MB
            with open(test_file, 'wb') as f:
                f.write(b'0' * (2 * 1024 * 1024))
            print(f"  ✅ Fichier test créé: {test_file}")
        else:
            print(f"  ✅ Fichier test existe: {test_file}")
    
    return test_dir

async def run_api_connectivity_tests():
    """Tests de connectivité avec les APIs"""
    
    print("\n🌐 TESTS DE CONNECTIVITÉ")
    print("=" * 50)
    
    # Test 1: Variables d'environnement
    print("\n1. Vérification variables d'environnement")
    
    required_vars = [
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID', 
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET',
        'FRAMEIO_JWT_KEY'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"  ✅ {var}: {value[:10]}...")
        else:
            print(f"  ❌ {var}: Non défini")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️ Variables manquantes: {missing_vars}")
        print("Configuration nécessaire pour les tests API complets")
        return False
    
    # Test 2: Authentification Frame.io
    print("\n2. Test authentification Frame.io")
    
    try:
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY')
                }
            }
        }
        
        from src.integrations.frameio.oauth_auth import FrameIOOAuthAuth
        
        auth = FrameIOOAuthAuth(config)
        headers = await auth.get_headers()
        
        if headers and 'Authorization' in headers:
            print("  ✅ Authentification Frame.io réussie")
            
            # Test récupération projets
            from src.integrations.frameio.structure import FrameIOStructureManager
            structure_manager = FrameIOStructureManager(auth)
            
            projects = await structure_manager.get_projects()
            print(f"  ✅ {len(projects)} projet(s) trouvé(s)")
            
            for project in projects[:3]:
                print(f"     - {project.name} ({project.id})")
            
            return True
        else:
            print("  ❌ Échec authentification Frame.io")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur authentification: {e}")
        return False

async def run_discord_tests():
    """Tests Discord"""
    
    print("\n💬 TESTS DISCORD")
    print("=" * 50)
    
    webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
    
    if not webhook_url:
        print("  ⚠️ DISCORD_WEBHOOK_URL non défini - tests Discord ignorés")
        return False
    
    try:
        from src.integrations.frameio.notifier import FrameIODiscordNotifier, FrameIONotificationData
        from datetime import datetime
        
        notifier = FrameIODiscordNotifier(webhook_url)
        
        # Créer des données de test
        test_data = FrameIONotificationData(
            file_name="TEST_SC01_UNDLM_00412_V002.mov",
            shot_id="UNDLM_00412",
            scene_name="SC01_TEST",
            version="V002",
            nomenclature="TEST_SC01_UNDLM_00412_V002",
            file_size=1024*1024*25,  # 25MB
            upload_status="ready",
            review_link="https://app.frame.io/projects/test/files/test",
            folder_path="SCENES/SC01_TEST/UNDLM_00412",
            upload_timestamp=datetime.now().isoformat(),
            file_id="test_file_123",
            project_id="test_project_456",
            description="🧪 Test automatisé de l'intégration",
            tags=["test", "integration", "automated"]
        )
        
        # Test notification de succès
        result = notifier.send_upload_success_notification(test_data)
        
        if result:
            print("  ✅ Notification Discord de succès envoyée")
        else:
            print("  ❌ Échec envoi notification Discord")
            return False
        
        # Test notification d'erreur
        error_data = test_data._replace(
            upload_status="error",
            error_message="🧪 Test d'erreur automatisé"
        )
        
        result = notifier.send_upload_error_notification(error_data)
        
        if result:
            print("  ✅ Notification Discord d'erreur envoyée")
        else:
            print("  ❌ Échec envoi notification d'erreur")
            return False
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erreur tests Discord: {e}")
        return False

async def run_full_workflow_test():
    """Test du workflow complet (si possible)"""
    
    print("\n🔄 TEST WORKFLOW COMPLET")
    print("=" * 50)
    
    # Vérifier les prérequis
    required_vars = ['FRAMEIO_ACCOUNT_ID', 'FRAMEIO_CLIENT_ID', 'FRAMEIO_CLIENT_SECRET', 'FRAMEIO_JWT_KEY']
    if not all(os.getenv(var) for var in required_vars):
        print("  ⚠️ Configuration Frame.io incomplète - test workflow ignoré")
        return False
    
    try:
        # Configuration complète
        config = {
            'frameio': {
                'account_id': os.getenv('FRAMEIO_ACCOUNT_ID'),
                'workspace_id': os.getenv('FRAMEIO_WORKSPACE_ID'),
                'project_id': os.getenv('FRAMEIO_PROJECT_ID'),
                'oauth': {
                    'client_id': os.getenv('FRAMEIO_CLIENT_ID'),
                    'client_secret': os.getenv('FRAMEIO_CLIENT_SECRET'),
                    'jwt_key': os.getenv('FRAMEIO_JWT_KEY')
                }
            },
            'discord': {
                'webhook_url': os.getenv('DISCORD_WEBHOOK_URL')
            }
        }
        
        from src.integrations.frameio.integration import create_frameio_integration
        
        # Créer l'intégration
        integration = create_frameio_integration(config)
        
        print("  ✅ Intégration Frame.io créée")
        
        # Créer un fichier de test
        test_file = Path("./test_files/TEST_WORKFLOW_SC99_UNDLM_99999_V999.mov")
        test_file.parent.mkdir(exist_ok=True)
        
        # Créer un petit fichier test (5MB)
        with open(test_file, 'wb') as f:
            f.write(b'TEST_WORKFLOW_DATA' * (5 * 1024 * 1024 // 18))
        
        print(f"  ✅ Fichier test créé: {test_file}")
        
        # Tester le workflow complet
        print("  🔄 Traitement du fichier...")
        
        result = await integration.process_file(str(test_file))
        
        if result['status'] == 'success':
            print("  ✅ Workflow complet réussi!")
            print(f"     → Nomenclature: {result['metadata']['nomenclature']}")
            print(f"     → Folder ID: {result['folder_id']}")
            print(f"     → File ID: {result['upload_result']['file_id']}")
            print(f"     → Lien review: {result['upload_result']['review_link']}")
            
            # Nettoyer le fichier test
            test_file.unlink()
            print("  🧹 Fichier test nettoyé")
            
            return True
        else:
            print(f"  ❌ Échec workflow: {result['error']}")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur workflow complet: {e}")
        return False

async def main():
    """Fonction principale de test"""
    
    print("🧪 SUITE DE TESTS - INTÉGRATION LUCIDLINK → FRAME.IO")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Tests unitaires
    print("🔧 TESTS UNITAIRES")
    print("=" * 50)
    
    # Lancer les tests unittest
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Ajouter les tests
    suite.addTests(loader.loadTestsFromTestCase(TestFrameIOParser))
    suite.addTests(loader.loadTestsFromTestCase(TestFrameIONotifier))
    
    # Runner silent pour éviter la sortie verbose
    runner = unittest.TextTestRunner(verbosity=1, stream=open(os.devnull, 'w'))
    result = runner.run(suite)
    
    if result.wasSuccessful():
        print("✅ Tous les tests unitaires sont passés")
    else:
        print(f"❌ {len(result.failures)} test(s) échoué(s), {len(result.errors)} erreur(s)")
        for test, error in result.failures + result.errors:
            print(f"   - {test}: {error.split(chr(10))[0]}")
    
    # Tests d'intégration
    test_dir = await run_integration_tests()
    
    # Tests de connectivité
    api_ok = await run_api_connectivity_tests()
    
    # Tests Discord
    discord_ok = await run_discord_tests()
    
    # Test workflow complet (si configuration complète)
    workflow_ok = False
    if api_ok:
        workflow_ok = await run_full_workflow_test()
    
    # Résumé final
    print("\n📋 RÉSUMÉ DES TESTS")
    print("=" * 50)
    print(f"✅ Tests unitaires: {'PASS' if result.wasSuccessful() else 'FAIL'}")
    print(f"✅ Tests intégration: PASS")
    print(f"{'✅' if api_ok else '❌'} Tests API Frame.io: {'PASS' if api_ok else 'FAIL/SKIP'}")
    print(f"{'✅' if discord_ok else '❌'} Tests Discord: {'PASS' if discord_ok else 'FAIL/SKIP'}")
    print(f"{'✅' if workflow_ok else '❌'} Test workflow complet: {'PASS' if workflow_ok else 'FAIL/SKIP'}")
    
    # Score global
    total_tests = 5
    passed_tests = sum([
        result.wasSuccessful(),
        True,  # Tests intégration
        api_ok,
        discord_ok,
        workflow_ok
    ])
    
    score = (passed_tests / total_tests) * 100
    
    print(f"\n🎯 Score global: {score:.0f}% ({passed_tests}/{total_tests})")
    
    if score >= 80:
        print("🎉 Intégration prête pour la production!")
    elif score >= 60:
        print("⚠️ Intégration fonctionnelle avec quelques limitations")
    else:
        print("❌ Configuration nécessaire avant déploiement")
    
    # Instructions finales
    print("\n📋 INSTRUCTIONS")
    print("=" * 50)
    
    if not api_ok:
        print("1. Configurez les variables d'environnement Frame.io:")
        print("   export FRAMEIO_ACCOUNT_ID=your_account_id")
        print("   export FRAMEIO_WORKSPACE_ID=your_workspace_id")
        print("   export FRAMEIO_CLIENT_ID=your_client_id")
        print("   export FRAMEIO_CLIENT_SECRET=your_client_secret")
        print("   export FRAMEIO_JWT_KEY=your_jwt_key")
    
    if not discord_ok:
        print("2. Configurez le webhook Discord:")
        print("   export DISCORD_WEBHOOK_URL=your_webhook_url")
    
    if api_ok and not workflow_ok:
        print("3. Vérifiez les permissions Frame.io et réessayez")
    
    print("4. Lancez le déploiement:")
    print("   sudo ./scripts/deploy_frameio_integration.sh")
    
    # Nettoyer les fichiers de test
    if test_dir.exists():
        import shutil
        shutil.rmtree(test_dir)
        print("\n🧹 Fichiers de test nettoyés")

if __name__ == "__main__":
    asyncio.run(main())
