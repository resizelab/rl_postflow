#!/usr/bin/env python3
"""
Adaptateur optimisé pour SheetsStatusTracker
Utilise le GoogleConnectionManager pour les connexions persistantes
"""

import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)


class OptimizedSheetsStatusAdapter:
    """
    Adaptateur optimisé qui utilise des connexions persistantes Google
    """
    
    def __init__(self, connection_manager, spreadsheet_id: str, worksheet_name: str = "SHOTS_TRACK"):
        """
        Initialise l'adaptateur optimisé
        
        Args:
            connection_manager: GoogleConnectionManager instance
            spreadsheet_id: ID du spreadsheet
            worksheet_name: Nom de la worksheet
        """
        self.connection_manager = connection_manager
        self.spreadsheet_id = spreadsheet_id
        self.worksheet_name = worksheet_name
        
        # Cache pour les ranges de colonnes
        self._column_mapping = {
            'status': 'F',              # STATUS (colonne 6)
            'version': 'J',             # VERSION (colonne 10)
            'frameio_link': 'K',        # FRAME_IO_LINK (colonne 11)
            'file_name': 'Q',           # SRC_NAME (colonne 17)
            'thumbnail_url': 'E',       # THUMBNAIL (colonne 5)
            'processing_date': 'Z',     # UPDATED (colonne 26)
            'shot_name': 'A',           # SHOT_NAME (colonne 1)
            'sequence': 'B',            # SEQUENCE (colonne 2)
        }
        
    async def update_status(self, row_number: int, status: str, additional_data: Dict[str, Any] = None) -> bool:
        """
        Met à jour le statut d'un plan dans Google Sheets
        Utilise la connexion persistante pour éviter l'overhead
        
        Args:
            row_number: Numéro de ligne (1-indexé)
            status: Nouveau statut
            additional_data: Données supplémentaires à mettre à jour
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            # Utiliser le service persistant
            service = self.connection_manager.get_sheets_service()
            
            # Préparer les mises à jour par batch
            updates = []
            
            # Mise à jour du statut principal
            status_range = f"{self.worksheet_name}!{self._column_mapping['status']}{row_number}"
            updates.append({
                'range': status_range,
                'values': [[status]]
            })
            
            # Ajouter les données supplémentaires
            if additional_data:
                for field, value in additional_data.items():
                    if field in self._column_mapping and value is not None:
                        column = self._column_mapping[field]
                        range_name = f"{self.worksheet_name}!{column}{row_number}"
                        
                        # Traitement spécial pour thumbnail_url
                        if field == 'thumbnail_url':
                            if str(value).startswith('=IMAGE('):
                                formatted_value = str(value)
                            else:
                                formatted_value = f'=IMAGE("{value}")'
                            logger.info(f"📸 Formule IMAGE ajoutée: {formatted_value}")
                        else:
                            formatted_value = str(value)
                        
                        updates.append({
                            'range': range_name,
                            'values': [[formatted_value]]
                        })
            
            # Exécuter toutes les mises à jour en une seule requête batch
            if updates:
                body = {
                    'valueInputOption': 'USER_ENTERED',  # Pour interpréter les formules
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
            logger.error(f"❌ Erreur mise à jour status ligne {row_number}: {e}")
            return False
    
    async def batch_update_multiple_rows(self, updates: List[Dict[str, Any]]) -> bool:
        """
        Met à jour plusieurs lignes en une seule requête batch
        
        Args:
            updates: Liste de dictionnaires avec 'row_number', 'status', 'additional_data'
            
        Returns:
            bool: True si toutes les mises à jour ont réussi
        """
        try:
            service = self.connection_manager.get_sheets_service()
            
            batch_updates = []
            
            for update in updates:
                row_number = update.get('row_number')
                status = update.get('status')
                additional_data = update.get('additional_data', {})
                
                # Status update
                if status:
                    status_range = f"{self.worksheet_name}!{self._column_mapping['status']}{row_number}"
                    batch_updates.append({
                        'range': status_range,
                        'values': [[status]]
                    })
                
                # Additional data updates
                for field, value in additional_data.items():
                    if field in self._column_mapping and value is not None:
                        column = self._column_mapping[field]
                        range_name = f"{self.worksheet_name}!{column}{row_number}"
                        
                        if field == 'thumbnail_url' and not str(value).startswith('=IMAGE('):
                            value = f'=IMAGE("{value}")'
                        
                        batch_updates.append({
                            'range': range_name,
                            'values': [[str(value)]]
                        })
            
            # Exécuter le batch update
            if batch_updates:
                body = {
                    'valueInputOption': 'USER_ENTERED',
                    'data': batch_updates
                }
                
                result = service.spreadsheets().values().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body=body
                ).execute()
                
                updated_cells = result.get('totalUpdatedCells', 0)
                logger.info(f"✅ Batch update: {updated_cells} cellules mises à jour pour {len(updates)} lignes")
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur batch update: {e}")
            return False
    
    async def find_shot_row(self, shot_name: str) -> Optional[int]:
        """
        Trouve le numéro de ligne d'un shot par son nom
        Utilise la connexion persistante pour une recherche optimisée
        
        Args:
            shot_name: Nom du shot à chercher
            
        Returns:
            int: Numéro de ligne (1-indexé) ou None si non trouvé
        """
        try:
            # Utiliser gspread pour une recherche plus simple
            worksheet = self.connection_manager.get_worksheet(self.spreadsheet_id, self.worksheet_name)
            
            # Rechercher dans la colonne des noms de shots (colonne A)
            shot_cells = worksheet.findall(shot_name, in_column=1)
            
            if shot_cells:
                # Retourner la première occurrence
                return shot_cells[0].row
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur recherche shot {shot_name}: {e}")
            return None
    
    async def get_shot_status(self, shot_name: str) -> Optional[str]:
        """
        Récupère le statut actuel d'un shot
        
        Args:
            shot_name: Nom du shot
            
        Returns:
            str: Statut actuel ou None si non trouvé
        """
        try:
            row_number = await self.find_shot_row(shot_name)
            if not row_number:
                return None
            
            worksheet = self.connection_manager.get_worksheet(self.spreadsheet_id, self.worksheet_name)
            status_cell = worksheet.cell(row_number, 6)  # Colonne F = 6
            
            return status_cell.value
            
        except Exception as e:
            logger.error(f"❌ Erreur récupération status {shot_name}: {e}")
            return None
    
    async def verify_connection(self) -> bool:
        """
        Vérifie que la connexion aux Google Sheets fonctionne
        
        Returns:
            bool: True si la connexion fonctionne
        """
        try:
            return self.connection_manager.test_connection(self.spreadsheet_id)
            
        except Exception as e:
            logger.error(f"❌ Vérification connexion échouée: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Retourne les statistiques de l'adaptateur
        
        Returns:
            Dict: Statistiques
        """
        return {
            'spreadsheet_id': self.spreadsheet_id,
            'worksheet_name': self.worksheet_name,
            'column_mapping': self._column_mapping,
            'connection_manager_stats': self.connection_manager.get_stats()
        }
