#!/usr/bin/env python3
"""
Tracker Google Sheets pour PostFlow
Suit et met à jour le statut des plans dans Google Sheets
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio

from .users import SheetsUserManager
from .mapper import SheetsMapper
from .status import SheetsStatusTracker
from .status_adapter import SheetsStatusTrackerAdapter

logger = logging.getLogger(__name__)


class SheetsTracker:
    """Tracker pour Google Sheets."""
    
    def __init__(self, config_or_spreadsheet_id, user_manager=None, 
                 config_path: str = "config/sheets_mapping.json"):
        """
        Initialiser le tracker.
        
        Args:
            config_or_spreadsheet_id: ConfigManager ou spreadsheet_id
            user_manager: Gestionnaire d'utilisateurs Sheets (optionnel)
            config_path: Chemin vers la configuration du mapping
        """
        if hasattr(config_or_spreadsheet_id, 'get'):
            # C'est un ConfigManager
            self.config = config_or_spreadsheet_id
            self.spreadsheet_id = config_or_spreadsheet_id.get('google_sheets.spreadsheet_id')
            self.user_manager = user_manager  # Utiliser le user_manager passé en paramètre
        else:
            # C'est un spreadsheet_id ou dict
            if isinstance(config_or_spreadsheet_id, dict):
                self.spreadsheet_id = config_or_spreadsheet_id.get('spreadsheet_id')
            else:
                self.spreadsheet_id = config_or_spreadsheet_id
            self.user_manager = user_manager
            self.config = None
        
        self.config_path = config_path
        
        # Composants (optionnels pour éviter les erreurs)
        try:
            if self.user_manager:
                self.mapper = SheetsMapper(config_path)
                # Utiliser l'adaptateur pour SheetsStatusTracker
                self.status_manager = SheetsStatusTrackerAdapter(
                    self.user_manager, 
                    self.spreadsheet_id,
                    worksheet_name="SHOTS_TRACK"
                )
                logger.info("✅ SheetsTracker avec status_manager configuré")
            else:
                # Mode configuré sans user_manager - créer des composants basiques
                logger.warning("⚠️ SheetsTracker en mode basique (sans user_manager)")
                self.mapper = None
                self.status_manager = None
        except Exception as e:
            logger.warning(f"⚠️ Erreur initialisation composants Sheets: {e}")
            self.mapper = None
            self.status_manager = None
        
        # Cache
        self._sheet_cache = {}
        self._last_refresh = None
    
    async def verify_connection(self):
        """Vérifier la connexion à Google Sheets."""
        try:
            # Tester l'accès au spreadsheet
            service = self.user_manager.get_service()
            
            # Obtenir les informations du spreadsheet
            spreadsheet = service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            
            logger.info(f"✅ Connexion Google Sheets OK: {spreadsheet.get('properties', {}).get('title', 'N/A')}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur connexion Google Sheets: {e}")
            return False
    
    async def find_shot_row(self, nomenclature: str, sheet_name: str = None) -> Optional[int]:
        """
        Trouver la ligne d'un plan dans le spreadsheet.
        
        Args:
            nomenclature: Nomenclature du plan
            sheet_name: Nom de la feuille (optionnel)
            
        Returns:
            Optional[int]: Numéro de ligne (1-indexé)
        """
        try:
            # Utiliser le mapper pour trouver la ligne
            mapping = self.mapper.get_mapping()
            
            # Déterminer la feuille
            if sheet_name is None:
                # Utiliser d'abord la worksheet par défaut, puis fallback
                sheet_name = mapping.get("default_sheet", "SHOTS_TRACK")
            
            # Colonne de nomenclature - chercher dans la worksheet spécifique
            nomenclature_col = None
            
            # Essayer de trouver la colonne de nomenclature dans la worksheet
            if sheet_name in mapping.get("worksheets", {}):
                worksheet_mapping = mapping["worksheets"][sheet_name]["mapping"]
                
                # Chercher d'abord shot_full_name (nomenclature complète)
                if "shot_full_name" in worksheet_mapping:
                    col_index = worksheet_mapping["shot_full_name"].get("column_index", 4)
                    nomenclature_col = self._index_to_column(col_index)
                # Sinon chercher shot_name (ID court)
                elif "shot_name" in worksheet_mapping:
                    col_index = worksheet_mapping["shot_name"].get("column_index", 1)
                    nomenclature_col = self._index_to_column(col_index)
                # Fallback vers n'importe quel champ contenant "shot"
                else:
                    for field_name, field_config in worksheet_mapping.items():
                        if "shot" in field_name.lower():
                            col_index = field_config.get("column_index", 1)
                            nomenclature_col = self._index_to_column(col_index)
                            break
            
            # Fallback vers colonne A
            if nomenclature_col is None:
                nomenclature_col = "A"
            
            # Lire la colonne de nomenclature
            service = self.user_manager.get_service()
            range_name = f"{sheet_name}!{nomenclature_col}:{nomenclature_col}"
            
            result = service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            # Chercher la nomenclature
            for row_idx, row in enumerate(values):
                if row and row[0] == nomenclature:
                    return row_idx + 1  # 1-indexé
            
            logger.warning(f"⚠️ Plan non trouvé: {nomenclature}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur recherche plan: {e}")
            return None
    
    async def update_shot_status(self, nomenclature: str, status: str, 
                                additional_data: Dict[str, Any] = None) -> bool:
        """
        Mettre à jour le statut d'un plan.
        
        Args:
            nomenclature: Nomenclature du plan
            status: Nouveau statut
            additional_data: Données supplémentaires
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            # Vérifier si les composants sont disponibles
            if not self.user_manager or not self.mapper or not self.status_manager:
                logger.warning(f"⚠️ SheetsTracker non configuré, simulation de mise à jour:")
                logger.info(f"   📊 Nomenclature: {nomenclature}")
                logger.info(f"   🔄 Statut: {status}")
                if additional_data:
                    logger.info(f"   📝 Données: {additional_data}")
                return True  # Simulation réussie
            
            # Trouver la ligne
            row_number = await self.find_shot_row(nomenclature)
            if row_number is None:
                logger.warning(f"⚠️ Impossible de mettre à jour {nomenclature}: plan non trouvé")
                return False
            
            # Utiliser le status manager
            result = await self.status_manager.update_status(
                row_number=row_number,
                status=status,
                additional_data=additional_data or {}
            )
            
            if result:
                logger.info(f"✅ Statut mis à jour: {nomenclature} -> {status}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour statut: {e}")
            return False
    

            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour Sheets: {e}")
    
    async def update_shot_links(self, nomenclature: str, review_link: str = None, 
                               share_link: str = None) -> bool:
        """
        Mettre à jour les liens Frame.io d'un plan.
        
        Args:
            nomenclature: Nomenclature du plan
            review_link: Lien de review Frame.io
            share_link: Lien de partage Frame.io
            
        Returns:
            bool: True si mis à jour avec succès
        """
        try:
            # Trouver la ligne
            row_number = await self.find_shot_row(nomenclature)
            if row_number is None:
                return False
            
            # Préparer les données
            update_data = {}
            if review_link:
                update_data['review_link'] = review_link
            if share_link:
                update_data['share_link'] = share_link
            
            # Mettre à jour
            result = await self.status_manager.update_links(
                row_number=row_number,
                links=update_data
            )
            
            if result:
                logger.info(f"✅ Liens mis à jour: {nomenclature}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur mise à jour liens: {e}")
            return False
    
    async def get_shot_info(self, nomenclature: str) -> Dict[str, Any]:
        """
        Obtenir les informations d'un plan.
        
        Args:
            nomenclature: Nomenclature du plan
            
        Returns:
            Dict: Informations du plan
        """
        try:
            # Trouver la ligne
            row_number = await self.find_shot_row(nomenclature)
            if row_number is None:
                return {}
            
            # Utiliser le mapper pour obtenir les colonnes
            mapping = self.mapper.get_mapping()
            sheet_name = mapping.get("default_sheet", "Feuille1")
            
            # Lire la ligne complète
            service = self.user_manager.get_service()
            range_name = f"{sheet_name}!{row_number}:{row_number}"
            
            result = service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            if not values or not values[0]:
                return {}
            
            # Mapper les valeurs
            row_data = values[0]
            shot_info = {}
            
            columns = mapping.get("columns", {})
            for field, column in columns.items():
                col_index = self._column_to_index(column)
                if col_index < len(row_data):
                    shot_info[field] = row_data[col_index]
            
            return shot_info
            
        except Exception as e:
            logger.error(f"❌ Erreur obtention info plan: {e}")
            return {}
    
    async def get_all_shots(self) -> List[Dict[str, Any]]:
        """
        Obtenir tous les plans du spreadsheet.
        
        Returns:
            List[Dict]: Liste des plans
        """
        try:
            mapping = self.mapper.get_mapping()
            sheet_name = mapping.get("default_sheet", "Feuille1")
            
            # Lire toutes les données
            service = self.user_manager.get_service()
            range_name = f"{sheet_name}!A:Z"  # Lire toutes les colonnes
            
            result = service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            if not values:
                return []
            
            # Mapper les données
            shots = []
            columns = mapping.get("columns", {})
            
            for row_idx, row_data in enumerate(values[1:], start=2):  # Skip header
                if not row_data:
                    continue
                
                shot_info = {'row_number': row_idx}
                
                for field, column in columns.items():
                    col_index = self._column_to_index(column)
                    if col_index < len(row_data):
                        shot_info[field] = row_data[col_index]
                
                shots.append(shot_info)
            
            return shots
            
        except Exception as e:
            logger.error(f"❌ Erreur obtention tous les plans: {e}")
            return []
    
    def _column_to_index(self, column: str) -> int:
        """Convertir une lettre de colonne en index."""
        result = 0
        for char in column:
            result = result * 26 + (ord(char.upper()) - ord('A') + 1)
        return result - 1
    
    def _index_to_column(self, index: int) -> str:
        """Convertir un index de colonne en lettre."""
        result = ""
        while index > 0:
            index -= 1
            result = chr(ord('A') + index % 26) + result
            index //= 26
        return result or "A"
    
    async def refresh_cache(self):
        """Rafraîchir le cache des données."""
        try:
            self._sheet_cache = {}
            self._last_refresh = datetime.now()
            
            # Pré-charger les données principales
            await self.get_all_shots()
            
            logger.info("✅ Cache Sheets rafraîchi")
            
        except Exception as e:
            logger.error(f"❌ Erreur rafraîchissement cache: {e}")
    
    async def batch_update_shots(self, updates: List[Dict[str, Any]]) -> bool:
        """
        Mettre à jour plusieurs plans en batch.
        
        Args:
            updates: Liste des mises à jour
                    [{"nomenclature": "XXX", "status": "YYY", "data": {...}}]
            
        Returns:
            bool: True si succès
        """
        try:
            # Préparer les mises à jour
            batch_requests = []
            
            for update in updates:
                nomenclature = update.get("nomenclature")
                status = update.get("status")
                data = update.get("data", {})
                
                # Trouver la ligne
                row_number = await self.find_shot_row(nomenclature)
                if row_number is None:
                    continue
                
                # Préparer la requête
                request = await self.status_manager.prepare_update_request(
                    row_number=row_number,
                    status=status,
                    additional_data=data
                )
                
                if request:
                    batch_requests.append(request)
            
            # Exécuter le batch
            if batch_requests:
                result = await self.status_manager.batch_update(batch_requests)
                
                if result:
                    logger.info(f"✅ Batch update: {len(batch_requests)} plans mis à jour")
                
                return result
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur batch update: {e}")
            return False
    
    async def validate_shot_nomenclature(self, nomenclature: str, shot_id: str) -> bool:
        """
        Valide la nomenclature d'un plan contre Google Sheets.
        
        Args:
            nomenclature: Nomenclature du plan (ex: UNDLM_00001)
            shot_id: ID du plan (ex: 00001)
            
        Returns:
            bool: True si la nomenclature est valide
        """
        try:
            if not self.user_manager:
                logger.warning("⚠️ UserManager non disponible, validation ignorée")
                return True
            
            # Pour l'instant, simulation - à implémenter avec la vraie logique
            # Vérifier que le shot_id existe dans Google Sheets
            
            # Simuler la validation pour les patterns connus
            if nomenclature.startswith("UNDLM_") and shot_id.isdigit():
                logger.info(f"✅ Nomenclature valide (simulée): {nomenclature}")
                return True
            
            logger.warning(f"⚠️ Nomenclature non reconnue: {nomenclature}")
            return False
            
        except Exception as e:
            logger.error(f"❌ Erreur validation nomenclature: {e}")
            return False


def create_sheets_tracker(spreadsheet_id: str, user_manager: SheetsUserManager, 
                         config_path: str = None) -> SheetsTracker:
    """
    Créer un tracker Google Sheets.
    
    Args:
        spreadsheet_id: ID du spreadsheet
        user_manager: Gestionnaire d'utilisateurs
        config_path: Chemin de configuration
        
    Returns:
        SheetsTracker: Instance du tracker
    """
    return SheetsTracker(
        spreadsheet_id=spreadsheet_id,
        user_manager=user_manager,
        config_path=config_path or "config/sheets_mapping.json"
    )
