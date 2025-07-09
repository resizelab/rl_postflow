#!/usr/bin/env python3
"""
Adaptateur pour SheetsStatusTracker
Permet d'utiliser SimpleGoogleSheetsUserManager avec SheetsStatusTracker
"""

import logging
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class SheetsStatusTrackerAdapter:
    """
    Adaptateur pour SheetsStatusTracker qui fonctionne avec SimpleGoogleSheetsUserManager
    """
    
    def __init__(self, user_manager, spreadsheet_id: str, worksheet_name: str = "SHOTS_TRACK"):
        """
        Initialise l'adaptateur
        
        Args:
            user_manager: SimpleGoogleSheetsUserManager
            spreadsheet_id: ID du spreadsheet
            worksheet_name: Nom de la worksheet
        """
        self.user_manager = user_manager
        self.spreadsheet_id = spreadsheet_id
        self.worksheet_name = worksheet_name
        
    async def update_status(self, row_number: int, status: str, additional_data: Dict[str, Any] = None) -> bool:
        """
        Met à jour le statut d'un plan dans Google Sheets
        
        Args:
            row_number: Numéro de ligne (1-indexé)
            status: Nouveau statut
            additional_data: Données supplémentaires à mettre à jour
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            service = self.user_manager.get_service()
            
            # Préparer les mises à jour
            updates = []
            
            # Colonne STATUS (colonne 6 selon le mapping)
            status_range = f"{self.worksheet_name}!F{row_number}"
            updates.append({
                'range': status_range,
                'values': [[status]]
            })
            
            # Ajouter les données supplémentaires si disponibles
            if additional_data:
                # Mapping des champs vers les colonnes
                field_to_column = {
                    'version': 'J',           # VERSION (colonne 10)
                    'frameio_link': 'K',      # FRAME_IO_LINK (colonne 11)
                    'file_name': 'Q',         # SRC_NAME (colonne 17)
                    'thumbnail_url': 'E',     # THUMBNAIL (colonne 5)
                    'processing_date': 'Z',   # UPDATED (colonne 26) - pour les timestamps
                }
                
                for field, value in additional_data.items():
                    if field in field_to_column and value:
                        column = field_to_column[field]
                        range_name = f"{self.worksheet_name}!{column}{row_number}"
                        
                        # Traitement spécial pour thumbnail_url
                        if field == 'thumbnail_url':
                            # Si c'est déjà une formule, l'utiliser directement
                            if str(value).startswith('=IMAGE('):
                                formatted_value = str(value)
                            else:
                                # Sinon formater en formule IMAGE() pour Google Sheets
                                formatted_value = f'=IMAGE("{value}")'
                            updates.append({
                                'range': range_name,
                                'values': [[formatted_value]]
                            })
                            logger.info(f"📸 Formule IMAGE ajoutée: {formatted_value}")
                        else:
                            updates.append({
                                'range': range_name,
                                'values': [[str(value)]]
                            })
            
            # Ajouter la date de mise à jour
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            timestamp_range = f"{self.worksheet_name}!Z{row_number}"  # UPDATED (colonne 26)
            updates.append({
                'range': timestamp_range,
                'values': [[timestamp]]
            })
            
            # Exécuter les mises à jour par batch
            if updates:
                body = {
                    'valueInputOption': 'USER_ENTERED',  # Permet les formules comme =IMAGE()
                    'data': updates
                }
                
                result = service.spreadsheets().values().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body=body
                ).execute()
                
                updated_cells = result.get('totalUpdatedCells', 0)
                logger.info(f"✅ {updated_cells} cellules mises à jour en ligne {row_number}")
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour statut: {e}")
            return False
    
    async def update_links(self, row_number: int, links: Dict[str, str]) -> bool:
        """
        Met à jour les liens Frame.io
        
        Args:
            row_number: Numéro de ligne
            links: Dictionnaire des liens (review_link, share_link)
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            service = self.user_manager.get_service()
            
            # Mettre à jour la colonne FRAME_IO_LINK (colonne K)
            frameio_link = links.get('review_link') or links.get('share_link') or links.get('frameio_link')
            
            if frameio_link:
                range_name = f"{self.worksheet_name}!K{row_number}"
                
                result = service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body={'values': [[frameio_link]]}
                ).execute()
                
                logger.info(f"✅ Lien Frame.io mis à jour en ligne {row_number}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour liens: {e}")
            return False
    
    async def prepare_update_request(self, row_number: int, status: str, additional_data: Dict[str, Any] = None) -> Optional[Dict]:
        """
        Prépare une requête de mise à jour pour batch update
        
        Args:
            row_number: Numéro de ligne
            status: Statut
            additional_data: Données supplémentaires
            
        Returns:
            Dict: Requête préparée ou None
        """
        try:
            # Pour simplifier, on retourne la structure pour un batch update
            updates = []
            
            # Status
            updates.append({
                'range': f"{self.worksheet_name}!F{row_number}",
                'values': [[status]]
            })
            
            # Données supplémentaires
            if additional_data:
                field_to_column = {
                    'version': 'J',
                    'frameio_link': 'K', 
                    'file_name': 'Q',
                    'thumbnail_url': 'E',
                    'processing_date': 'Z',   # UPDATED (colonne 26)
                }
                
                for field, value in additional_data.items():
                    if field in field_to_column and value:
                        column = field_to_column[field]
                        
                        # Traitement spécial pour thumbnail_url
                        if field == 'thumbnail_url':
                            # Si c'est déjà une formule, l'utiliser directement
                            if str(value).startswith('=IMAGE('):
                                formatted_value = str(value)
                            else:
                                # Sinon formater en formule IMAGE() pour Google Sheets
                                formatted_value = f'=IMAGE("{value}")'
                            updates.append({
                                'range': f"{self.worksheet_name}!{column}{row_number}",
                                'values': [[formatted_value]]
                            })
                        else:
                            updates.append({
                                'range': f"{self.worksheet_name}!{column}{row_number}",
                                'values': [[str(value)]]
                            })
            
            return {
                'updates': updates,
                'row_number': row_number
            }
            
        except Exception as e:
            logger.error(f"❌ Erreur préparation requête: {e}")
            return None
    
    async def batch_update(self, batch_requests) -> bool:
        """
        Exécute un batch update
        
        Args:
            batch_requests: Liste des requêtes préparées
            
        Returns:
            bool: True si succès
        """
        try:
            service = self.user_manager.get_service()
            
            # Collecter toutes les mises à jour
            all_updates = []
            for request in batch_requests:
                if 'updates' in request:
                    all_updates.extend(request['updates'])
            
            if all_updates:
                body = {
                    'valueInputOption': 'USER_ENTERED',  # Permet les formules
                    'data': all_updates
                }
                
                result = service.spreadsheets().values().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body=body
                ).execute()
                
                updated_cells = result.get('totalUpdatedCells', 0)
                logger.info(f"✅ Batch update: {updated_cells} cellules mises à jour")
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur batch update: {e}")
            return False
