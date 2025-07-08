"""
Frame.io Parser Module
Extraction des métadonnées depuis les noms de fichiers selon la nomenclature du projet
"""

import re
from typing import Dict, Optional, NamedTuple
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class FileMetadata(NamedTuple):
    """Métadonnées extraites d'un nom de fichier"""
    shot_id: str
    scene_name: str
    version: str
    nomenclature: str
    file_extension: str
    description: Optional[str] = None
    tags: Optional[list] = None

class FrameIOFileParser:
    """Parser pour extraire les métadonnées des fichiers selon la nomenclature du projet"""
    
    def __init__(self):
        """Initialize le parser avec les patterns de reconnaissance"""
        # Pattern principal pour la nomenclature standard
        # Format attendu: SCENE_SHOT_VERSION.ext
        # Exemple: "13H49_-_RECUPERATION_DES_2_SURVIVANTS_S01_V001.mov"
        self.main_pattern = re.compile(
            r'^(?P<scene_name>.*?)_S(?P<shot_number>\d+)_V(?P<version>\d+)\.(?P<extension>\w+)$',
            re.IGNORECASE
        )
        
        # Pattern pour format court: SC01_UNDLM_00412_V002.mov
        self.short_pattern = re.compile(
            r'^(?P<scene_name>SC\d+)_(?P<shot_code>[A-Z0-9_]+)_V(?P<version>\d+)\.(?P<extension>\w+)$',
            re.IGNORECASE
        )
        
        # Pattern pour format générique: SCENE_SHOT_001_V003.ext
        self.generic_pattern = re.compile(
            r'^(?P<scene_name>SCENE_\d+)_(?P<shot_code>SHOT_\d+)_V(?P<version>\d+)\.(?P<extension>\w+)$',
            re.IGNORECASE
        )
        
        # Pattern alternatif pour les formats legacy
        # Format: SCENE_SHOT.VERSION.ext
        self.legacy_pattern = re.compile(
            r'^(?P<scene_name>.*?)_(?P<shot_number>\d+)\.(?P<version>\d+)\.(?P<extension>\w+)$',
            re.IGNORECASE
        )
        
        # Pattern pour les noms de scènes complexes
        # Nettoie les caractères spéciaux et normalise
        self.scene_cleanup_pattern = re.compile(r'[_\-\s]+')
        
        # Extensions vidéo supportées
        self.video_extensions = {
            'mov', 'mp4', 'avi', 'mkv', 'mxf', 'prores', 'dnxhd', 'r3d', 'braw'
        }
    
    def parse_filename(self, filename: str) -> Optional[FileMetadata]:
        """
        Parse un nom de fichier pour extraire les métadonnées.
        
        Args:
            filename: Nom du fichier à parser
            
        Returns:
            FileMetadata ou None si le parsing échoue
        """
        try:
            # Nettoyer le nom de fichier
            clean_filename = Path(filename).name
            
            # Essayer les différents patterns
            match = self.main_pattern.match(clean_filename)
            pattern_type = "main"
            
            if not match:
                match = self.short_pattern.match(clean_filename)
                pattern_type = "short"
            
            if not match:
                match = self.generic_pattern.match(clean_filename)
                pattern_type = "generic"
            
            if not match:
                match = self.legacy_pattern.match(clean_filename)
                pattern_type = "legacy"
            
            if not match:
                logger.warning(f"Nom de fichier non reconnu: {filename}")
                return None
            
            # Extraire les composants selon le pattern
            if pattern_type == "main":
                scene_raw = match.group('scene_name')
                shot_number = match.group('shot_number')
                version = match.group('version')
                extension = match.group('extension').lower()
                shot_id = f"S{shot_number.zfill(2)}"
                
            elif pattern_type == "short":
                scene_raw = match.group('scene_name')
                shot_code = match.group('shot_code')
                version = match.group('version')
                extension = match.group('extension').lower()
                shot_id = shot_code
                
            elif pattern_type == "generic":
                scene_raw = match.group('scene_name')
                shot_code = match.group('shot_code')
                version = match.group('version')
                extension = match.group('extension').lower()
                shot_id = shot_code
                
            elif pattern_type == "legacy":
                scene_raw = match.group('scene_name')
                shot_number = match.group('shot_number')
                version = match.group('version')
                extension = match.group('extension').lower()
                shot_id = f"S{shot_number.zfill(2)}"
            
            # Nettoyer et normaliser le nom de scène
            scene_name = self._clean_scene_name(scene_raw)
            
            # Construire la nomenclature complète
            nomenclature = f"{scene_name}_{shot_id}_V{version.zfill(3)}"
            
            # Vérifier si c'est une extension vidéo supportée
            if extension not in self.video_extensions:
                logger.warning(f"Extension non supportée: {extension}")
                return None
            
            # Générer des tags basés sur l'extension
            tags = self._generate_tags(extension, scene_name)
            
            # Générer une description
            description = self._generate_description(scene_name, shot_id, version)
            
            metadata = FileMetadata(
                shot_id=shot_id,
                scene_name=scene_name,
                version=f"V{version.zfill(3)}",
                nomenclature=nomenclature,
                file_extension=extension,
                description=description,
                tags=tags
            )
            
            logger.info(f"✅ Fichier parsé: {filename} → {metadata.nomenclature}")
            return metadata
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du parsing de {filename}: {e}")
            return None
    
    def _clean_scene_name(self, scene_raw: str) -> str:
        """
        Nettoie et normalise le nom de scène.
        
        Args:
            scene_raw: Nom de scène brut
            
        Returns:
            Nom de scène nettoyé
        """
        # Remplacer les séparateurs multiples par un seul
        cleaned = self.scene_cleanup_pattern.sub('_', scene_raw)
        
        # Supprimer les underscores en début et fin
        cleaned = cleaned.strip('_')
        
        # Convertir en majuscules pour uniformité
        cleaned = cleaned.upper()
        
        # Remplacer les caractères spéciaux problématiques
        replacements = {
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
            'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
            'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
            'Ý': 'Y', 'Ÿ': 'Y',
            'Ç': 'C', 'Ñ': 'N'
        }
        
        for old, new in replacements.items():
            cleaned = cleaned.replace(old, new)
        
        return cleaned
    
    def _generate_tags(self, extension: str, scene_name: str) -> list:
        """
        Génère des tags basés sur l'extension et le nom de scène.
        
        Args:
            extension: Extension du fichier
            scene_name: Nom de la scène
            
        Returns:
            Liste de tags
        """
        tags = []
        
        # Tags basés sur l'extension
        if extension in ['mov', 'mp4']:
            tags.append('quicktime')
        elif extension in ['prores']:
            tags.append('apple_prores')
        elif extension in ['dnxhd']:
            tags.append('avid_dnxhd')
        elif extension in ['r3d']:
            tags.append('red_raw')
        elif extension in ['braw']:
            tags.append('blackmagic_raw')
        
        # Tags basés sur le contenu du nom de scène
        if 'EXT' in scene_name:
            tags.append('exterieur')
        if 'INT' in scene_name:
            tags.append('interieur')
        if 'NUIT' in scene_name:
            tags.append('nuit')
        if 'JOUR' in scene_name:
            tags.append('jour')
        if 'AMERICAINE' in scene_name:
            tags.append('americaine')
        if 'MAYDAY' in scene_name:
            tags.append('mayday')
        if 'RECUPERATION' in scene_name:
            tags.append('recuperation')
        
        return tags
    
    def _generate_description(self, scene_name: str, shot_id: str, version: str) -> str:
        """
        Génère une description automatique du fichier.
        
        Args:
            scene_name: Nom de la scène
            shot_id: ID du plan
            version: Version
            
        Returns:
            Description formatée
        """
        # Convertir le nom de scène en format lisible
        readable_scene = scene_name.replace('_', ' ').title()
        
        return f"Plan {shot_id} - {readable_scene} - Version {version}"
    
    def validate_file_structure(self, file_path: str) -> bool:
        """
        Valide si un fichier respecte la structure attendue.
        
        Args:
            file_path: Chemin du fichier à valider
            
        Returns:
            True si le fichier est valide
        """
        try:
            # Vérifier que le fichier existe
            path = Path(file_path)
            if not path.exists():
                logger.error(f"Fichier introuvable: {file_path}")
                return False
            
            # Vérifier que c'est bien dans BY_SHOT
            if 'BY_SHOT' not in str(path):
                logger.warning(f"Fichier pas dans BY_SHOT: {file_path}")
                return False
            
            # Essayer de parser le nom
            metadata = self.parse_filename(path.name)
            if not metadata:
                logger.error(f"Impossible de parser: {path.name}")
                return False
            
            # Vérifier la taille du fichier (minimum 1MB)
            if path.stat().st_size < 1024 * 1024:
                logger.warning(f"Fichier trop petit: {path.name}")
                return False
            
            logger.info(f"✅ Fichier validé: {path.name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur validation: {e}")
            return False
    
    def get_folder_path_components(self, metadata: FileMetadata) -> tuple:
        """
        Retourne les composants du chemin de dossier Frame.io.
        
        Args:
            metadata: Métadonnées du fichier
            
        Returns:
            Tuple (scene_name, shot_id) pour la structure /SCENE/SHOT/
        """
        return (metadata.scene_name, metadata.shot_id)
    
    def format_for_frameio(self, metadata: FileMetadata) -> Dict[str, str]:
        """
        Formate les métadonnées pour l'API Frame.io.
        
        Args:
            metadata: Métadonnées du fichier
            
        Returns:
            Dictionnaire formaté pour Frame.io
        """
        return {
            'name': f"{metadata.nomenclature}.{metadata.file_extension}",
            'description': metadata.description or '',
            'tags': metadata.tags or [],
            'custom_metadata': {
                'shot_id': metadata.shot_id,
                'scene_name': metadata.scene_name,
                'version': metadata.version,
                'nomenclature': metadata.nomenclature
            }
        }
