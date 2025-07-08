#!/usr/bin/env python3
"""
RL PostFlow - CLI avancé pour l'administration Frame.io
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Dict, Any, Optional
import logging
from datetime import datetime

# Ajouter le répertoire src au path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    from integrations.frameio.auth import FrameIOAuth
    from integrations.frameio.structure import FrameIOStructureManager
    from integrations.frameio.upload import FrameIOUploadManager
    from integrations.frameio.production_upload import ProductionUploadManager
    from utils.config import ConfigManager
    from utils.nomenclature import NomenclatureManager
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("💡 Assurez-vous d'être dans le répertoire racine du projet")
    sys.exit(1)

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FrameIOCLI:
    """Interface CLI avancée pour Frame.io"""
    
    def __init__(self):
        self.config_manager = ConfigManager()
        self.nomenclature_manager = NomenclatureManager()
        self.auth = None
        self.structure_manager = None
        self.upload_manager = None
        self.production_manager = None
    
    async def init_auth(self) -> bool:
        """Initialiser l'authentification"""
        try:
            self.auth = FrameIOAuth(self.config_manager.get_config())
            
            # Vérifier que l'auth fonctionne
            await self.auth.get_access_token()
            
            self.structure_manager = FrameIOStructureManager(self.auth)
            self.upload_manager = FrameIOUploadManager(self.auth)
            self.production_manager = ProductionUploadManager(self.auth)
            
            print("✅ Authentification Frame.io initialisée")
            return True
            
        except Exception as e:
            print(f"❌ Erreur d'authentification: {e}")
            return False
    
    async def cmd_cache_stats(self) -> None:
        """Afficher les statistiques du cache"""
        print("\n📊 Statistiques du cache Frame.io")
        print("=" * 50)
        
        if not self.structure_manager:
            print("❌ Structure manager non initialisé")
            return
        
        try:
            stats = self.structure_manager.cache.get_stats()
            
            print(f"📁 Fichier cache: {stats['cache_file_path']}")
            print(f"📊 Entrées totales: {stats['total_entries']}")
            print(f"✅ Entrées valides: {stats['valid_entries']}")
            print(f"⏰ Entrées expirées: {stats['expired_entries']}")
            print(f"💾 Taille fichier: {stats['cache_size_bytes']} bytes")
            
            if stats['total_entries'] > 0:
                print(f"📈 Ratio validité: {stats['valid_entries'] / stats['total_entries'] * 100:.1f}%")
            
        except Exception as e:
            print(f"❌ Erreur récupération stats: {e}")
    
    async def cmd_cache_clear(self, pattern: Optional[str] = None) -> None:
        """Vider le cache (complètement ou par pattern)"""
        if not self.structure_manager:
            print("❌ Structure manager non initialisé")
            return
        
        try:
            if pattern:
                count = self.structure_manager.cache.invalidate_pattern(pattern)
                print(f"🗑️  Cache vidé: {count} entrées correspondant à '{pattern}'")
            else:
                self.structure_manager.cache.clear()
                print("🗑️  Cache vidé complètement")
            
            self.structure_manager.cache.save_cache()
            print("💾 Cache sauvegardé")
            
        except Exception as e:
            print(f"❌ Erreur vidage cache: {e}")
    
    async def cmd_validate_config(self) -> None:
        """Valider la configuration complète"""
        print("\n🔍 Validation de la configuration")
        print("=" * 50)
        
        # Vérifier les variables d'environnement
        required_vars = [
            'FRAMEIO_CLIENT_ID',
            'FRAMEIO_CLIENT_SECRET',
            'FRAMEIO_ACCOUNT_ID',
            'FRAMEIO_WORKSPACE_ID',
            'FRAMEIO_ROOT_FOLDER_ID'
        ]
        
        env_ok = True
        for var in required_vars:
            import os
            value = os.getenv(var)
            if value:
                print(f"✅ {var}: {value[:10]}...")
            else:
                print(f"❌ {var}: manquant")
                env_ok = False
        
        if not env_ok:
            print("\n💡 Configurez les variables d'environnement manquantes")
            return
        
        # Vérifier l'authentification
        if await self.init_auth():
            print("✅ Authentification Frame.io: OK")
        else:
            print("❌ Authentification Frame.io: ÉCHEC")
            return
        
        # Vérifier la structure
        try:
            projects = await self.structure_manager.get_projects()
            print(f"✅ Projets accessibles: {len(projects)}")
            
            for project in projects[:3]:  # Montrer les 3 premiers
                print(f"   📁 {project.name} ({project.id})")
                
        except Exception as e:
            print(f"❌ Erreur accès projets: {e}")
    
    async def cmd_structure_info(self, project_id: Optional[str] = None) -> None:
        """Afficher les informations sur la structure"""
        if not self.structure_manager:
            print("❌ Structure manager non initialisé")
            return
        
        print("\n📁 Informations sur la structure Frame.io")
        print("=" * 50)
        
        try:
            if project_id:
                # Informations sur un projet spécifique
                project = await self.structure_manager.get_project_by_id(project_id)
                if project:
                    print(f"📋 Projet: {project.name}")
                    print(f"🆔 ID: {project.id}")
                    print(f"📁 Dossier racine: {project.root_folder_id}")
                    print(f"🏢 Workspace: {project.workspace_id}")
                    print(f"📅 Créé: {project.created_at}")
                else:
                    print(f"❌ Projet {project_id} introuvable")
            else:
                # Résumé de la structure
                summary = await self.structure_manager.get_folder_structure_summary()
                
                print(f"📋 Projet: {summary.get('project_name', 'N/A')}")
                print(f"🎬 Scènes: {summary.get('scenes_count', 0)}")
                print(f"🎞️  Plans: {summary.get('shots_count', 0)}")
                print(f"📅 Dernière MAJ: {summary.get('last_updated', 'N/A')}")
                
                # Détails des scènes
                scenes = summary.get('scenes', [])
                if scenes:
                    print("\n📋 Détail des scènes:")
                    for scene in scenes[:5]:  # Montrer les 5 premières
                        print(f"   🎬 {scene['name']}: {scene['shots_count']} plans")
                        for shot in scene.get('shots', [])[:3]:  # Montrer les 3 premiers plans
                            print(f"      🎞️  {shot}")
                
        except Exception as e:
            print(f"❌ Erreur récupération structure: {e}")
    
    async def cmd_test_upload(self, file_path: str, scene_name: str, shot_id: str) -> None:
        """Tester l'upload d'un fichier"""
        if not self.production_manager:
            print("❌ Production manager non initialisé")
            return
        
        print(f"\n🔄 Test d'upload: {file_path}")
        print("=" * 50)
        
        try:
            # Vérifier que le fichier existe
            file_path_obj = Path(file_path)
            if not file_path_obj.exists():
                print(f"❌ Fichier introuvable: {file_path}")
                return
            
            print(f"📁 Fichier: {file_path_obj.name}")
            print(f"📏 Taille: {file_path_obj.stat().st_size} bytes")
            print(f"🎬 Scène: {scene_name}")
            print(f"🎞️  Plan: {shot_id}")
            
            # Effectuer l'upload
            result = await self.production_manager.upload_file(
                file_path=str(file_path_obj),
                scene_name=scene_name,
                shot_id=shot_id
            )
            
            if result:
                print("✅ Upload réussi!")
                print(f"🆔 ID Frame.io: {result.get('id')}")
                print(f"🔗 URL: {result.get('view_url')}")
            else:
                print("❌ Upload échoué")
                
        except Exception as e:
            print(f"❌ Erreur upload: {e}")
    
    async def cmd_nomenclature_test(self, filename: str) -> None:
        """Tester la nomenclature sur un nom de fichier"""
        print(f"\n🔍 Test nomenclature: {filename}")
        print("=" * 50)
        
        try:
            # Valider le nom
            is_valid = self.nomenclature_manager.validate_filename(filename)
            print(f"✅ Valide: {is_valid}")
            
            if is_valid:
                # Extraire les composants
                components = self.nomenclature_manager.parse_filename(filename)
                print("\n📋 Composants extraits:")
                for key, value in components.items():
                    print(f"   {key}: {value}")
                
                # Prédire la structure de dossier
                folder_info = self.nomenclature_manager.get_folder_structure_info(filename)
                print(f"\n📁 Structure dossier prédite:")
                print(f"   Scène: {folder_info.get('scene_name', 'N/A')}")
                print(f"   Plan: {folder_info.get('shot_id', 'N/A')}")
                print(f"   Chemin complet: {folder_info.get('full_path', 'N/A')}")
            else:
                print("❌ Nom de fichier invalide selon la nomenclature")
                print("💡 Formats supportés:")
                config = self.nomenclature_manager.get_nomenclature_config()
                patterns = config.get('file_naming', {}).get('patterns', {})
                for pattern_name, pattern_info in patterns.items():
                    print(f"   • {pattern_info.get('name', pattern_name)}")
                    for example in pattern_info.get('examples', []):
                        print(f"     📝 {example}")
                
        except Exception as e:
            print(f"❌ Erreur test nomenclature: {e}")
    
    async def cmd_health_check(self) -> None:
        """Vérification complète de santé du système"""
        print("\n🏥 Vérification de santé du système")
        print("=" * 50)
        
        checks = [
            ("Configuration", self.check_config),
            ("Authentification", self.check_auth),
            ("Structure Frame.io", self.check_structure),
            ("Cache", self.check_cache),
            ("Nomenclature", self.check_nomenclature),
            ("Upload", self.check_upload_capability)
        ]
        
        results = {}
        for check_name, check_func in checks:
            try:
                print(f"\n🔍 {check_name}...")
                result = await check_func()
                results[check_name] = result
                
                if result:
                    print(f"✅ {check_name}: OK")
                else:
                    print(f"❌ {check_name}: ÉCHEC")
                    
            except Exception as e:
                print(f"❌ {check_name}: ERREUR - {e}")
                results[check_name] = False
        
        # Résumé
        print("\n📊 Résumé des vérifications")
        print("=" * 30)
        success_count = sum(1 for result in results.values() if result)
        total_count = len(results)
        
        print(f"✅ Réussies: {success_count}/{total_count}")
        print(f"❌ Échouées: {total_count - success_count}/{total_count}")
        
        if success_count == total_count:
            print("\n🎉 Système entièrement opérationnel!")
        else:
            print("\n⚠️  Certaines vérifications ont échoué")
    
    async def check_config(self) -> bool:
        """Vérifier la configuration"""
        try:
            config = self.config_manager.get_config()
            return bool(config.get('frameio', {}).get('client_id'))
        except:
            return False
    
    async def check_auth(self) -> bool:
        """Vérifier l'authentification"""
        try:
            if not self.auth:
                await self.init_auth()
            return self.auth is not None
        except:
            return False
    
    async def check_structure(self) -> bool:
        """Vérifier l'accès à la structure"""
        try:
            if not self.structure_manager:
                return False
            projects = await self.structure_manager.get_projects()
            return len(projects) > 0
        except:
            return False
    
    async def check_cache(self) -> bool:
        """Vérifier le cache"""
        try:
            if not self.structure_manager:
                return False
            stats = self.structure_manager.cache.get_stats()
            return stats is not None
        except:
            return False
    
    async def check_nomenclature(self) -> bool:
        """Vérifier la nomenclature"""
        try:
            config = self.nomenclature_manager.get_nomenclature_config()
            return bool(config.get('file_naming', {}).get('patterns'))
        except:
            return False
    
    async def check_upload_capability(self) -> bool:
        """Vérifier la capacité d'upload"""
        try:
            return self.upload_manager is not None
        except:
            return False
    
    async def main(self):
        """Point d'entrée principal"""
        parser = argparse.ArgumentParser(
            description="RL PostFlow - CLI avancé pour Frame.io",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Exemples d'utilisation:
  %(prog)s cache stats                    # Statistiques du cache
  %(prog)s cache clear                    # Vider le cache
  %(prog)s cache clear --pattern folder_  # Vider entries "folder_*"
  %(prog)s validate                       # Valider la configuration
  %(prog)s structure                      # Informations structure
  %(prog)s structure --project-id 123     # Structure d'un projet
  %(prog)s test-upload file.mp4 SC01 S01  # Tester un upload
  %(prog)s nomenclature test.mp4          # Tester la nomenclature
  %(prog)s health                         # Vérification complète
            """
        )
        
        subparsers = parser.add_subparsers(dest='command', help='Commandes disponibles')
        
        # Cache
        cache_parser = subparsers.add_parser('cache', help='Gestion du cache')
        cache_subparsers = cache_parser.add_subparsers(dest='cache_action')
        
        cache_subparsers.add_parser('stats', help='Statistiques du cache')
        
        clear_parser = cache_subparsers.add_parser('clear', help='Vider le cache')
        clear_parser.add_argument('--pattern', help='Pattern pour vider sélectivement')
        
        # Validation
        subparsers.add_parser('validate', help='Valider la configuration')
        
        # Structure
        structure_parser = subparsers.add_parser('structure', help='Informations structure')
        structure_parser.add_argument('--project-id', help='ID du projet spécifique')
        
        # Test upload
        upload_parser = subparsers.add_parser('test-upload', help='Tester un upload')
        upload_parser.add_argument('file_path', help='Chemin du fichier à uploader')
        upload_parser.add_argument('scene_name', help='Nom de la scène')
        upload_parser.add_argument('shot_id', help='ID du plan')
        
        # Nomenclature
        nomenclature_parser = subparsers.add_parser('nomenclature', help='Test nomenclature')
        nomenclature_parser.add_argument('filename', help='Nom de fichier à tester')
        
        # Health check
        subparsers.add_parser('health', help='Vérification complète de santé')
        
        args = parser.parse_args()
        
        if not args.command:
            parser.print_help()
            return
        
        # Exécuter la commande
        try:
            if args.command == 'cache':
                if args.cache_action == 'stats':
                    await self.init_auth()
                    await self.cmd_cache_stats()
                elif args.cache_action == 'clear':
                    await self.init_auth()
                    await self.cmd_cache_clear(args.pattern)
                else:
                    cache_parser.print_help()
            
            elif args.command == 'validate':
                await self.cmd_validate_config()
            
            elif args.command == 'structure':
                await self.init_auth()
                await self.cmd_structure_info(args.project_id)
            
            elif args.command == 'test-upload':
                await self.init_auth()
                await self.cmd_test_upload(args.file_path, args.scene_name, args.shot_id)
            
            elif args.command == 'nomenclature':
                await self.cmd_nomenclature_test(args.filename)
            
            elif args.command == 'health':
                await self.cmd_health_check()
            
            else:
                parser.print_help()
                
        except KeyboardInterrupt:
            print("\n\n🛑 Opération interrompue par l'utilisateur")
        except Exception as e:
            print(f"\n❌ Erreur inattendue: {e}")
            logger.exception("Erreur CLI")
        finally:
            # Nettoyer les ressources
            if self.auth:
                await self.auth.close()

if __name__ == "__main__":
    cli = FrameIOCLI()
    asyncio.run(cli.main())
