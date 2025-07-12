"""
🎬 RL PostFlow - Cross-Platform Path Manager
===========================================

Gestionnaire de chemins multi-plateforme pour LucidLink
Supporte macOS (/Volumes/) et Windows (E:\Volumes\)

Version: 4.1.1
Date: 12 juillet 2025
"""

import os
import platform
import logging
from pathlib import Path, PurePath, PurePosixPath, PureWindowsPath
from typing import Dict, List, Optional, Tuple, Union

logger = logging.getLogger(__name__)


class CrossPlatformPathManager:
    """
    Gestionnaire de chemins multi-plateforme pour LucidLink
    Convertit automatiquement les chemins entre macOS et Windows
    """
    
    def __init__(self):
        self.current_os = platform.system().lower()
        self.is_windows = self.current_os == 'windows'
        self.is_macos = self.current_os == 'darwin'
        self.is_linux = self.current_os == 'linux'
        
        # Configuration des chemins base selon l'OS
        self.base_paths = self._detect_base_paths()
        
        logger.info(f"🖥️ Plateforme détectée: {self.current_os}")
        logger.info(f"📁 Chemins de base détectés: {self.base_paths}")
    
    def _detect_base_paths(self) -> Dict[str, str]:
        """Détecte les chemins de base selon la plateforme"""
        paths = {}
        
        if self.is_windows:
            # Chemins Windows typiques pour LucidLink
            windows_candidates = [
                "E:\\Volumes\\resizelab\\o2b-undllm",
                "D:\\Volumes\\resizelab\\o2b-undllm", 
                "C:\\Volumes\\resizelab\\o2b-undllm",
                "E:\\resizelab\\o2b-undllm",
                "D:\\resizelab\\o2b-undllm"
            ]
            
            for candidate in windows_candidates:
                if os.path.exists(candidate):
                    paths['lucidlink_base'] = candidate
                    logger.info(f"✅ Chemin LucidLink Windows trouvé: {candidate}")
                    break
            else:
                # Chemin par défaut même s'il n'existe pas encore
                paths['lucidlink_base'] = "E:\\Volumes\\resizelab\\o2b-undllm"
                logger.warning(f"⚠️ Aucun chemin LucidLink trouvé, utilisation du défaut: {paths['lucidlink_base']}")
        
        elif self.is_macos:
            # Chemins macOS typiques pour LucidLink
            macos_candidates = [
                "/Volumes/resizelab/o2b-undllm",
                "/Volumes/LucidLink/resizelab/o2b-undllm",
                "/Volumes/resizelab",
                "/Users/Shared/LucidLink/resizelab/o2b-undllm"
            ]
            
            for candidate in macos_candidates:
                if os.path.exists(candidate):
                    paths['lucidlink_base'] = candidate
                    logger.info(f"✅ Chemin LucidLink macOS trouvé: {candidate}")
                    break
            else:
                # Chemin par défaut même s'il n'existe pas encore
                paths['lucidlink_base'] = "/Volumes/resizelab/o2b-undllm"
                logger.warning(f"⚠️ Aucun chemin LucidLink trouvé, utilisation du défaut: {paths['lucidlink_base']}")
        
        elif self.is_linux:
            # Chemins Linux typiques pour LucidLink
            linux_candidates = [
                "/mnt/lucidlink/resizelab/o2b-undllm",
                "/media/lucidlink/resizelab/o2b-undllm",
                "/home/shared/lucidlink/resizelab/o2b-undllm"
            ]
            
            for candidate in linux_candidates:
                if os.path.exists(candidate):
                    paths['lucidlink_base'] = candidate
                    logger.info(f"✅ Chemin LucidLink Linux trouvé: {candidate}")
                    break
            else:
                # Chemin par défaut
                paths['lucidlink_base'] = "/mnt/lucidlink/resizelab/o2b-undllm"
                logger.warning(f"⚠️ Aucun chemin LucidLink trouvé, utilisation du défaut: {paths['lucidlink_base']}")
        
        return paths
    
    def normalize_path(self, path: Union[str, Path]) -> Path:
        """
        Normalise un chemin pour la plateforme actuelle
        """
        if isinstance(path, str):
            path_str = path
        else:
            path_str = str(path)
        
        # Convertir les séparateurs selon l'OS
        if self.is_windows:
            # Convertir les slashes Unix vers Windows
            path_str = path_str.replace('/', '\\')
            
            # Convertir les chemins macOS vers Windows
            if path_str.startswith('/Volumes/resizelab'):
                path_str = path_str.replace('/Volumes/resizelab', 'E:\\Volumes\\resizelab')
            elif path_str.startswith('/Volumes/'):
                path_str = path_str.replace('/Volumes/', 'E:\\Volumes\\')
        
        elif self.is_macos or self.is_linux:
            # Convertir les backslashes Windows vers Unix
            path_str = path_str.replace('\\', '/')
            
            # Convertir les chemins Windows vers macOS/Linux
            if self.is_macos:
                if path_str.startswith('E:\\Volumes\\resizelab') or path_str.startswith('E:/Volumes/resizelab'):
                    path_str = path_str.replace('E:\\Volumes\\resizelab', '/Volumes/resizelab')
                    path_str = path_str.replace('E:/Volumes/resizelab', '/Volumes/resizelab')
                elif path_str.startswith('E:\\Volumes\\') or path_str.startswith('E:/Volumes/'):
                    path_str = path_str.replace('E:\\Volumes\\', '/Volumes/')
                    path_str = path_str.replace('E:/Volumes/', '/Volumes/')
            elif self.is_linux:
                if path_str.startswith('E:\\Volumes\\resizelab') or path_str.startswith('E:/Volumes/resizelab'):
                    path_str = path_str.replace('E:\\Volumes\\resizelab', '/mnt/lucidlink/resizelab')
                    path_str = path_str.replace('E:/Volumes/resizelab', '/mnt/lucidlink/resizelab')
        
        return Path(path_str)
    
    def get_lucidlink_base_path(self) -> Path:
        """Retourne le chemin de base LucidLink pour la plateforme actuelle"""
        base_path = self.base_paths.get('lucidlink_base')
        if not base_path:
            raise ValueError("Aucun chemin LucidLink configuré")
        
        return self.normalize_path(base_path)
    
    def build_lucidlink_path(self, *sub_paths: str) -> Path:
        """
        Construit un chemin LucidLink en ajoutant des sous-dossiers au chemin de base
        """
        base = self.get_lucidlink_base_path()
        
        for sub_path in sub_paths:
            base = base / sub_path
        
        return base
    
    def convert_path_for_os(self, path: Union[str, Path], target_os: str) -> str:
        """
        Convertit un chemin pour un OS spécifique
        target_os: 'windows', 'macos', 'linux'
        """
        path_str = str(path)
        
        if target_os.lower() == 'windows':
            # Convertir vers Windows
            path_str = path_str.replace('/', '\\')
            if path_str.startswith('\\Volumes\\resizelab'):
                path_str = path_str.replace('\\Volumes\\resizelab', 'E:\\Volumes\\resizelab')
            elif path_str.startswith('/Volumes/resizelab'):
                path_str = path_str.replace('/Volumes/resizelab', 'E:\\Volumes\\resizelab')
            elif path_str.startswith('/mnt/lucidlink/resizelab'):
                path_str = path_str.replace('/mnt/lucidlink/resizelab', 'E:\\Volumes\\resizelab')
        
        elif target_os.lower() == 'macos':
            # Convertir vers macOS
            path_str = path_str.replace('\\', '/')
            if path_str.startswith('E:\\Volumes\\resizelab') or path_str.startswith('E:/Volumes/resizelab'):
                path_str = path_str.replace('E:\\Volumes\\resizelab', '/Volumes/resizelab')
                path_str = path_str.replace('E:/Volumes/resizelab', '/Volumes/resizelab')
            elif path_str.startswith('/mnt/lucidlink/resizelab'):
                path_str = path_str.replace('/mnt/lucidlink/resizelab', '/Volumes/resizelab')
        
        elif target_os.lower() == 'linux':
            # Convertir vers Linux
            path_str = path_str.replace('\\', '/')
            if path_str.startswith('E:\\Volumes\\resizelab') or path_str.startswith('E:/Volumes/resizelab'):
                path_str = path_str.replace('E:\\Volumes\\resizelab', '/mnt/lucidlink/resizelab')
                path_str = path_str.replace('E:/Volumes/resizelab', '/mnt/lucidlink/resizelab')
            elif path_str.startswith('/Volumes/resizelab'):
                path_str = path_str.replace('/Volumes/resizelab', '/mnt/lucidlink/resizelab')
        
        return path_str
    
    def validate_lucidlink_path(self, path: Union[str, Path]) -> Tuple[bool, Optional[str]]:
        """
        Valide qu'un chemin pointe vers LucidLink
        Retourne (is_valid, normalized_path)
        """
        try:
            normalized = self.normalize_path(path)
            lucidlink_base = self.get_lucidlink_base_path()
            
            # Vérifier que le chemin est sous la base LucidLink
            try:
                normalized.relative_to(lucidlink_base)
                return True, str(normalized)
            except ValueError:
                # Le chemin n'est pas sous la base LucidLink
                return False, None
                
        except Exception as e:
            logger.error(f"Erreur validation chemin LucidLink: {e}")
            return False, None
    
    def get_platform_info(self) -> Dict[str, str]:
        """Retourne les informations de plateforme"""
        return {
            'os': self.current_os,
            'platform': platform.platform(),
            'machine': platform.machine(),
            'lucidlink_base': self.base_paths.get('lucidlink_base', 'Non configuré'),
            'is_windows': self.is_windows,
            'is_macos': self.is_macos,
            'is_linux': self.is_linux
        }
    
    def update_config_paths(self, config: Dict) -> Dict:
        """
        Met à jour les chemins dans une configuration pour la plateforme actuelle
        """
        updated_config = config.copy()
        
        # Mettre à jour les chemins LucidLink
        if 'lucidlink' in updated_config:
            lucidlink_config = updated_config['lucidlink']
            
            # Mettre à jour le chemin de base
            if 'base_path' in lucidlink_config:
                old_path = lucidlink_config['base_path']
                new_path = str(self.get_lucidlink_base_path())
                lucidlink_config['base_path'] = new_path
                logger.info(f"🔄 Chemin base LucidLink mis à jour: {old_path} → {new_path}")
            
            # Mettre à jour le répertoire de surveillance
            if 'watch_directory' in lucidlink_config:
                old_watch = lucidlink_config['watch_directory']
                new_watch = str(self.get_lucidlink_base_path())
                lucidlink_config['watch_directory'] = new_watch
                logger.info(f"🔄 Répertoire surveillance mis à jour: {old_watch} → {new_watch}")
        
        return updated_config


