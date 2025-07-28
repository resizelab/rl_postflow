#!/usr/bin/env python3
"""
Processeur batch pour thumbnails
Module focalisé sur le traitement en lot avec intégration Google Sheets
"""

import logging
from pathlib import Path
from typing import List, Dict, Any, Optional, Callable

logger = logging.getLogger(__name__)


class BatchProcessor:
    """Processeur batch pour thumbnails avec intégration Google Sheets."""
    
    def __init__(self, generator, drive_manager, uploader):
        """
        Initialiser le processeur batch.
        
        Args:
            generator: Instance de ThumbnailGenerator
            drive_manager: Instance de DriveManager
            uploader: Instance de DriveUploader
        """
        self.generator = generator
        self.drive_manager = drive_manager
        self.uploader = uploader
    
    async def process_video_with_upload(self, video_or_thumbnail_path: str, shot_name: str = None) -> Optional[str]:
        """
        Génère un thumbnail et l'upload vers Google Drive.
        
        Args:
            video_or_thumbnail_path: Chemin vers le fichier vidéo OU vers un thumbnail existant
            shot_name: Nom du plan (optionnel)
            
        Returns:
            Optional[str]: URL publique du thumbnail sur Google Drive
        """
        try:
            path_obj = Path(video_or_thumbnail_path)
            
            # Vérifier si c'est déjà un thumbnail (image) ou un fichier vidéo
            if path_obj.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                # C'est déjà un thumbnail, juste l'uploader
                logger.info(f"📤 Upload thumbnail existant vers Google Drive: {path_obj.name}")
                
                public_url = await self.uploader.upload_and_get_url(str(path_obj), shot_name)
                
                if public_url:
                    logger.info(f"✅ Thumbnail uploadé vers Drive: {path_obj.name}")
                    return public_url
                else:
                    logger.error("❌ Échec upload thumbnail vers Drive")
                    return None
            
            else:
                # C'est un fichier vidéo, générer le thumbnail puis l'uploader
                logger.info(f"🎬 Génération + upload thumbnail depuis vidéo: {path_obj.name}")
                
                # 1. Générer le thumbnail localement
                thumbnail_path = await self.generator.generate(video_or_thumbnail_path)
                if not thumbnail_path:
                    logger.error("❌ Impossible de générer le thumbnail")
                    return None
                    
                # 2. Uploader vers Google Drive
                public_url = await self.uploader.upload_and_get_url(thumbnail_path, shot_name)
                if public_url:
                    logger.info(f"✅ Thumbnail généré et uploadé vers Google Drive: {public_url}")
                    return public_url
                else:
                    logger.error("❌ Échec upload thumbnail vers Google Drive")
                    return None
                
        except Exception as e:
            logger.error(f"❌ Erreur process_video_with_upload: {e}")
            return None
    
    async def upload_and_insert_to_sheets(self, video_or_thumbnail_path: str, shot_name: str, 
                                          sheets_adapter=None, row_number: int = None) -> Optional[str]:
        """
        Upload un thumbnail vers Google Drive et insère la formule =IMAGE() dans Google Sheets.
        
        Args:
            video_or_thumbnail_path: Chemin vers le fichier vidéo ou thumbnail
            shot_name: Nom du plan
            sheets_adapter: Instance de OptimizedSheetsStatusAdapter
            row_number: Numéro de ligne pour l'insertion directe
            
        Returns:
            Optional[str]: URL publique du thumbnail sur Google Drive
        """
        try:
            # 1. Upload vers Google Drive
            drive_url = await self.process_video_with_upload(video_or_thumbnail_path, shot_name)
            
            if not drive_url:
                logger.warning(f"⚠️ Échec upload thumbnail pour {shot_name}")
                return None
            
            # 2. Insertion dans Google Sheets si adaptateur fourni
            if sheets_adapter:
                if row_number:
                    # Insertion directe si numéro de ligne fourni
                    success = await sheets_adapter.update_status(
                        row_number=row_number,
                        status=None,
                        additional_data={'thumbnail_url': drive_url}
                    )
                    if success:
                        logger.info(f"📸 Thumbnail inséré ligne {row_number}: {shot_name}")
                else:
                    # Recherche automatique du shot
                    found_row = await sheets_adapter.find_shot_row(shot_name)
                    if found_row:
                        success = await sheets_adapter.update_status(
                            row_number=found_row,
                            status=None,
                            additional_data={'thumbnail_url': drive_url}
                        )
                        if success:
                            logger.info(f"📸 Thumbnail inséré automatiquement ligne {found_row}: {shot_name}")
            
            return drive_url
            
        except Exception as e:
            logger.error(f"❌ Erreur upload_and_insert_to_sheets: {e}")
            return None
    
    async def bulk_process_thumbnails(self, file_paths: List[str], sheets_adapter=None, 
                                    shot_name_extractor: Callable[[str], str] = None) -> Dict[str, Any]:
        """
        Traite plusieurs thumbnails en batch avec OptimizedSheetsStatusAdapter.
        
        Args:
            file_paths: Liste des chemins de fichiers à traiter
            sheets_adapter: Instance de OptimizedSheetsStatusAdapter
            shot_name_extractor: Fonction pour extraire le nom du shot
            
        Returns:
            Dict: Résultats du traitement batch
        """
        try:
            results = {
                'processed': 0,
                'uploaded': 0,
                'sheets_updated': 0,
                'errors': [],
                'urls': {}
            }
            
            batch_updates = []
            
            for file_path in file_paths:
                try:
                    # Extraire le nom du shot
                    if shot_name_extractor:
                        shot_name = shot_name_extractor(file_path)
                    else:
                        shot_name = Path(file_path).stem
                    
                    # Upload vers Google Drive
                    drive_url = await self.process_video_with_upload(file_path, shot_name)
                    
                    results['processed'] += 1
                    
                    if drive_url:
                        results['uploaded'] += 1
                        results['urls'][shot_name] = drive_url
                        
                        # Préparer pour batch update
                        if sheets_adapter:
                            row_number = await sheets_adapter.find_shot_row(shot_name)
                            if row_number:
                                batch_updates.append({
                                    'row_number': row_number,
                                    'status': None,
                                    'additional_data': {'thumbnail_url': drive_url}
                                })
                    else:
                        results['errors'].append(f"Échec upload: {shot_name}")
                        
                except Exception as item_error:
                    results['errors'].append(f"Erreur {file_path}: {item_error}")
            
            # Exécuter les mises à jour en batch
            if batch_updates and sheets_adapter:
                try:
                    batch_success = await sheets_adapter.batch_update_multiple_rows(batch_updates)
                    if batch_success:
                        results['sheets_updated'] = len(batch_updates)
                        logger.info(f"📊 Batch update réussi: {len(batch_updates)} thumbnails insérés")
                    else:
                        results['errors'].append("Échec batch update Google Sheets")
                        
                except Exception as batch_error:
                    results['errors'].append(f"Erreur batch update: {batch_error}")
            
            logger.info(f"🎯 Traitement batch terminé: {results['uploaded']}/{results['processed']} thumbnails uploadés")
            return results
            
        except Exception as e:
            logger.error(f"❌ Erreur bulk_process_thumbnails: {e}")
            return {'error': str(e)}
