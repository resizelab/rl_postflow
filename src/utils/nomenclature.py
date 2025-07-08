"""
Gestionnaire de nomenclature pour RL PostFlow
Gère les patterns de nommage des fichiers et leur validation
"""

import re
import json
from pathlib import Path
from typing import Dict, Any, Optional, List, NamedTuple
import logging

logger = logging.getLogger(__name__)


class FileInfo(NamedTuple):
    """Informations extraites d'un nom de fichier"""
    project: str
    sequence: Optional[str]
    shot: str
    version: str
    extension: str
    original_name: str
    valid: bool
    pattern_used: str


class NomenclatureManager:
    """
    Gestionnaire de nomenclature pour les fichiers vidéo
    """
    
    def __init__(self, config_path: Optional[Path] = None):
        """
        Initialise le gestionnaire de nomenclature
        
        Args:
            config_path: Chemin vers le fichier de configuration de nomenclature
        """
        self.config_path = config_path or Path(__file__).parent.parent.parent / "config" / "nomenclature.json"
        self.config = {}
        self.patterns = {}
        self.active_pattern = None
        
        self._load_config()
    
    def _load_config(self):
        """Charge la configuration de nomenclature"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
                
                file_naming = self.config.get('file_naming', {})
                self.patterns = file_naming.get('patterns', {})
                active_pattern_name = file_naming.get('active_pattern', 'current')
                
                if active_pattern_name in self.patterns:
                    self.active_pattern = self.patterns[active_pattern_name]
                    logger.info(f"✅ Nomenclature chargée: {self.active_pattern['name']}")
                else:
                    logger.warning(f"⚠️ Pattern actif '{active_pattern_name}' non trouvé")
                    self._create_default_pattern()
            else:
                logger.warning(f"⚠️ Fichier de nomenclature non trouvé: {self.config_path}")
                self._create_default_pattern()
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement de la nomenclature: {e}")
            self._create_default_pattern()
    
    def _create_default_pattern(self):
        """Crée un pattern par défaut si aucun n'est configuré"""
        self.active_pattern = {
            "name": "UNDLM Standard (défaut)",
            "description": "Format standard UNDLM avec shot et version",
            "regex": r"^UNDLM_(?P<shot>\d{5})_v(?P<version>\d{3})\.(?P<ext>mov|mp4|avi|mkv)$",
            "format": "UNDLM_{shot:05d}_v{version:03d}.{ext}",
            "components": {
                "project": "UNDLM",
                "shot": "5 digits (00001-99999)",
                "version": "3 digits (001-999)",
                "extensions": [".mov", ".mp4", ".avi", ".mkv"]
            }
        }
        logger.info("✅ Pattern par défaut créé")
    
    def parse_filename(self, filename: str) -> FileInfo:
        """
        Parse un nom de fichier selon le pattern actif
        
        Args:
            filename: Nom du fichier à parser
            
        Returns:
            FileInfo: Informations extraites du fichier
        """
        if not self.active_pattern:
            return FileInfo(
                project="", sequence=None, shot="", version="", extension="",
                original_name=filename, valid=False, pattern_used="none"
            )
        
        try:
            # Extraire le nom de fichier sans le chemin
            file_name = Path(filename).name
            
            # Appliquer le regex du pattern actif
            regex_pattern = self.active_pattern.get('regex', '')
            match = re.match(regex_pattern, file_name, re.IGNORECASE)
            
            if match:
                groups = match.groupdict()
                
                return FileInfo(
                    project=groups.get('project', self.active_pattern.get('components', {}).get('project', '')),
                    sequence=groups.get('sequence'),
                    shot=groups.get('shot', ''),
                    version=groups.get('version', ''),
                    extension=groups.get('ext', ''),
                    original_name=filename,
                    valid=True,
                    pattern_used=self.active_pattern['name']
                )
            else:
                logger.warning(f"⚠️ Nom de fichier non conforme: {file_name}")
                return FileInfo(
                    project="", sequence=None, shot="", version="", extension="",
                    original_name=filename, valid=False, pattern_used=self.active_pattern['name']
                )
                
        except Exception as e:
            logger.error(f"❌ Erreur lors du parsing de {filename}: {e}")
            return FileInfo(
                project="", sequence=None, shot="", version="", extension="",
                original_name=filename, valid=False, pattern_used="error"
            )
    
    def validate_filename(self, filename: str) -> bool:
        """
        Valide un nom de fichier selon le pattern actif
        
        Args:
            filename: Nom du fichier à valider
            
        Returns:
            bool: True si valide, False sinon
        """
        file_info = self.parse_filename(filename)
        return file_info.valid
    
    def get_frameio_folder_name(self, file_info: FileInfo) -> str:
        """
        Génère le nom de dossier Frame.io selon la configuration
        
        Args:
            file_info: Informations du fichier
            
        Returns:
            str: Nom du dossier Frame.io
        """
        if not file_info.valid:
            return "Unknown"
        
        frameio_config = self.config.get('file_naming', {}).get('frameio_mapping', {})
        folder_structure = frameio_config.get('folder_structure', {})
        
        if folder_structure.get('use_sequence', False) and file_info.sequence:
            # Nouvelle structure : WIP_BYSHOT/SC01_SEQ_INTRO/UNDLM_00001/
            sequence_mapping = frameio_config.get('sequence_mapping', {})
            default_sequences = sequence_mapping.get('default_sequences', {})
            
            # Trouver les infos de séquence
            sequence_info = default_sequences.get(file_info.sequence)
            if sequence_info:
                sequence_number = sequence_info.get('number', 1)
                sequence_name = sequence_info.get('name', f'SEQ_{file_info.sequence}')
            else:
                # Fallback
                fallback = sequence_mapping.get('fallback_sequence', {'number': 1, 'name': 'SEQ_GENERAL'})
                sequence_number = fallback.get('number', 1)
                sequence_name = fallback.get('name', f'SEQ_{file_info.sequence}')
            
            # Construire le nom du dossier séquence
            sequence_template = folder_structure.get('sequence_template', 'SC{sequence_number:02d}_{sequence_name}')
            sequence_folder = sequence_template.format(
                sequence_number=sequence_number,
                sequence_name=sequence_name
            )
            
            return sequence_folder
        else:
            # Structure sans séquence (fallback)
            if folder_structure.get('use_shot_folders', True):
                template = folder_structure.get('template', 'Shot_{shot:05d}')
                try:
                    return template.format(shot=int(file_info.shot))
                except (ValueError, KeyError):
                    return f"Shot_{file_info.shot}"
            else:
                return "Assets"
    
    def get_frameio_shot_folder_name(self, file_info: FileInfo) -> str:
        """
        Génère le nom de dossier shot pour Frame.io
        
        Args:
            file_info: Informations du fichier
            
        Returns:
            str: Nom du dossier shot (ex: UNDLM_00001)
        """
        if not file_info.valid:
            return "Unknown"
        
        frameio_config = self.config.get('file_naming', {}).get('frameio_mapping', {})
        folder_structure = frameio_config.get('folder_structure', {})
        
        shot_template = folder_structure.get('shot_template', '{project}_{shot:05d}')
        
        try:
            return shot_template.format(
                project=file_info.project,
                shot=int(file_info.shot)
            )
        except (ValueError, KeyError):
            return f"{file_info.project}_{file_info.shot}"
    
    def get_active_pattern_info(self) -> Dict[str, Any]:
        """
        Retourne les informations du pattern actif
        
        Returns:
            Dict: Informations du pattern actif
        """
        return self.active_pattern or {}
    
    def list_available_patterns(self) -> List[str]:
        """
        Liste les patterns disponibles
        
        Returns:
            List[str]: Noms des patterns disponibles
        """
        return list(self.patterns.keys())
    
    def switch_pattern(self, pattern_name: str) -> bool:
        """
        Change le pattern actif
        
        Args:
            pattern_name: Nom du pattern à activer
            
        Returns:
            bool: True si le changement a réussi
        """
        if pattern_name in self.patterns:
            self.active_pattern = self.patterns[pattern_name]
            logger.info(f"✅ Pattern changé vers: {self.active_pattern['name']}")
            return True
        else:
            logger.error(f"❌ Pattern '{pattern_name}' non trouvé")
            return False
    
    def get_examples(self) -> List[str]:
        """
        Retourne des exemples de noms de fichiers valides
        
        Returns:
            List[str]: Exemples de noms de fichiers
        """
        if self.active_pattern:
            return self.active_pattern.get('examples', [])
        return []


# Instance globale pour faciliter l'utilisation
_nomenclature_manager = None


def get_nomenclature_manager() -> NomenclatureManager:
    """
    Retourne l'instance globale du gestionnaire de nomenclature
    
    Returns:
        NomenclatureManager: Instance du gestionnaire
    """
    global _nomenclature_manager
    if _nomenclature_manager is None:
        _nomenclature_manager = NomenclatureManager()
    return _nomenclature_manager


def parse_filename(filename: str) -> FileInfo:
    """
    Parse un nom de fichier (fonction de convenance)
    
    Args:
        filename: Nom du fichier à parser
        
    Returns:
        FileInfo: Informations extraites du fichier
    """
    return get_nomenclature_manager().parse_filename(filename)


def validate_filename(filename: str) -> bool:
    """
    Valide un nom de fichier (fonction de convenance)
    
    Args:
        filename: Nom du fichier à valider
        
    Returns:
        bool: True si valide, False sinon
    """
    return get_nomenclature_manager().validate_filename(filename)
