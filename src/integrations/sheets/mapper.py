#!/usr/bin/env python3
"""
Helper pour le mapping dynamique des colonnes Google Sheets.
Permet à PostFlow de s'adapter automatiquement à n'importe quelle organisation de colonnes.
"""
import json
import os
from typing import Dict, List, Optional, Any, Tuple

class SheetsMapper:
    """Gestionnaire du mapping dynamique des colonnes Google Sheets."""
    
    def __init__(self, mapping_file: str = "config/sheets_mapping.json"):
        """
        Initialiser le mapper avec le fichier de configuration.
        
        Args:
            mapping_file: Chemin vers le fichier de mapping
        """
        self.mapping_file = mapping_file
        self.mapping = self._load_mapping()
    
    def _load_mapping(self) -> Dict:
        """Charger le mapping depuis le fichier JSON."""
        try:
            with open(self.mapping_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Fichier de mapping non trouvé: {self.mapping_file}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Erreur dans le fichier de mapping: {e}")
    
    def get_column_index(self, worksheet: str, field: str) -> Optional[int]:
        """
        Obtenir l'index de colonne pour un champ donné.
        
        Args:
            worksheet: Nom de la worksheet (ex: 'SHOTS_TRACK', 'USERS_INFOS')
            field: Nom du champ (ex: 'shot_name', 'email')
        
        Returns:
            Index de la colonne (basé 1) ou None si non trouvé
        """
        try:
            return self.mapping['worksheets'][worksheet]['mapping'][field]['column_index']
        except KeyError:
            return None
    
    def get_column_name(self, worksheet: str, field: str) -> Optional[str]:
        """
        Obtenir le nom de colonne pour un champ donné.
        
        Args:
            worksheet: Nom de la worksheet
            field: Nom du champ
        
        Returns:
            Nom de la colonne ou None si non trouvé
        """
        try:
            return self.mapping['worksheets'][worksheet]['mapping'][field]['column_name']
        except KeyError:
            return None
    
    def get_field_by_column_index(self, worksheet: str, column_index: int) -> Optional[str]:
        """
        Obtenir le nom du champ pour un index de colonne donné.
        
        Args:
            worksheet: Nom de la worksheet
            column_index: Index de la colonne (basé 1)
        
        Returns:
            Nom du champ ou None si non trouvé
        """
        try:
            for field, config in self.mapping['worksheets'][worksheet]['mapping'].items():
                if config['column_index'] == column_index:
                    return field
            return None
        except KeyError:
            return None
    
    def get_all_fields(self, worksheet: str) -> List[str]:
        """
        Obtenir tous les champs mappés pour une worksheet.
        
        Args:
            worksheet: Nom de la worksheet
        
        Returns:
            Liste des noms de champs
        """
        try:
            return list(self.mapping['worksheets'][worksheet]['mapping'].keys())
        except KeyError:
            return []
    
    def get_required_fields(self, worksheet: str) -> List[str]:
        """
        Obtenir les champs obligatoires pour une worksheet.
        
        Args:
            worksheet: Nom de la worksheet
        
        Returns:
            Liste des champs obligatoires
        """
        try:
            fields = []
            for field, config in self.mapping['worksheets'][worksheet]['mapping'].items():
                if config.get('required', False):
                    fields.append(field)
            return fields
        except KeyError:
            return []
    
    def map_row_to_dict(self, worksheet: str, row_values: List[Any]) -> Dict[str, Any]:
        """
        Convertir une ligne de données en dictionnaire avec les noms de champs.
        
        Args:
            worksheet: Nom de la worksheet
            row_values: Valeurs de la ligne (liste)
        
        Returns:
            Dictionnaire avec les noms de champs comme clés
        """
        result = {}
        try:
            for field, config in self.mapping['worksheets'][worksheet]['mapping'].items():
                column_index = config['column_index']
                # Index basé 1 -> basé 0 pour accès à la liste
                if column_index <= len(row_values):
                    value = row_values[column_index - 1] if column_index - 1 < len(row_values) else ""
                    result[field] = value
                else:
                    result[field] = ""
            return result
        except KeyError:
            return {}
    
    def map_dict_to_row(self, worksheet: str, data_dict: Dict[str, Any], 
                        total_columns: Optional[int] = None) -> List[Any]:
        """
        Convertir un dictionnaire en ligne de données pour écriture.
        
        Args:
            worksheet: Nom de la worksheet
            data_dict: Dictionnaire avec les données
            total_columns: Nombre total de colonnes (pour padding)
        
        Returns:
            Liste de valeurs dans l'ordre des colonnes
        """
        try:
            # Déterminer le nombre de colonnes
            if total_columns is None:
                total_columns = self.mapping['worksheets'][worksheet]['total_columns']
            
            # Créer une ligne vide
            row = [""] * total_columns
            
            # Remplir avec les données mappées
            for field, value in data_dict.items():
                column_index = self.get_column_index(worksheet, field)
                if column_index and column_index <= total_columns:
                    row[column_index - 1] = str(value) if value is not None else ""
            
            return row
        except KeyError:
            return []
    
    def get_primary_key_field(self, worksheet: str) -> Optional[str]:
        """
        Obtenir le champ clé primaire pour une worksheet.
        
        Args:
            worksheet: Nom de la worksheet
        
        Returns:
            Nom du champ clé primaire
        """
        compatibility = self.mapping.get('postflow_compatibility', {})
        if worksheet == 'SHOTS_TRACK':
            return compatibility.get('shots_primary_key')
        elif worksheet == 'USERS_INFOS':
            return compatibility.get('users_primary_key')
        return None
    
    def get_notification_field(self) -> Optional[str]:
        """
        Obtenir le champ pour les notifications (Discord ID).
        
        Returns:
            Nom du champ pour les notifications
        """
        return self.mapping.get('postflow_compatibility', {}).get('notifications_user_field')
    
    def validate_worksheet_structure(self, worksheet: str, headers: List[str]) -> Tuple[bool, List[str]]:
        """
        Valider que la structure de la worksheet correspond au mapping.
        
        Args:
            worksheet: Nom de la worksheet
            headers: Liste des headers de la première ligne
        
        Returns:
            Tuple (is_valid, list_of_errors)
        """
        errors = []
        
        try:
            mapping = self.mapping['worksheets'][worksheet]['mapping']
            
            # Vérifier les champs obligatoires
            for field, config in mapping.items():
                if config.get('required', False):
                    column_index = config['column_index']
                    expected_name = config['column_name']
                    
                    if column_index > len(headers):
                        errors.append(f"Colonne manquante: {expected_name} (position {column_index})")
                    elif headers[column_index - 1] != expected_name:
                        actual_name = headers[column_index - 1]
                        errors.append(f"Nom de colonne incorrect: attendu '{expected_name}', trouvé '{actual_name}' à la position {column_index}")
            
            return len(errors) == 0, errors
            
        except KeyError as e:
            return False, [f"Worksheet non trouvée dans le mapping: {worksheet}"]
    
    def get_missing_columns(self, worksheet: str) -> Dict[str, Dict]:
        """
        Obtenir les colonnes manquantes suggérées pour une worksheet.
        
        Args:
            worksheet: Nom de la worksheet
        
        Returns:
            Dictionnaire des colonnes manquantes
        """
        try:
            return self.mapping['worksheets'][worksheet].get('additional_columns_needed', {})
        except KeyError:
            return {}
    
    def print_mapping_summary(self, worksheet: str = None):
        """
        Afficher un résumé du mapping.
        
        Args:
            worksheet: Nom spécifique de la worksheet, ou None pour toutes
        """
        print("📋 RÉSUMÉ DU MAPPING DYNAMIQUE")
        print("=" * 50)
        
        if worksheet:
            worksheets = [worksheet]
        else:
            worksheets = list(self.mapping['worksheets'].keys())
        
        for ws in worksheets:
            if ws in self.mapping['worksheets']:
                ws_config = self.mapping['worksheets'][ws]
                print(f"\n📊 {ws}:")
                print(f"   Description: {ws_config.get('description', 'N/A')}")
                print(f"   Colonnes totales: {ws_config.get('total_columns', 0)}")
                print(f"   Champs mappés: {len(ws_config.get('mapping', {}))}")
                
                print(f"   🔗 Mapping:")
                for field, config in ws_config.get('mapping', {}).items():
                    required = "✅" if config.get('required') else "⚪"
                    print(f"      {required} {field}: Col.{config['column_index']} '{config['column_name']}'")
                
                missing = ws_config.get('additional_columns_needed', {})
                if missing:
                    print(f"   ❌ Colonnes manquantes suggérées:")
                    for field, config in missing.items():
                        print(f"      • {field}: '{config['suggested_column']}'")


# Fonction utilitaire pour créer une instance globale
_mapper_instance = None

def get_sheets_mapper() -> SheetsMapper:
    """Obtenir l'instance singleton du mapper."""
    global _mapper_instance
    if _mapper_instance is None:
        _mapper_instance = SheetsMapper()
    return _mapper_instance

# Fonctions utilitaires directes
def get_column_index(worksheet: str, field: str) -> Optional[int]:
    """Raccourci pour obtenir l'index d'une colonne."""
    return get_sheets_mapper().get_column_index(worksheet, field)

def get_column_name(worksheet: str, field: str) -> Optional[str]:
    """Raccourci pour obtenir le nom d'une colonne."""
    return get_sheets_mapper().get_column_name(worksheet, field)

def map_row_to_dict(worksheet: str, row_values: List[Any]) -> Dict[str, Any]:
    """Raccourci pour mapper une ligne vers un dictionnaire."""
    return get_sheets_mapper().map_row_to_dict(worksheet, row_values)

def map_dict_to_row(worksheet: str, data_dict: Dict[str, Any]) -> List[Any]:
    """Raccourci pour mapper un dictionnaire vers une ligne."""
    return get_sheets_mapper().map_dict_to_row(worksheet, data_dict)
