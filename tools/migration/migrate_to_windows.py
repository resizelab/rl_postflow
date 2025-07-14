#!/usr/bin/env python3
"""
­ƒÄ¼ RL PostFlow - Migration Script pour Windows
=============================================

Script de migration pour adapter les configurations existantes ├á Windows
- Conversion automatique des chemins macOS vers Windows
- Mise ├á jour des fichiers de configuration
- Validation des nouveaux chemins

Version: 4.1.1
Date: 12 juillet 2025
"""

import json
import logging
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Ajouter le r├®pertoire src au path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.utils.cross_platform_paths import CrossPlatformPathManager, get_platform_path_manager

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PostFlowMigrator:
    """Migrateur de configuration PostFlow pour Windows"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.config_dir = project_root / "config"
        self.backup_dir = project_root / "backups" / f"migration_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Gestionnaire de chemins multi-plateforme
        self.path_manager = get_platform_path_manager()
        
        # Fichiers de configuration ├á migrer
        self.config_files = [
            "integrations.json",
            "pipeline_config.json",
            "production_config.json"
        ]
    
    def create_backup(self) -> bool:
        """Cr├®er une sauvegarde des configurations actuelles"""
        try:
            logger.info(f"­ƒôª Cr├®ation sauvegarde dans: {self.backup_dir}")
            self.backup_dir.mkdir(parents=True, exist_ok=True)
            
            for config_file in self.config_files:
                source_file = self.config_dir / config_file
                if source_file.exists():
                    backup_file = self.backup_dir / config_file
                    shutil.copy2(source_file, backup_file)
                    logger.info(f"Ô£à Sauvegard├®: {config_file}")
                else:
                    logger.warning(f"ÔÜá´©Å Fichier non trouv├®: {config_file}")
            
            return True
            
        except Exception as e:
            logger.error(f"ÔØî Erreur lors de la sauvegarde: {e}")
            return False
    
    def migrate_config_file(self, config_file: str) -> bool:
        """Migrer un fichier de configuration sp├®cifique"""
        try:
            config_path = self.config_dir / config_file
            
            if not config_path.exists():
                logger.warning(f"ÔÜá´©Å Fichier non trouv├®: {config_file}")
                return False
            
            logger.info(f"­ƒöä Migration de: {config_file}")
            
            # Charger la configuration
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Migrer la configuration
            migrated_config = self._migrate_config_dict(config)
            
            # Sauvegarder la configuration migr├®e
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(migrated_config, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Ô£à {config_file} migr├® avec succ├¿s")
            return True
            
        except Exception as e:
            logger.error(f"ÔØî Erreur migration {config_file}: {e}")
            return False
    
    def _migrate_config_dict(self, config: Dict) -> Dict:
        """Migrer un dictionnaire de configuration"""
        migrated_config = config.copy()
        
        # Migrer les chemins LucidLink
        if 'lucidlink' in migrated_config:
            lucidlink_config = migrated_config['lucidlink']
            
            # Migrer le chemin de base
            if 'base_path' in lucidlink_config:
                old_path = lucidlink_config['base_path']
                new_path = str(self.path_manager.get_lucidlink_base_path())
                lucidlink_config['base_path'] = new_path
                logger.info(f"  ­ƒôü base_path: {old_path} ÔåÆ {new_path}")
            
            # Migrer le r├®pertoire de surveillance
            if 'watch_directory' in lucidlink_config:
                old_watch = lucidlink_config['watch_directory']
                new_watch = str(self.path_manager.get_lucidlink_base_path())
                lucidlink_config['watch_directory'] = new_watch
                logger.info(f"  ­ƒæü´©Å watch_directory: {old_watch} ÔåÆ {new_watch}")
        
        # Migrer d'autres chemins potentiels
        self._migrate_paths_recursive(migrated_config)
        
        return migrated_config
    
    def _migrate_paths_recursive(self, obj, parent_key: str = ""):
        """Migrer r├®cursivement les chemins dans un objet"""
        if isinstance(obj, dict):
            for key, value in obj.items():
                full_key = f"{parent_key}.{key}" if parent_key else key
                
                # V├®rifier si c'est un chemin ├á migrer
                if isinstance(value, str) and self._is_path_to_migrate(value):
                    old_path = value
                    new_path = self.path_manager.normalize_path(value)
                    obj[key] = str(new_path)
                    logger.info(f"  ­ƒöä {full_key}: {old_path} ÔåÆ {new_path}")
                elif isinstance(value, (dict, list)):
                    self._migrate_paths_recursive(value, full_key)
        
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                if isinstance(item, str) and self._is_path_to_migrate(item):
                    old_path = item
                    new_path = self.path_manager.normalize_path(item)
                    obj[i] = str(new_path)
                    logger.info(f"  ­ƒöä {parent_key}[{i}]: {old_path} ÔåÆ {new_path}")
                elif isinstance(item, (dict, list)):
                    self._migrate_paths_recursive(item, f"{parent_key}[{i}]")
    
    def _is_path_to_migrate(self, value: str) -> bool:
        """D├®termine si une cha├«ne est un chemin ├á migrer"""
        # V├®rifier si c'est un chemin qui ressemble ├á LucidLink
        return (
            isinstance(value, str) and (
                value.startswith('/Volumes/') or
                value.startswith('E:\\Volumes\\') or
                value.startswith('/mnt/lucidlink') or
                'resizelab' in value.lower() or
                'lucidlink' in value.lower()
            )
        )
    
    def validate_migration(self) -> bool:
        """Valider que la migration s'est bien pass├®e"""
        try:
            logger.info("­ƒöì Validation de la migration...")
            
            all_valid = True
            
            for config_file in self.config_files:
                config_path = self.config_dir / config_file
                
                if not config_path.exists():
                    continue
                
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                # V├®rifier les chemins LucidLink
                if 'lucidlink' in config:
                    lucidlink_config = config['lucidlink']
                    
                    if 'base_path' in lucidlink_config:
                        base_path = Path(lucidlink_config['base_path'])
                        is_valid, _ = self.path_manager.validate_lucidlink_path(base_path)
                        
                        if is_valid:
                            logger.info(f"  Ô£à {config_file}: base_path valide")
                        else:
                            logger.error(f"  ÔØî {config_file}: base_path invalide: {base_path}")
                            all_valid = False
            
            return all_valid
            
        except Exception as e:
            logger.error(f"ÔØî Erreur validation: {e}")
            return False
    
    def run_migration(self) -> bool:
        """Ex├®cuter la migration compl├¿te"""
        try:
            logger.info("­ƒÜÇ D├®but de la migration PostFlow pour Windows")
            logger.info(f"­ƒûÑ´©Å Plateforme: {self.path_manager.current_os}")
            logger.info(f"­ƒôü Nouveau chemin LucidLink: {self.path_manager.get_lucidlink_base_path()}")
            
            # ├ëtape 1: Cr├®er une sauvegarde
            if not self.create_backup():
                logger.error("ÔØî ├ëchec de la sauvegarde, arr├¬t de la migration")
                return False
            
            # ├ëtape 2: Migrer chaque fichier de configuration
            migration_success = True
            for config_file in self.config_files:
                if not self.migrate_config_file(config_file):
                    migration_success = False
            
            # ├ëtape 3: Valider la migration
            if migration_success:
                if self.validate_migration():
                    logger.info("Ô£à Migration termin├®e avec succ├¿s!")
                    logger.info(f"­ƒôª Sauvegarde disponible dans: {self.backup_dir}")
                    return True
                else:
                    logger.error("ÔØî Validation de la migration ├®chou├®e")
                    return False
            else:
                logger.error("ÔØî Erreurs lors de la migration")
                return False
            
        except Exception as e:
            logger.error(f"ÔØî Erreur fatale lors de la migration: {e}")
            return False
    
    def restore_backup(self) -> bool:
        """Restaurer depuis la derni├¿re sauvegarde"""
        try:
            if not self.backup_dir.exists():
                logger.error("ÔØî Aucune sauvegarde trouv├®e")
                return False
            
            logger.info(f"­ƒöä Restauration depuis: {self.backup_dir}")
            
            for config_file in self.config_files:
                backup_file = self.backup_dir / config_file
                target_file = self.config_dir / config_file
                
                if backup_file.exists():
                    shutil.copy2(backup_file, target_file)
                    logger.info(f"Ô£à Restaur├®: {config_file}")
            
            logger.info("Ô£à Restauration termin├®e")
            return True
            
        except Exception as e:
            logger.error(f"ÔØî Erreur lors de la restauration: {e}")
            return False