# Instance globale du gestionnaire de chemins
path_manager = CrossPlatformPathManager()


def get_platform_path_manager() -> CrossPlatformPathManager:
    """Retourne l'instance globale du gestionnaire de chemins"""
    return path_manager


def normalize_lucidlink_path(path: Union[str, Path]) -> Path:
    """Fonction utilitaire pour normaliser un chemin LucidLink"""
    return path_manager.normalize_path(path)


def get_lucidlink_base() -> Path:
    """Fonction utilitaire pour obtenir le chemin de base LucidLink"""
    return path_manager.get_lucidlink_base_path()


def is_windows_platform() -> bool:
    """Fonction utilitaire pour vérifier si on est sur Windows"""
    return path_manager.is_windows


def is_macos_platform() -> bool:
    """Fonction utilitaire pour vérifier si on est sur macOS"""
    return path_manager.is_macos


def validate_config_for_platform(config: Dict) -> Dict:
    """Fonction utilitaire pour valider et corriger une config selon la plateforme"""
    return path_manager.update_config_paths(config)


if __name__ == "__main__":
    # Test du module
    print("🧪 Test du CrossPlatformPathManager")
    print("=" * 50)
    
    manager = CrossPlatformPathManager()
    info = manager.get_platform_info()
    
    print(f"Plateforme: {info['os']}")
    print(f"Base LucidLink: {info['lucidlink_base']}")
    print(f"Chemin normalisé: {manager.get_lucidlink_base_path()}")
    
    # Test de conversion
    test_paths = [
        "/Volumes/resizelab/o2b-undllm/test.mov",
        "E:\\Volumes\\resizelab\\o2b-undllm\\test.mov",
        "/mnt/lucidlink/resizelab/o2b-undllm/test.mov"
    ]
    
    print("\n🔄 Test de conversion de chemins:")
    for test_path in test_paths:
        normalized = manager.normalize_path(test_path)
        print(f"  {test_path} → {normalized}")
    
    print("\n✅ Tests terminés")
