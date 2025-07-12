#!/usr/bin/env python3
"""
🚀 RL PostFlow - Script de Déploiement Intelligent
=================================================

Déploiement automatisé multi-plateforme avec validation et rollback.
Support Windows, macOS et Linux avec hooks Git intégrés.

Version: 4.1.1
Date: 12 juillet 2025
"""

import os
import sys
import subprocess
import argparse
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

class PostFlowDeployer:
    """Gestionnaire de déploiement intelligent PostFlow"""
    
    def __init__(self, project_dir: Optional[Path] = None):
        """Initialise le déployeur"""
        self.project_dir = project_dir or Path(__file__).parent.parent
        self.platform = self._detect_platform()
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Configuration des logs
        self._setup_logging()
        
        # Statistiques de déploiement
        self.stats = {
            'start_time': datetime.now(),
            'steps_completed': 0,
            'steps_total': 0,
            'errors': [],
            'warnings': []
        }
    
    def _detect_platform(self) -> str:
        """Détecte la plateforme actuelle"""
        if os.name == 'nt':
            return 'windows'
        elif sys.platform == 'darwin':
            return 'macos'
        else:
            return 'linux'
    
    def _setup_logging(self):
        """Configure le système de logging"""
        log_dir = self.project_dir / "logs"
        log_dir.mkdir(exist_ok=True)
        
        log_file = log_dir / f"deploy_{self.timestamp}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def run_command(self, command: List[str], check: bool = True, capture_output: bool = True) -> Tuple[bool, str]:
        """Exécute une commande système"""
        try:
            self.logger.debug(f"Exécution: {' '.join(command)}")
            
            result = subprocess.run(
                command,
                cwd=self.project_dir,
                check=check,
                capture_output=capture_output,
                text=True
            )
            
            return True, result.stdout if capture_output else ""
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Erreur commande: {e}"
            if capture_output and e.stderr:
                error_msg += f"\nStderr: {e.stderr}"
            
            self.logger.error(error_msg)
            self.stats['errors'].append(error_msg)
            return False, error_msg
    
    def validate_environment(self) -> bool:
        """Valide l'environnement de déploiement"""
        self.logger.info("🔍 Validation de l'environnement...")
        self.stats['steps_total'] += 1
        
        # Vérifier Python
        success, _ = self.run_command([sys.executable, "--version"])
        if not success:
            self.logger.error("❌ Python non disponible")
            return False
        
        # Vérifier Git
        success, _ = self.run_command(["git", "--version"])
        if not success:
            self.logger.error("❌ Git non disponible")
            return False
        
        # Vérifier les fichiers critiques
        critical_files = [
            "main.py",
            "src/utils/cross_platform_paths.py",
            "migrate_to_windows.py",
            "test_cross_platform.py",
            "validate_postflow.py"
        ]
        
        for file_path in critical_files:
            if not (self.project_dir / file_path).exists():
                self.logger.error(f"❌ Fichier critique manquant: {file_path}")
                return False
        
        self.logger.info("✅ Environnement validé")
        self.stats['steps_completed'] += 1
        return True
    
    def run_pre_deploy_tests(self) -> bool:
        """Lance les tests pré-déploiement"""
        self.logger.info("🧪 Tests pré-déploiement...")
        self.stats['steps_total'] += 2
        
        # Tests cross-platform
        success, output = self.run_command([sys.executable, "test_cross_platform.py"])
        if not success:
            self.logger.error("❌ Tests cross-platform échoués")
            return False
        self.stats['steps_completed'] += 1
        
        # Validation PostFlow
        success, output = self.run_command([sys.executable, "validate_postflow.py"])
        if not success:
            self.logger.error("❌ Validation PostFlow échouée")
            return False
        self.stats['steps_completed'] += 1
        
        self.logger.info("✅ Tests pré-déploiement réussis")
        return True
    
    def backup_configuration(self) -> bool:
        """Sauvegarde la configuration actuelle"""
        self.logger.info("💾 Sauvegarde de la configuration...")
        self.stats['steps_total'] += 1
        
        # Créer une sauvegarde Git
        success, _ = self.run_command([
            "git", "stash", "push", "-m", f"backup-deploy-{self.timestamp}"
        ], check=False)
        
        if success:
            self.logger.info("✅ Sauvegarde Git créée")
        else:
            self.logger.warning("⚠️ Aucune modification à sauvegarder")
        
        self.stats['steps_completed'] += 1
        return True
    
    def update_code(self, branch: str = "main") -> bool:
        """Met à jour le code depuis Git"""
        self.logger.info(f"📥 Mise à jour depuis Git (branche: {branch})...")
        self.stats['steps_total'] += 2
        
        # Fetch latest
        success, _ = self.run_command(["git", "fetch", "origin"])
        if not success:
            self.logger.error("❌ Erreur lors du fetch Git")
            return False
        self.stats['steps_completed'] += 1
        
        # Pull changes
        success, _ = self.run_command(["git", "pull", "origin", branch])
        if not success:
            self.logger.error("❌ Erreur lors du pull Git")
            return False
        self.stats['steps_completed'] += 1
        
        self.logger.info("✅ Code mis à jour")
        return True
    
    def install_dependencies(self) -> bool:
        """Installe les dépendances"""
        self.logger.info("📦 Installation des dépendances...")
        self.stats['steps_total'] += 1
        
        requirements_file = self.project_dir / "requirements.txt"
        if requirements_file.exists():
            success, _ = self.run_command([
                sys.executable, "-m", "pip", "install", "-r", "requirements.txt", "--quiet"
            ])
            if not success:
                self.logger.warning("⚠️ Erreur installation dépendances")
                self.stats['warnings'].append("Dépendances non installées")
            else:
                self.logger.info("✅ Dépendances installées")
        else:
            self.logger.warning("⚠️ requirements.txt non trouvé")
            self.stats['warnings'].append("requirements.txt manquant")
        
        self.stats['steps_completed'] += 1
        return True
    
    def migrate_configuration(self) -> bool:
        """Migre la configuration selon la plateforme"""
        self.logger.info("🔄 Migration de la configuration...")
        self.stats['steps_total'] += 1
        
        if self.platform == 'windows':
            # Migration Windows
            success, _ = self.run_command([sys.executable, "migrate_to_windows.py"])
            if not success:
                self.logger.error("❌ Migration Windows échouée")
                return False
        else:
            # Validation cross-platform pour autres plateformes
            success, _ = self.run_command([sys.executable, "validate_postflow.py"])
            if not success:
                self.logger.warning("⚠️ Validation cross-platform échouée")
                self.stats['warnings'].append("Validation cross-platform échouée")
        
        self.logger.info("✅ Configuration migrée")
        self.stats['steps_completed'] += 1
        return True
    
    def run_post_deploy_tests(self) -> bool:
        """Lance les tests post-déploiement"""
        self.logger.info("🧪 Tests post-déploiement...")
        self.stats['steps_total'] += 1
        
        # Test rapide du main.py
        success, _ = self.run_command([sys.executable, "main.py", "--test"], check=False)
        if success:
            self.logger.info("✅ Test système réussi")
        else:
            self.logger.warning("⚠️ Test système échoué (peut être normal)")
            self.stats['warnings'].append("Test système échoué")
        
        self.stats['steps_completed'] += 1
        return True
    
    def cleanup_old_backups(self) -> bool:
        """Nettoie les anciennes sauvegardes"""
        self.logger.info("🧹 Nettoyage des anciennes sauvegardes...")
        self.stats['steps_total'] += 1
        
        # Lister les stashs de sauvegarde
        success, output = self.run_command(["git", "stash", "list"], check=False)
        if success and "backup-deploy" in output:
            lines = output.strip().split('\n')
            backup_lines = [line for line in lines if "backup-deploy" in line]
            
            # Garder seulement les 5 plus récentes
            if len(backup_lines) > 5:
                for i in range(5, len(backup_lines)):
                    stash_id = backup_lines[i].split(':')[0]
                    self.run_command(["git", "stash", "drop", stash_id], check=False)
                
                self.logger.info(f"✅ {len(backup_lines) - 5} anciennes sauvegardes supprimées")
            else:
                self.logger.info("✅ Aucun nettoyage nécessaire")
        
        self.stats['steps_completed'] += 1
        return True
    
    def rollback(self) -> bool:
        """Effectue un rollback en cas d'erreur"""
        self.logger.info("🔄 Rollback en cours...")
        
        # Restaurer la dernière sauvegarde
        success, _ = self.run_command(["git", "stash", "pop"], check=False)
        if success:
            self.logger.info("✅ Rollback réussi")
            return True
        else:
            self.logger.error("❌ Rollback échoué")
            return False
    
    def print_deployment_summary(self):
        """Affiche le résumé du déploiement"""
        duration = datetime.now() - self.stats['start_time']
        
        print("\n" + "="*60)
        print("🚀 RÉSUMÉ DU DÉPLOIEMENT")
        print("="*60)
        print(f"📁 Plateforme: {self.platform.title()}")
        print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"⏱️ Durée: {duration.total_seconds():.2f}s")
        print(f"✅ Étapes réussies: {self.stats['steps_completed']}/{self.stats['steps_total']}")
        
        if self.stats['errors']:
            print(f"❌ Erreurs: {len(self.stats['errors'])}")
            for error in self.stats['errors'][:3]:  # Afficher max 3 erreurs
                print(f"   • {error}")
        
        if self.stats['warnings']:
            print(f"⚠️ Avertissements: {len(self.stats['warnings'])}")
            for warning in self.stats['warnings'][:3]:  # Afficher max 3 warnings
                print(f"   • {warning}")
        
        print("\n🎯 PROCHAINES ÉTAPES:")
        print("1. Vérifier les logs de déploiement")
        print("2. Démarrer PostFlow: python main.py")
        print("3. Accéder au dashboard: http://localhost:8081")
        print("="*60)
    
    def deploy(self, branch: str = "main", skip_tests: bool = False) -> bool:
        """Lance le déploiement complet"""
        self.logger.info(f"🚀 Début du déploiement PostFlow sur {self.platform.title()}")
        
        try:
            # 1. Validation environnement
            if not self.validate_environment():
                return False
            
            # 2. Tests pré-déploiement
            if not skip_tests and not self.run_pre_deploy_tests():
                return False
            
            # 3. Sauvegarde
            if not self.backup_configuration():
                return False
            
            # 4. Mise à jour code
            if not self.update_code(branch):
                self.rollback()
                return False
            
            # 5. Installation dépendances
            if not self.install_dependencies():
                self.rollback()
                return False
            
            # 6. Migration configuration
            if not self.migrate_configuration():
                self.rollback()
                return False
            
            # 7. Tests post-déploiement
            if not skip_tests and not self.run_post_deploy_tests():
                self.logger.warning("⚠️ Tests post-déploiement échoués (continuons)")
            
            # 8. Nettoyage
            self.cleanup_old_backups()
            
            self.logger.info("🎉 Déploiement réussi !")
            return True
            
        except Exception as e:
            self.logger.error(f"💥 Erreur fatale: {e}")
            self.rollback()
            return False
        
        finally:
            self.print_deployment_summary()


def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='Déploiement intelligent PostFlow')
    parser.add_argument('--branch', default='main', help='Branche Git à déployer')
    parser.add_argument('--skip-tests', action='store_true', help='Ignorer les tests')
    parser.add_argument('--project-dir', type=Path, help='Répertoire du projet')
    parser.add_argument('--dry-run', action='store_true', help='Simulation sans modification')
    
    args = parser.parse_args()
    
    if args.dry_run:
        print("🎭 Mode simulation - Aucune modification ne sera effectuée")
        return 0
    
    # Initialiser le déployeur
    deployer = PostFlowDeployer(args.project_dir)
    
    # Lancer le déploiement
    success = deployer.deploy(args.branch, args.skip_tests)
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