def main():
    """Fonction principale"""
    project_root = Path(__file__).parent
    migrator = PostFlowMigrator(project_root)
    
    # Afficher les informations de plateforme
    platform_info = migrator.path_manager.get_platform_info()
    
    print("­ƒÄ¼ RL PostFlow - Migration Windows")
    print("=" * 50)
    print(f"Plateforme: {platform_info['os']}")
    print(f"Chemin LucidLink actuel: {platform_info['lucidlink_base']}")
    print(f"Windows: {'Ô£à' if platform_info['is_windows'] else 'ÔØî'}")
    print(f"macOS: {'Ô£à' if platform_info['is_macos'] else 'ÔØî'}")
    print("=" * 50)
    
    # Demander confirmation si on est sur Windows
    if migrator.path_manager.is_windows:
        response = input("\n­ƒöä Lancer la migration pour Windows? (y/N): ").strip().lower()
        if response != 'y':
            print("­ƒøæ Migration annul├®e")
            return
        
        # Lancer la migration
        success = migrator.run_migration()
        
        if success:
            print("\nÔ£à Migration termin├®e avec succ├¿s!")
            print("­ƒÄ» PostFlow est maintenant compatible Windows")
        else:
            print("\nÔØî ├ëchec de la migration")
            
            restore = input("­ƒöä Restaurer la sauvegarde? (y/N): ").strip().lower()
            if restore == 'y':
                migrator.restore_backup()
    else:
        print("\nÔÜá´©Å Cette machine ne semble pas ├¬tre sous Windows")
        print("­ƒöì V├®rification des configurations existantes...")
        
        # Juste valider les configs existantes
        if migrator.validate_migration():
            print("Ô£à Configurations actuelles valides pour cette plateforme")
        else:
            print("ÔÜá´©Å Configurations n├®cessitent une mise ├á jour")


if __name__ == "__main__":
    main()
