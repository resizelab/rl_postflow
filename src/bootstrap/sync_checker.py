#!/usr/bin/env python3
"""
🔄 Sync Checker Bootstrap Module
===============================

Vérification de synchronisation au démarrage du pipeline.
Compare les fichiers sur LucidLink avec le JSON de tracking.

Version: 4.1.1
Date: 9 juillet 2025
"""

import re
import logging
import asyncio
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
from src.utils.config import ConfigManager

logger = logging.getLogger(__name__)

try:
    from src.utils.upload_tracker import UploadTracker
    UPLOAD_TRACKER_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Upload tracker not available: {e}")
    UPLOAD_TRACKER_AVAILABLE = False


class SyncChecker:
    """Gestionnaire de vérification de synchronisation au démarrage"""
    
    def __init__(self, config: Dict[str, Any], config_manager: ConfigManager, 
                 upload_tracker: Optional[Any] = None, discord_notifier: Optional[Any] = None):
        self.config = config
        self.config_manager = config_manager
        self.upload_tracker = upload_tracker
        self.discord_notifier = discord_notifier
        
    async def startup_sync_check(self, process_file_callback=None, max_files_to_process: int = 999) -> bool:
        """
        Vérification de synchronisation au démarrage du pipeline.
        Compare les fichiers sur LucidLink avec le JSON de tracking pour identifier
        les fichiers qui auraient dû être traités mais manqués à cause d'une panne.
        
        Args:
            process_file_callback: Fonction callback pour traiter les fichiers manqués
            max_files_to_process: Nombre maximum de fichiers à traiter lors de la récupération
            
        Returns:
            bool: True si la vérification s'est bien passée
        """
        try:
            logger.info("🔍 === VÉRIFICATION DE SYNCHRONISATION AU DÉMARRAGE ===")
            
            if not self.upload_tracker:
                logger.warning("⚠️ Upload tracker non disponible, pas de vérification")
                return False
            
            # Chemin de base LucidLink (détection automatique cross-platform)
            from src.utils.cross_platform_paths import CrossPlatformPathManager
            path_manager = CrossPlatformPathManager()
            
            default_base_path = path_manager.build_lucidlink_path('o2b-undllm')
            lucidlink_base = self.config_manager.get('lucidlink.base_path', str(default_base_path))
            scan_path = Path(lucidlink_base) / "4_OUT" / "2_FROM_ANIM"
            
            if not scan_path.exists():
                logger.warning(f"⚠️ Chemin LucidLink non trouvé: {scan_path}")
                return False
            
            logger.info(f"📁 Scan des fichiers dans: {scan_path}")
            
            # Scanner et analyser les fichiers
            found_files, processed_files, missing_files = await self._scan_and_compare_files(scan_path)
            
            # Afficher le résumé
            await self._display_sync_summary(found_files, processed_files, missing_files)
            
            # Traiter les fichiers manqués si callback fourni
            if missing_files and process_file_callback:
                await self._process_missing_files(missing_files, process_file_callback, max_files_to_process)
            
            # Notification Discord du résumé
            await self._send_discord_summary(found_files, processed_files, missing_files, max_files_to_process)
            
            logger.info("✅ Vérification de synchronisation terminée")
            return True
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur vérification synchronisation: {e}")
            return False
    
    async def _scan_and_compare_files(self, scan_path: Path) -> Tuple[List[Path], List[Path], List[Path]]:
        """
        Scanner LucidLink et comparer avec le tracking
        
        Returns:
            Tuple[found_files, processed_files, missing_files]
        """
        found_files = []
        processed_files = []
        missing_files = []
        
        # Pattern pour la nomenclature SQ##_UNDLM_#####_v###.mov
        pattern = r'^SQ\d{2}_UNDLM_\d{5}_v\d{3}\.mov$'
        
        # Scanner récursivement les fichiers
        for sequence_dir in scan_path.iterdir():
            if sequence_dir.is_dir() and sequence_dir.name.startswith('SQ'):
                for shot_dir in sequence_dir.iterdir():
                    if shot_dir.is_dir() and shot_dir.name.startswith('UNDLM_'):
                        for file_path in shot_dir.glob('*.mov'):
                            if re.match(pattern, file_path.name):
                                found_files.append(file_path)
                                logger.debug(f"📄 Fichier trouvé: {file_path.name}")
        
        logger.info(f"📊 {len(found_files)} fichiers trouvés sur LucidLink")
        
        # Comparer avec le JSON de tracking
        tracked_files = {}
        if self.upload_tracker and hasattr(self.upload_tracker, 'tracking_data'):
            for upload_id, upload_data in self.upload_tracker.tracking_data.get("uploads", {}).items():
                file_path = upload_data.get('file_path', '')
                if file_path:
                    tracked_files[file_path] = upload_data
        
        logger.info(f"📊 {len(tracked_files)} uploads dans le tracking")
        
        # Identifier les fichiers manqués
        for file_path in found_files:
            file_path_str = str(file_path.absolute())  # Utiliser le chemin absolu
            file_name = file_path.name
            
            # Vérifier d'abord par chemin exact
            matched_upload = None
            if file_path_str in tracked_files:
                matched_upload = tracked_files[file_path_str]
                logger.debug(f"🔍 Match par chemin exact: {file_name}")
            else:
                # Si pas de match exact, chercher par nom de fichier ET vérifier les métadonnées (nom + taille + date)
                for tracked_path, upload_data in tracked_files.items():
                    tracked_filename = upload_data.get('filename', Path(tracked_path).name)
                    
                    # Match par nom de fichier ET vérification de métadonnées (taille + date)
                    if tracked_filename == file_name:
                        try:
                            # Récupérer les informations du fichier actuel
                            current_stat = file_path.stat()
                            current_size = current_stat.st_size
                            current_mtime = current_stat.st_mtime
                            
                            # Récupérer les informations du fichier tracké
                            tracked_size = upload_data.get('file_size', 0)
                            tracked_mtime = upload_data.get('file_mtime', 0)  # Date de modification
                            
                            # Correspondance stricte : nom + taille + date
                            if (tracked_size > 0 and current_size == tracked_size and
                                tracked_mtime > 0 and abs(current_mtime - tracked_mtime) < 2):  # Tolérance 2 secondes
                                matched_upload = upload_data
                                logger.debug(f"🔍 Match complet (nom+taille+date): {file_name} ({current_size} bytes)")
                                break
                            elif tracked_size > 0 and current_size == tracked_size and tracked_mtime == 0:
                                # Ancien tracking sans date, utiliser nom + taille seulement
                                matched_upload = upload_data
                                logger.debug(f"🔍 Match par nom+taille (pas de date tracée): {file_name} ({current_size} bytes)")
                                break
                            else:
                                # Fichier avec même nom mais métadonnées différentes = probablement re-sorti
                                logger.debug(f"🔄 Fichier modifié détecté: {file_name} (taille: {current_size} vs {tracked_size}, date: {current_mtime} vs {tracked_mtime})")
                                # Ne pas marquer comme matched_upload - sera retraité
                                
                        except Exception as e:
                            logger.debug(f"Erreur vérification métadonnées pour {file_name}: {e}")
                            # En cas d'erreur, ne pas assumer une correspondance
                            continue
            
            if not matched_upload:
                # Fichier non traité du tout
                missing_files.append(file_path)
                logger.warning(f"⚠️ Fichier non traité: {file_path.name}")
            else:
                # Fichier traité, vérifier le statut
                status = matched_upload.get('status', 'UNKNOWN')
                
                # Vérifier les statuts de completion (avec et sans emoji)
                if status in ['COMPLETED', '🎉 COMPLETED', 'SUCCESS', '✅ SUCCESS']:
                    processed_files.append(file_path)
                    logger.info(f"✅ Fichier déjà traité: {file_path.name} (statut: {status})")
                else:
                    # Fichier en cours ou échoué
                    missing_files.append(file_path)
                    logger.warning(f"⚠️ Fichier incomplet (statut: {status}): {file_path.name}")
        
        return found_files, processed_files, missing_files
    
    async def _display_sync_summary(self, found_files: List[Path], processed_files: List[Path], missing_files: List[Path]):
        """Affiche le résumé de synchronisation"""
        logger.info(f"📊 === RÉSUMÉ DE SYNCHRONISATION ===")
        logger.info(f"📊 Fichiers sur LucidLink: {len(found_files)}")
        logger.info(f"📊 Fichiers traités: {len(processed_files)}")
        logger.info(f"📊 Fichiers manqués: {len(missing_files)}")
        
        if missing_files:
            logger.info(f"📋 Liste des fichiers manqués :")
            for file_path in missing_files[:10]:  # Afficher max 10
                logger.info(f"   📄 {file_path.name}")
            if len(missing_files) > 10:
                logger.info(f"   ... et {len(missing_files) - 10} autres")
    
    async def _process_missing_files(self, missing_files: List[Path], process_callback, max_files: int):
        """Traite les fichiers manqués"""
        if not missing_files:
            return
            
        logger.info(f"🔄 Traitement des fichiers manqués (max {max_files})...")
        
        files_to_process = missing_files[:max_files]
        
        for i, file_path in enumerate(files_to_process, 1):
            try:
                logger.info(f"🔄 [{i}/{len(files_to_process)}] Traitement de récupération: {file_path.name}")
                
                # Appeler le callback de traitement
                if asyncio.iscoroutinefunction(process_callback):
                    await process_callback(file_path, force=True)
                else:
                    process_callback(file_path, force=True)
                
                # Pause courte entre les fichiers
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"[ERROR] Erreur traitement {file_path.name}: {e}")
                continue
        
        logger.info(f"✅ Traitement de récupération terminé ({len(files_to_process)} fichiers traités)")
    
    async def _send_discord_summary(self, found_files: List[Path], processed_files: List[Path], 
                                   missing_files: List[Path], max_processed: int):
        """Envoie un résumé Discord"""
        if not self.discord_notifier:
            return
            
        try:
            summary_message = f"🔍 Vérification synchronisation terminée\n"
            summary_message += f"📊 Fichiers LucidLink: {len(found_files)}\n"
            summary_message += f"✅ Fichiers traités: {len(processed_files)}\n"
            summary_message += f"🔄 Fichiers récupérés: {min(len(missing_files), max_processed)}"
            
            if hasattr(self.discord_notifier, 'notify_system_status'):
                self.discord_notifier.notify_system_status(
                    "🔍 Synchronisation démarrage",
                    summary_message
                )
            else:
                logger.debug("Discord notifier n'a pas de méthode notify_system_status")
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur notification Discord: {e}")
    
    def get_sync_stats(self) -> Dict[str, Any]:
        """Retourne les statistiques de synchronisation pour le dashboard"""
        return {
            'last_sync_check': None,  # À implémenter si nécessaire
            'upload_tracker_available': self.upload_tracker is not None,
            'sync_enabled': True
        }


async def startup_sync_check(config: Dict[str, Any], config_manager: ConfigManager, 
                           upload_tracker: Optional[Any] = None, discord_notifier: Optional[Any] = None,
                           process_file_callback=None, max_files_to_process: int = 999) -> bool:
    """
    Fonction d'initialisation de vérification de synchronisation pour compatibilité avec main.py
    
    Args:
        config: Configuration générale
        config_manager: Gestionnaire de configuration
        upload_tracker: Tracker d'uploads (optionnel)
        discord_notifier: Notificateur Discord (optionnel)
        process_file_callback: Callback pour traiter les fichiers manqués
        max_files_to_process: Nombre maximum de fichiers à traiter
        
    Returns:
        bool: True si la vérification s'est bien passée
    """
    try:
        checker = SyncChecker(config, config_manager, upload_tracker, discord_notifier)
        return await checker.startup_sync_check(process_file_callback, max_files_to_process)
        
    except Exception as e:
        logger.error(f"[ERROR] Erreur fonction startup_sync_check: {e}")
        return False
