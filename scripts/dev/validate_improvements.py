#!/usr/bin/env python3
"""
Script de validation des améliorations apportées au système Frame.io
"""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Dict, List, Any, Tuple
import sys
from datetime import datetime

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FrameIOValidationSuite:
    """Suite de tests pour valider les améliorations Frame.io"""
    
    def __init__(self):
        self.results = []
        self.start_time = time.time()
        self.project_root = Path(__file__).parent.parent
    
    def log_result(self, test_name: str, success: bool, message: str, duration: float = 0):
        """Enregistrer un résultat de test"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        }
        self.results.append(result)
        
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        if duration > 0:
            print(f"   ⏱️  Durée: {duration:.2f}s")
    
    async def test_file_structure(self) -> bool:
        """Tester la structure des fichiers"""
        print("\n📁 Test de la structure des fichiers")
        print("-" * 40)
        
        required_files = [
            'src/integrations/frameio/structure.py',
            'src/integrations/frameio/upload.py',
            'src/integrations/frameio/auth.py',
            'src/utils/alerts.py',
            'config/optimization.json',
            'config/alerts.json',
            'scripts/frameio_admin_cli.py',
            'scripts/frameio_optimization.py',
            'docs/FRAMEIO_ADVANCED_ADMIN.md'
        ]
        
        missing_files = []
        for file_path in required_files:
            full_path = self.project_root / file_path
            if not full_path.exists():
                missing_files.append(file_path)
        
        if missing_files:
            self.log_result(
                "Structure des fichiers",
                False,
                f"Fichiers manquants: {', '.join(missing_files)}"
            )
            return False
        else:
            self.log_result(
                "Structure des fichiers",
                True,
                f"Tous les fichiers requis sont présents ({len(required_files)} fichiers)"
            )
            return True
    
    async def test_config_files(self) -> bool:
        """Tester les fichiers de configuration"""
        print("\n⚙️  Test des fichiers de configuration")
        print("-" * 40)
        
        config_files = [
            ('config/optimization.json', ['cache_ttl', 'rate_limiting', 'upload_optimization']),
            ('config/alerts.json', ['enabled', 'channels', 'rules']),
            ('config/nomenclature.json', ['file_naming', 'frameio_mapping'])
        ]
        
        all_valid = True
        
        for file_path, required_keys in config_files:
            full_path = self.project_root / file_path
            
            if not full_path.exists():
                self.log_result(
                    f"Configuration {file_path}",
                    False,
                    "Fichier manquant"
                )
                all_valid = False
                continue
            
            try:
                with open(full_path, 'r') as f:
                    config = json.load(f)
                
                missing_keys = [key for key in required_keys if key not in config]
                
                if missing_keys:
                    self.log_result(
                        f"Configuration {file_path}",
                        False,
                        f"Clés manquantes: {', '.join(missing_keys)}"
                    )
                    all_valid = False
                else:
                    self.log_result(
                        f"Configuration {file_path}",
                        True,
                        "Configuration valide"
                    )
                    
            except json.JSONDecodeError as e:
                self.log_result(
                    f"Configuration {file_path}",
                    False,
                    f"JSON invalide: {e}"
                )
                all_valid = False
            except Exception as e:
                self.log_result(
                    f"Configuration {file_path}",
                    False,
                    f"Erreur: {e}"
                )
                all_valid = False
        
        return all_valid
    
    async def test_import_modules(self) -> bool:
        """Tester l'importation des modules"""
        print("\n🐍 Test d'importation des modules")
        print("-" * 40)
        
        # Ajouter le répertoire src au path
        sys.path.insert(0, str(self.project_root / "src"))
        
        modules_to_test = [
            'utils.alerts',
            'integrations.frameio.auth',
            'integrations.frameio.structure',
            'integrations.frameio.upload'
        ]
        
        all_imported = True
        
        for module_name in modules_to_test:
            try:
                __import__(module_name)
                self.log_result(
                    f"Import {module_name}",
                    True,
                    "Module importé avec succès"
                )
            except ImportError as e:
                self.log_result(
                    f"Import {module_name}",
                    False,
                    f"Erreur d'importation: {e}"
                )
                all_imported = False
            except Exception as e:
                self.log_result(
                    f"Import {module_name}",
                    False,
                    f"Erreur inattendue: {e}"
                )
                all_imported = False
        
        return all_imported
    
    async def test_cache_system(self) -> bool:
        """Tester le système de cache"""
        print("\n💾 Test du système de cache")
        print("-" * 40)
        
        try:
            # Importer les modules nécessaires
            from integrations.frameio.structure import FrameIOStructureCache
            
            # Créer un cache temporaire
            cache_file = self.project_root / "temp" / "test_cache.json"
            cache_file.parent.mkdir(exist_ok=True)
            
            start_time = time.time()
            
            # Tester les opérations de cache
            cache = FrameIOStructureCache(cache_file)
            
            # Test set/get
            test_data = {"test": "value", "number": 42}
            cache.set("test_key", test_data, ttl_seconds=3600)
            
            retrieved = cache.get("test_key")
            if retrieved != test_data:
                raise ValueError("Données récupérées incorrectes")
            
            # Test des statistiques
            stats = cache.get_stats()
            if not isinstance(stats, dict):
                raise ValueError("Statistiques invalides")
            
            # Test de sauvegarde
            cache.save_cache()
            
            # Nettoyer
            if cache_file.exists():
                cache_file.unlink()
            
            duration = time.time() - start_time
            self.log_result(
                "Système de cache",
                True,
                "Cache fonctionne correctement",
                duration
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Système de cache",
                False,
                f"Erreur: {e}"
            )
            return False
    
    async def test_alert_system(self) -> bool:
        """Tester le système d'alertes"""
        print("\n🚨 Test du système d'alertes")
        print("-" * 40)
        
        try:
            from utils.alerts import AlertManager, AlertLevel
            
            start_time = time.time()
            
            # Créer un gestionnaire d'alertes
            alert_manager = AlertManager()
            
            # Test avec des métriques qui devraient déclencher des alertes
            test_metrics = {
                "error_rate": 0.08,  # 8% - devrait déclencher une alerte
                "average_api_duration": 6.0,  # 6s - devrait déclencher une alerte
                "cache_hit_rate": 0.6,  # 60% - devrait déclencher une alerte
                "memory_mb": 600,  # 600MB - devrait déclencher une alerte
                "upload_failure_rate": 0.12  # 12% - devrait déclencher une alerte
            }
            
            # Vérifier les alertes
            alerts = await alert_manager.check_metrics(test_metrics)
            
            if not alerts:
                raise ValueError("Aucune alerte générée avec des métriques problématiques")
            
            # Vérifier les types d'alertes
            alert_levels = [alert.level for alert in alerts]
            if AlertLevel.ERROR not in alert_levels and AlertLevel.WARNING not in alert_levels:
                raise ValueError("Niveaux d'alerte incorrects")
            
            # Test des statistiques
            stats = alert_manager.get_alert_stats()
            if not isinstance(stats, dict):
                raise ValueError("Statistiques d'alertes invalides")
            
            duration = time.time() - start_time
            self.log_result(
                "Système d'alertes",
                True,
                f"Alertes générées: {len(alerts)}",
                duration
            )
            return True
            
        except Exception as e:
            self.log_result(
                "Système d'alertes",
                False,
                f"Erreur: {e}"
            )
            return False
    
    async def test_cli_scripts(self) -> bool:
        """Tester les scripts CLI"""
        print("\n🖥️  Test des scripts CLI")
        print("-" * 40)
        
        scripts_to_test = [
            'scripts/frameio_admin_cli.py',
            'scripts/frameio_optimization.py'
        ]
        
        all_valid = True
        
        for script_path in scripts_to_test:
            full_path = self.project_root / script_path
            
            if not full_path.exists():
                self.log_result(
                    f"Script {script_path}",
                    False,
                    "Fichier manquant"
                )
                all_valid = False
                continue
            
            try:
                # Vérifier que le script est exécutable
                if not full_path.is_file():
                    raise ValueError("N'est pas un fichier")
                
                # Vérifier le contenu de base
                with open(full_path, 'r') as f:
                    content = f.read()
                    if not content.strip():
                        raise ValueError("Fichier vide")
                    if not content.startswith('#!/usr/bin/env python3'):
                        raise ValueError("Shebang manquant")
                
                self.log_result(
                    f"Script {script_path}",
                    True,
                    "Script valide"
                )
                
            except Exception as e:
                self.log_result(
                    f"Script {script_path}",
                    False,
                    f"Erreur: {e}"
                )
                all_valid = False
        
        return all_valid
    
    async def test_documentation(self) -> bool:
        """Tester la documentation"""
        print("\n📚 Test de la documentation")
        print("-" * 40)
        
        doc_files = [
            'docs/FRAMEIO_ADVANCED_ADMIN.md',
            'README.md'
        ]
        
        all_valid = True
        
        for doc_path in doc_files:
            full_path = self.project_root / doc_path
            
            if not full_path.exists():
                self.log_result(
                    f"Documentation {doc_path}",
                    False,
                    "Fichier manquant"
                )
                all_valid = False
                continue
            
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if len(content.strip()) < 100:
                    raise ValueError("Documentation trop courte")
                
                # Vérifier la présence de titres
                if not any(line.startswith('#') for line in content.split('\n')):
                    raise ValueError("Aucun titre Markdown trouvé")
                
                self.log_result(
                    f"Documentation {doc_path}",
                    True,
                    f"Documentation valide ({len(content)} caractères)"
                )
                
            except Exception as e:
                self.log_result(
                    f"Documentation {doc_path}",
                    False,
                    f"Erreur: {e}"
                )
                all_valid = False
        
        return all_valid
    
    async def run_all_tests(self) -> Dict[str, Any]:
        """Exécuter tous les tests"""
        print("🚀 Démarrage de la validation des améliorations Frame.io")
        print("=" * 60)
        
        tests = [
            ("Structure des fichiers", self.test_file_structure),
            ("Fichiers de configuration", self.test_config_files),
            ("Importation des modules", self.test_import_modules),
            ("Système de cache", self.test_cache_system),
            ("Système d'alertes", self.test_alert_system),
            ("Scripts CLI", self.test_cli_scripts),
            ("Documentation", self.test_documentation)
        ]
        
        for test_name, test_func in tests:
            try:
                await test_func()
            except Exception as e:
                self.log_result(
                    test_name,
                    False,
                    f"Erreur inattendue: {e}"
                )
        
        # Résumé final
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - passed_tests
        
        total_duration = time.time() - self.start_time
        
        print("\n📊 RÉSUMÉ DE LA VALIDATION")
        print("=" * 60)
        print(f"✅ Tests réussis: {passed_tests}/{total_tests}")
        print(f"❌ Tests échoués: {failed_tests}/{total_tests}")
        print(f"⏱️  Durée totale: {total_duration:.2f}s")
        print(f"📈 Taux de réussite: {passed_tests/total_tests*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ ÉCHECS DÉTAILLÉS:")
            for result in self.results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Recommandations
        print("\n💡 RECOMMANDATIONS:")
        if failed_tests == 0:
            print("   🎉 Tous les tests sont passés! Le système est prêt.")
        else:
            print("   🔧 Corrigez les erreurs mentionnées ci-dessus.")
            print("   📚 Consultez la documentation pour plus d'informations.")
        
        return {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'success_rate': passed_tests/total_tests,
            'total_duration': total_duration,
            'results': self.results
        }
    
    def save_report(self, summary: Dict[str, Any]):
        """Sauvegarder le rapport de validation"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_path = self.project_root / "logs" / f"validation_report_{timestamp}.json"
        
        # Créer le dossier logs s'il n'existe pas
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n📄 Rapport sauvegardé: {report_path}")

async def main():
    """Point d'entrée principal"""
    validator = FrameIOValidationSuite()
    
    try:
        summary = await validator.run_all_tests()
        validator.save_report(summary)
        
        # Code de sortie basé sur le résultat
        if summary['failed_tests'] == 0:
            print("\n🎉 Validation réussie!")
            sys.exit(0)
        else:
            print("\n❌ Validation échouée!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Validation interrompue par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
