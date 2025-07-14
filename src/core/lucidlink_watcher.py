#!/usr/bin/env python3
"""
LucidLink File Watcher pour PostFlow
Surveille le dossier LucidLink et déclenche le workflow pour les nouveaux exports
"""

import os
import time
import logging
import asyncio
import threading
from pathlib import Path
from typing import Dict, List, Optional, Callable, Any
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import re

logger = logging.getLogger(__name__)
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import re

logger = logging.getLogger(__name__)


class LucidLinkExportHandler(FileSystemEventHandler):
    """Handler pour les événements de fichiers dans LucidLink."""
    
    def __init__(self, callback: Callable, watch_patterns: List[str] = None):
        """
        Initialiser le handler.
        
        Args:
            callback: Fonction à appeler quand un fichier est détecté
            watch_patterns: Patterns de fichiers à surveiller
        """
        super().__init__()
        self.callback = callback
        self.watch_patterns = watch_patterns or [
            r'^SQ\d{2}_UNDLM_\d{5}_v\d{3}\.(mov|mp4|avi|mxf)$',  # Nomenclature ULTRA-STRICTE: SQ01_UNDLM_00003_v001.mov
            r'^SQ\d{2}_UNDLM_v\d{3}\.(mov|mp4|avi|mxf)$',        # Format séquence _ALL: SQ02_UNDLM_v001.mov
        ]
        self.processing_files = set()
        self.processed_files = set()  # Fichiers déjà traités avec succès
        
    def on_created(self, event):
        """Fichier créé."""
        if not event.is_directory:
            self._handle_file_event(event.src_path, 'created')
    
    def on_modified(self, event):
        """Fichier modifié."""
        if not event.is_directory:
            # Ignorer les événements modified pour les fichiers déjà traités
            file_path = event.src_path
            if file_path in self.processed_files:
                logger.debug(f"🔄 Événement modified ignoré pour fichier déjà traité: {os.path.basename(file_path)}")
                return
            self._handle_file_event(file_path, 'modified')
    
    def on_moved(self, event):
        """Fichier déplacé."""
        if not event.is_directory:
            self._handle_file_event(event.dest_path, 'moved')
    
    def _handle_file_event(self, file_path: str, event_type: str):
        """Traiter un événement de fichier."""
        try:
            file_name = os.path.basename(file_path)
            
            # Vérifier si le fichier correspond aux patterns
            if not self._matches_patterns(file_name):
                logger.debug(f"Fichier ignoré (pattern): {file_name}")
                return
            
            # Éviter le double traitement
            if file_path in self.processing_files:
                logger.debug(f"Fichier déjà en cours de traitement: {file_name}")
                return
            
            logger.info(f"🎬 Fichier détecté ({event_type}): {file_name}")
            
            # Marquer comme en cours de traitement
            self.processing_files.add(file_path)
            
            # Démarrer le traitement en arrière-plan
            self._schedule_file_processing(file_path, event_type)
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement événement: {e}")
            if file_path in self.processing_files:
                self.processing_files.remove(file_path)
    
    def _schedule_file_processing(self, file_path: str, event_type: str):
        """Planifier le traitement d'un fichier en arrière-plan."""
        import threading
        
        def process_file():
            try:
                # Attendre que le fichier soit stable
                if self._wait_for_file_stability(file_path):
                    logger.info(f"✅ Fichier stable, traitement: {os.path.basename(file_path)}")
                    
                    # Extraire les métadonnées
                    metadata = self._extract_metadata(file_path)
                    
                    # Validation stricte de la nomenclature
                    if not self._validate_nomenclature(metadata):
                        logger.error(f"❌ NOMENCLATURE INVALIDE - Fichier rejeté: {os.path.basename(file_path)}")
                        logger.error(f"📋 Métadonnées: {metadata}")
                        return
                    
                    logger.info(f"✅ Nomenclature validée: {metadata.get('nomenclature', 'N/A')}")
                    
                    # Appeler le callback
                    if self.callback:
                        try:
                            if asyncio.iscoroutinefunction(self.callback):
                                # Callback async - créer une nouvelle boucle d'événements
                                try:
                                    loop = asyncio.new_event_loop()
                                    asyncio.set_event_loop(loop)
                                    loop.run_until_complete(self.callback(file_path, metadata))
                                finally:
                                    loop.close()
                            else:
                                # Callback sync
                                self.callback(file_path, metadata)
                            
                            # Marquer comme traité avec succès
                            self.processed_files.add(file_path)
                            logger.debug(f"✅ Fichier marqué comme traité: {os.path.basename(file_path)}")
                            
                        except Exception as e:
                            logger.error(f"❌ Erreur callback pour {os.path.basename(file_path)}: {e}")
                            raise
                else:
                    logger.warning(f"⚠️ Fichier instable ignoré: {os.path.basename(file_path)}")
                    
            except Exception as e:
                logger.error(f"❌ Erreur traitement fichier: {e}")
            finally:
                # Retirer de la liste des fichiers en cours
                if file_path in self.processing_files:
                    self.processing_files.remove(file_path)
        
        # Lancer dans un thread séparé
        thread = threading.Thread(target=process_file, daemon=True)
        thread.start()
    
    def _wait_for_file_stability(self, file_path: str, max_wait: int = 30) -> bool:
        """Attendre que le fichier soit stable."""
        try:
            if not os.path.exists(file_path):
                return False
            
            prev_size = None
            stable_count = 0
            required_stable_count = 3
            
            for _ in range(max_wait):
                try:
                    current_size = os.path.getsize(file_path)
                    
                    if prev_size is not None:
                        if current_size == prev_size:
                            stable_count += 1
                            if stable_count >= required_stable_count:
                                # Vérifier l'accessibilité
                                with open(file_path, 'rb') as f:
                                    f.read(1024)
                                return True
                        else:
                            stable_count = 0
                    
                    prev_size = current_size
                    time.sleep(1)
                    
                except (OSError, PermissionError):
                    time.sleep(1)
                    continue
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur vérification stabilité: {e}")
            return False
    
    def _matches_patterns(self, file_name: str) -> bool:
        """Vérifier si le fichier correspond aux patterns de surveillance ULTRA-STRICTE."""
        for pattern in self.watch_patterns:
            # ULTRA-STRICT: pas de re.IGNORECASE - respect exact de la casse
            if re.search(pattern, file_name):
                logger.debug(f"✅ Fichier correspond au pattern STRICT '{pattern}': {file_name}")
                return True
        logger.debug(f"❌ Fichier rejeté (pattern strict): {file_name}")
        return False
    
    def _extract_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extraire les métadonnées du fichier."""
        try:
            path = Path(file_path)
            file_name = path.name
            
            # Informations de base
            metadata = {
                'file_path': file_path,
                'file_name': file_name,
                'file_size': path.stat().st_size,
                'timestamp': datetime.now().isoformat(),
                'extension': path.suffix.lower()
            }
            
            # Parser le nom du fichier pour extraire les informations
            nomenclature = self._parse_filename(file_name)
            metadata.update(nomenclature)
            
            return metadata
            
        except Exception as e:
            logger.error(f"❌ Erreur extraction métadonnées: {e}")
            return {
                'file_path': file_path,
                'file_name': os.path.basename(file_path),
                'error': str(e)
            }
    
    def _parse_filename(self, file_name: str) -> Dict[str, str]:
        """Parser le nom de fichier pour extraire les informations selon la nouvelle nomenclature."""
        shot_info = {
            'shot_name': 'Unknown',
            'scene_name': 'Unknown',
            'version': 'Unknown',
            'nomenclature': 'Unknown'
        }
        
        try:
            # Format standard: SQ01_UNDLM_00001_v001.mov
            match = re.match(r'^(SQ\d{2})_UNDLM_(\d{5})_v(\d{3})\.', file_name)
            if match:
                scene_num = match.group(1)
                shot_num = match.group(2)
                version = f"v{match.group(3)}"
                
                shot_info.update({
                    'shot_name': f'UNDLM_{shot_num}',
                    'scene_name': scene_num,
                    'version': version,
                    'nomenclature': f'{scene_num}_UNDLM_{shot_num}_{version}'
                })
                return shot_info
            
            # Format séquence _ALL: SQ02_UNDLM_v001.mov
            match = re.match(r'^(SQ\d{2})_UNDLM_v(\d{3})\.', file_name)
            if match:
                scene_num = match.group(1)
                version = f"v{match.group(2)}"
                
                shot_info.update({
                    'shot_name': f'{scene_num}_ALL',
                    'scene_name': scene_num,
                    'version': version,
                    'nomenclature': f'{scene_num}_UNDLM_{version}',
                    'is_sequence_all': True
                })
                return shot_info
            
            # Si aucun pattern ne correspond, laisser "Unknown"
            logger.warning(f"⚠️ Nom de fichier non conforme aux nomenclatures supportées: {file_name}")
            
        except Exception as e:
            logger.error(f"❌ Erreur parsing nom fichier: {e}")
        
        return shot_info

    def _validate_nomenclature(self, metadata: Dict[str, Any]) -> bool:
        """
        Valider strictement la nomenclature des fichiers ET leur emplacement.
        
        Args:
            metadata: Métadonnées extraites du fichier
            
        Returns:
            bool: True si la nomenclature et l'emplacement sont valides, False sinon
        """
        try:
            file_name = metadata.get('file_name', '')
            file_path = metadata.get('file_path', '')
            
            # Vérifications directes plutôt que lambdas pour éviter les problèmes de closure
            
            # Extension vidéo
            extension = metadata.get('extension', '').lower()
            if extension not in ['.mov', '.mp4', '.avi', '.mxf']:
                logger.error(f"❌ Validation échouée - Extension vidéo: Extension invalide: {extension}")
                return False
            
            # Nom de scène
            scene_name = metadata.get('scene_name', '')
            if scene_name == 'Unknown' or not scene_name.startswith('SQ'):
                logger.error(f"❌ Validation échouée - Nom de scène: Nom de scène invalide: {scene_name}")
                return False
            
            # Nom de plan (accepter les formats _ALL et standard)
            shot_name = metadata.get('shot_name', '')
            is_sequence_all = metadata.get('is_sequence_all', False)
            if shot_name == 'Unknown':
                logger.error(f"❌ Validation échouée - Nom de plan: Nom de plan invalide: {shot_name}")
                return False
            
            # Validation différente selon le type
            if is_sequence_all:
                # Pour les séquences _ALL: shot_name doit être SQ##_ALL
                if not re.match(r'^SQ\d{2}_ALL$', shot_name):
                    logger.error(f"❌ Validation échouée - Format _ALL: Nom de plan invalide pour séquence _ALL: {shot_name}")
                    return False
            else:
                # Pour le format standard: shot_name doit contenir UNDLM_
                if 'UNDLM_' not in shot_name:
                    logger.error(f"❌ Validation échouée - Format standard: Nom de plan invalide: {shot_name}")
                    return False
            
            # Format version
            version = metadata.get('version', '')
            if not re.match(r'^v\d{3}$', version):
                logger.error(f"❌ Validation échouée - Format version: Version invalide (doit être v001, v002, etc.): {version}")
                return False
            
            # Nomenclature complète
            nomenclature = metadata.get('nomenclature', '')
            if nomenclature == 'Unknown':
                logger.error(f"❌ Validation échouée - Nomenclature complète: Nomenclature non reconnue: {nomenclature}")
                return False
            
            # Validation spécifique des patterns
            if not self._validate_filename_pattern(file_name):
                logger.error(f"❌ Pattern de nom de fichier invalide: {file_name}")
                return False
            
            # VALIDATION CRITIQUE: Vérifier que le fichier est dans le bon sous-dossier
            if not self._validate_file_path_structure(file_path, scene_name, shot_name):
                logger.error(f"❌ Fichier dans le mauvais dossier: {file_path}")
                return False
            
            logger.info(f"✅ Nomenclature et emplacement validés: {file_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur validation nomenclature: {e}")
            return False
    
    def _validate_filename_pattern(self, file_name: str) -> bool:
        """
        Valider le pattern strict du nom de fichier.
        
        Args:
            file_name: Nom du fichier
            
        Returns:
            bool: True si le pattern est valide, False sinon
        """
        valid_patterns = [
            r'^SQ\d{2}_UNDLM_\d{5}_v\d{3}\.(mov|mp4|avi|mxf)$',  # SQ01_UNDLM_00001_v001.mov ULTRA-STRICT
            r'^SQ\d{2}_UNDLM_v\d{3}\.(mov|mp4|avi|mxf)$',        # SQ02_UNDLM_v001.mov (format _ALL)
        ]
        
        for pattern in valid_patterns:
            if re.match(pattern, file_name):  # ULTRA-STRICT: pas de re.IGNORECASE
                logger.debug(f"✅ Pattern validé: {pattern} pour {file_name}")
                return True
        
        logger.error(f"❌ Aucun pattern valide pour: {file_name}")
        logger.error(f"📋 Patterns acceptés (ULTRA-STRICT - casse exacte et extensions minuscules):")
        logger.error(f"   Format standard:")
        logger.error(f"   • SQ01_UNDLM_00001_v001.mov")
        logger.error(f"   • SQ02_UNDLM_00015_v003.mp4")
        logger.error(f"   Format séquence _ALL:")
        logger.error(f"   • SQ01_UNDLM_v001.mov")
        logger.error(f"   • SQ02_UNDLM_v003.mp4")
        
        return False

    def _validate_file_path_structure(self, file_path: str, scene_name: str, shot_name: str) -> bool:
        """
        Valider que le fichier se trouve dans la bonne structure de dossier.
        
        Structure attendue: 
        - Standard: .../SQxx/UNDLM_xxxxx/SQxx_UNDLM_xxxxx_vyyy.mov
        - Séquence _ALL: .../SQxx/_ALL/SQxx_UNDLM_vyyy.mov
        
        Args:
            file_path: Chemin complet du fichier
            scene_name: Nom de la scène (ex: SQ01)
            shot_name: Nom du plan (ex: UNDLM_00003 ou SQ01_ALL)
            
        Returns:
            bool: True si la structure est valide, False sinon
        """
        try:
            path_obj = Path(file_path)
            parent_dir = path_obj.parent.name  # Dossier contenant le fichier
            grandparent_dir = path_obj.parent.parent.name  # Dossier parent
            
            logger.debug(f"🔍 Validation structure chemin:")
            logger.debug(f"   • Fichier: {path_obj.name}")
            logger.debug(f"   • Dossier parent: {parent_dir}")
            logger.debug(f"   • Dossier grand-parent: {grandparent_dir}")
            logger.debug(f"   • Scene attendue: {scene_name}")
            logger.debug(f"   • Plan attendu: {shot_name}")
            
            # Détecter si c'est un fichier de séquence _ALL
            is_sequence_all = shot_name.endswith('_ALL')
            
            if is_sequence_all:
                # Pour les séquences _ALL: structure .../SQxx/_ALL/
                expected_parent = "_ALL"
                
                if parent_dir != expected_parent:
                    logger.error(f"❌ ERREUR STRUCTURE (_ALL): Le fichier n'est pas dans le dossier _ALL")
                    logger.error(f"   📂 Dossier actuel: {parent_dir}")
                    logger.error(f"   ✅ Dossier attendu: {expected_parent}")
                    return False
                
                if grandparent_dir != scene_name:
                    logger.error(f"❌ ERREUR STRUCTURE (_ALL): Le dossier _ALL n'est pas dans la bonne scène")
                    logger.error(f"   📂 Scène actuelle: {grandparent_dir}")
                    logger.error(f"   ✅ Scène attendue: {scene_name}")
                    return False
                
                logger.info(f"✅ Structure _ALL validée: ...//{scene_name}/_ALL/{path_obj.name}")
                return True
            
            else:
                # Pour le format standard: structure .../SQxx/UNDLM_xxxxx/
                # Vérifier que le fichier n'est PAS directement dans le dossier SQxx
                if parent_dir == scene_name:
                    logger.error(f"❌ ERREUR STRUCTURE: Le fichier est directement dans {scene_name}/ au lieu d'être dans {scene_name}/{shot_name}/")
                    logger.error(f"   📂 Chemin actuel: {file_path}")
                    logger.error(f"   ✅ Chemin attendu: ...//{scene_name}/{shot_name}/{path_obj.name}")
                    return False
                
                # Vérifier que le fichier est dans le bon sous-dossier du plan
                if parent_dir != shot_name:
                    logger.error(f"❌ ERREUR STRUCTURE: Le fichier n'est pas dans le bon dossier de plan")
                    logger.error(f"   📂 Dossier actuel: {parent_dir}")
                    logger.error(f"   ✅ Dossier attendu: {shot_name}")
                    return False
                
                # Vérifier que le dossier du plan est dans le bon dossier de scène
                if grandparent_dir != scene_name:
                    logger.error(f"❌ ERREUR STRUCTURE: Le dossier du plan n'est pas dans la bonne scène")
                    logger.error(f"   📂 Scène actuelle: {grandparent_dir}")
                    logger.error(f"   ✅ Scène attendue: {scene_name}")
                    return False
                
                logger.info(f"✅ Structure de chemin validée: ...//{scene_name}/{shot_name}/{path_obj.name}")
                return True
            
        except Exception as e:
            logger.error(f"❌ Erreur validation structure chemin: {e}")
            return False

    # ...existing code...


class LucidLinkWatcher:
    """Watcher principal pour LucidLink."""
    
    def __init__(self, watch_directory: str, workflow_callback: Callable, sheets_tracker=None):
        """
        Initialiser le watcher.
        
        Args:
            watch_directory: Dossier à surveiller
            workflow_callback: Fonction de callback pour le workflow
            sheets_tracker: Tracker Google Sheets pour vérifier la nomenclature
        """
        self.watch_directory = Path(watch_directory)
        self.workflow_callback = workflow_callback
        self.sheets_tracker = sheets_tracker
        self.observer = None
        self.is_running = False
        self.handler = None
        
        # Vérifier que le dossier existe
        if not self.watch_directory.exists():
            raise FileNotFoundError(f"Dossier de surveillance non trouvé: {watch_directory}")
    
    def initialize_processed_files(self, upload_tracker=None):
        """Initialiser la liste des fichiers déjà traités à partir du tracker."""
        if self.handler and upload_tracker:
            try:
                # Obtenir tous les uploads du tracker
                uploads = upload_tracker.get_all_uploads()
                for upload_id, upload_data in uploads.items():
                    file_path = upload_data.get('file_path')
                    if file_path and os.path.exists(file_path):
                        self.handler.processed_files.add(file_path)
                        logger.debug(f"📁 Fichier marqué comme déjà traité: {os.path.basename(file_path)}")
                
                logger.info(f"✅ {len(self.handler.processed_files)} fichiers marqués comme déjà traités")
                
            except Exception as e:
                logger.error(f"❌ Erreur initialisation fichiers traités: {e}")
    
    def start(self):
        """Démarrer la surveillance."""
        if self.is_running:
            logger.warning("Watcher déjà en cours")
            return
        
        try:
            # Créer l'observer
            self.observer = Observer()
            
            # Créer le handler
            self.handler = LucidLinkExportHandler(self.workflow_callback)
            
            # Ajouter la surveillance récursive
            self.observer.schedule(
                self.handler,
                str(self.watch_directory),
                recursive=True
            )
            
            # Démarrer
            self.observer.start()
            self.is_running = True
            
            logger.info(f"🔍 Surveillance démarrée: {self.watch_directory}")
            logger.info("En attente de nouveaux exports...")
            
        except Exception as e:
            logger.error(f"❌ Erreur démarrage watcher: {e}")
            raise
    
    def stop(self):
        """Arrêter la surveillance."""
        if not self.is_running:
            return
        
        try:
            if self.observer:
                self.observer.stop()
                self.observer.join()
            
            self.is_running = False
            logger.info("🔍 Surveillance arrêtée")
            
        except Exception as e:
            logger.error(f"❌ Erreur arrêt watcher: {e}")
    
    def health_monitor(self) -> Dict[str, Any]:
        """
        Retourne le statut de santé du watcher.
        
        Returns:
            Dict contenant les informations de santé
        """
        return {
            'status': 'running' if self.is_running else 'stopped',
            'watch_directory': str(self.watch_directory),
            'directory_exists': self.watch_directory.exists(),
            'observer_active': self.observer is not None and self.observer.is_alive() if self.observer else False,
            'last_check': datetime.now().isoformat()
        }
    
    def wait_for_files(self):
        """Attendre indéfiniment (mode daemon)."""
        try:
            while self.is_running:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Arrêt demandé par l'utilisateur")
            self.stop()


async def process_new_export(file_path: str, metadata: Dict[str, Any]):
    """
    Traiter un nouveau fichier d'export.
    
    Args:
        file_path: Chemin du fichier
        metadata: Métadonnées extraites
    """
    logger.info(f"🎬 NOUVEAU EXPORT DÉTECTÉ")
    logger.info(f"📁 Fichier: {metadata.get('file_name')}")
    logger.info(f"📊 Taille: {metadata.get('file_size', 0) / (1024*1024):.1f} MB")
    logger.info(f"🎯 Plan: {metadata.get('nomenclature', 'N/A')}")
    logger.info(f"🔢 Version: {metadata.get('version', 'N/A')}")
    
    # Ici, on déclencherait le workflow complet
    # - Génération de thumbnail
    # - Upload Frame.io
    # - Notification Discord
    # - Mise à jour Google Sheets
    
    # Pour l'instant, simulation
    logger.info("🔄 Déclenchement du workflow PostFlow...")
    

def create_lucidlink_watcher(watch_directory: str) -> LucidLinkWatcher:
    """
    Créer un watcher LucidLink configuré.
    
    Args:
        watch_directory: Dossier à surveiller
        
    Returns:
        LucidLinkWatcher: Watcher configuré
    """
    return LucidLinkWatcher(watch_directory, process_new_export)


if __name__ == "__main__":
    # Test du watcher
    watcher = create_lucidlink_watcher("/Volumes/LucidLink/UNDLM_EXPORTS")
    
    try:
        watcher.start()
        watcher.wait_for_files()
    except KeyboardInterrupt:
        watcher.stop()
