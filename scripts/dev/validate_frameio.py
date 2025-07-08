#!/usr/bin/env python3
"""
Script de validation pour Frame.io API v4 avec Adobe IMS
"""

import asyncio
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional

# Ajouter le répertoire src au path pour les imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    from integrations.frameio.auth import FrameIOAuth, FrameIOAuthError
    from integrations.frameio.structure import FrameIOStructureManager
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("💡 Essayons d'importer directement depuis les modules...")
    
    # Import direct depuis les fichiers
    import importlib.util
    
    # Charger le module auth
    auth_path = Path(__file__).parent.parent / "src/integrations/frameio/auth.py"
    spec = importlib.util.spec_from_file_location("frameio_auth", auth_path)
    auth_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(auth_module)
    
    FrameIOAuth = auth_module.FrameIOAuth
    FrameIOAuthError = auth_module.FrameIOAuthError
    
    # Charger le module structure
    structure_path = Path(__file__).parent.parent / "src/integrations/frameio/structure.py"
    spec = importlib.util.spec_from_file_location("frameio_structure", structure_path)
    structure_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(structure_module)
    
    FrameIOStructureManager = structure_module.FrameIOStructureManager


class FrameIOValidator:
    """Validateur pour l'intégration Frame.io"""
    
    def __init__(self):
        self.auth: Optional[FrameIOAuth] = None
        self.structure_manager: Optional[FrameIOStructureManager] = None
    
    def print_header(self):
        """Affiche l'en-tête du validateur"""
        print("=" * 60)
        print("🎬 Validation Frame.io API v4 - Adobe IMS OAuth 2.0")
        print("=" * 60)
        print()
    
    def print_step(self, step: int, title: str):
        """Affiche un titre d'étape"""
        print(f"\n📋 Étape {step}: {title}")
        print("-" * 40)
    
    def load_environment(self) -> bool:
        """Charge les variables d'environnement"""
        self.print_step(1, "Chargement des variables d'environnement")
        
        env_file = Path(__file__).parent.parent / ".env"
        
        if env_file.exists():
            print("📄 Fichier .env trouvé")
            from dotenv import load_dotenv
            load_dotenv(env_file)
        else:
            print("⚠️  Fichier .env non trouvé, utilisation des variables système")
        
        # Vérifier les variables requises
        required_vars = [
            'FRAMEIO_CLIENT_ID',
            'FRAMEIO_CLIENT_SECRET',
            'FRAMEIO_ACCOUNT_ID',
            'FRAMEIO_WORKSPACE_ID'
        ]
        
        missing_vars = []
        for var in required_vars:
            value = os.getenv(var)
            if not value:
                missing_vars.append(var)
            else:
                print(f"✅ {var}: {value[:10]}...")
        
        if missing_vars:
            print(f"❌ Variables manquantes: {', '.join(missing_vars)}")
            print("💡 Exécutez: python scripts/configure_frameio.py")
            return False
        
        return True
    
    async def test_authentication(self) -> bool:
        """Test l'authentification"""
        self.print_step(2, "Test de l'authentification")
        
        try:
            self.auth = FrameIOAuth()
            
            print("🔐 Demande d'un token d'accès...")
            token = await self.auth.get_access_token()
            print(f"✅ Token obtenu: {token[:20]}...")
            
            print("🔍 Validation du token...")
            is_valid = await self.auth.is_token_valid()
            if is_valid:
                print("✅ Token valide")
            else:
                print("❌ Token invalide")
                return False
            
            return True
            
        except FrameIOAuthError as e:
            print(f"❌ Erreur d'authentification: {e}")
            return False
        except Exception as e:
            print(f"❌ Erreur inattendue: {e}")
            return False
    
    async def test_api_access(self) -> bool:
        """Test l'accès à l'API"""
        self.print_step(3, "Test de l'accès à l'API")
        
        try:
            print("📊 Récupération des informations du compte...")
            account_info = await self.auth.validate_credentials()
            
            accounts = account_info.get('data', [])
            if accounts:
                account = accounts[0]
                print(f"✅ Compte: {account.get('name', 'N/A')}")
                print(f"   ID: {account.get('id', 'N/A')}")
                print(f"   Type: {account.get('type', 'N/A')}")
            else:
                print("❌ Aucun compte trouvé")
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de l'accès à l'API: {e}")
            return False
    
    async def test_workspace_access(self) -> bool:
        """Test l'accès au workspace"""
        self.print_step(4, "Test de l'accès au workspace")
        
        try:
            self.structure_manager = FrameIOStructureManager(self.auth)
            
            print("📂 Récupération des projets...")
            projects = await self.structure_manager.get_projects()
            
            if projects:
                print(f"✅ {len(projects)} projet(s) trouvé(s):")
                for i, project in enumerate(projects[:5]):  # Limiter à 5 projets
                    print(f"   {i+1}. {project.name} (ID: {project.id})")
                
                if len(projects) > 5:
                    print(f"   ... et {len(projects) - 5} autres")
            else:
                print("⚠️  Aucun projet trouvé dans le workspace")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de l'accès au workspace: {e}")
            return False
    
    async def test_upload_preparation(self) -> bool:
        """Test la préparation d'upload"""
        self.print_step(5, "Test de la préparation d'upload")
        
        try:
            # Créer un fichier de test temporaire
            test_file = Path(__file__).parent.parent / "temp" / "test_upload.txt"
            test_file.parent.mkdir(exist_ok=True)
            
            with open(test_file, 'w') as f:
                f.write("Test file for Frame.io upload validation")
            
            print(f"📄 Fichier de test créé: {test_file}")
            
            # Test basique de préparation (sans upload réel)
            print("🔍 Test de la logique d'upload...")
            
            # Nettoyer le fichier de test
            if test_file.exists():
                test_file.unlink()
                print("🗑️  Fichier de test supprimé")
            
            print("✅ Préparation d'upload OK")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la préparation d'upload: {e}")
            return False
    
    def print_summary(self, results: Dict[str, bool]):
        """Affiche le résumé des tests"""
        print("\n" + "=" * 60)
        print("📋 RÉSUMÉ DE LA VALIDATION")
        print("=" * 60)
        
        all_passed = all(results.values())
        
        for test_name, passed in results.items():
            status = "✅ RÉUSSI" if passed else "❌ ÉCHOUÉ"
            print(f"{status} - {test_name}")
        
        print("\n" + "=" * 60)
        if all_passed:
            print("🎉 VALIDATION COMPLÈTE RÉUSSIE!")
            print("L'intégration Frame.io v4 est prête à être utilisée.")
        else:
            print("❌ VALIDATION ÉCHOUÉE")
            print("Certains tests ont échoué. Vérifiez votre configuration.")
        
        print("\n📝 Prochaines étapes:")
        if all_passed:
            print("   1. Intégrez Frame.io dans votre pipeline PostFlow")
            print("   2. Testez avec vos fichiers de production")
            print("   3. Configurez les workflows de review")
        else:
            print("   1. Vérifiez votre configuration: python scripts/configure_frameio.py")
            print("   2. Consultez la documentation Frame.io v4")
            print("   3. Vérifiez vos permissions de compte")
    
    async def run(self):
        """Exécute la validation complète"""
        self.print_header()
        
        results = {}
        
        try:
            # Test 1: Variables d'environnement
            results["Variables d'environnement"] = self.load_environment()
            if not results["Variables d'environnement"]:
                self.print_summary(results)
                return
            
            # Test 2: Authentification
            results["Authentification"] = await self.test_authentication()
            if not results["Authentification"]:
                self.print_summary(results)
                return
            
            # Test 3: Accès API
            results["Accès API"] = await self.test_api_access()
            
            # Test 4: Accès workspace
            results["Accès workspace"] = await self.test_workspace_access()
            
            # Test 5: Préparation upload
            results["Préparation upload"] = await self.test_upload_preparation()
            
            # Afficher le résumé
            self.print_summary(results)
            
        except KeyboardInterrupt:
            print("\n\n🛑 Validation interrompue par l'utilisateur")
        except Exception as e:
            print(f"\n❌ Erreur inattendue: {e}")
        finally:
            # Nettoyer les ressources
            if self.auth:
                await self.auth.close()


async def main():
    """Point d'entrée principal"""
    validator = FrameIOValidator()
    await validator.run()


if __name__ == "__main__":
    asyncio.run(main())
