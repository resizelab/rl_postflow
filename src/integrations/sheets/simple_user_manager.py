#!/usr/bin/env python3
"""
Simple Google Sheets User Manager pour SheetsTracker
Compatible avec l'interface attendue par SheetsTracker
"""

import logging
from typing import Optional
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)


class SimpleGoogleSheetsUserManager:
    """
    Simple user manager pour SheetsTracker
    Fournit l'interface get_service() attendue par SheetsTracker
    """
    
    def __init__(self, credentials_file: str = "config/google_credentials.json"):
        """
        Initialise avec le fichier de credentials
        
        Args:
            credentials_file: Chemin vers le fichier de credentials Google
        """
        self.credentials_file = credentials_file
        self._service = None
        
    def get_service(self):
        """
        Retourne le service Google Sheets API
        
        Returns:
            Service Google Sheets API
        """
        if self._service is None:
            try:
                # Scopes requis pour Google Sheets
                scopes = [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive'
                ]
                
                # Charger les credentials
                creds = Credentials.from_service_account_file(
                    self.credentials_file, 
                    scopes=scopes
                )
                
                # Créer le service
                self._service = build('sheets', 'v4', credentials=creds)
                
                logger.info("✅ Service Google Sheets API créé")
                
            except Exception as e:
                logger.error(f"❌ Erreur création service Google Sheets: {e}")
                raise
                
        return self._service
    
    def test_connection(self, spreadsheet_id: str) -> bool:
        """
        Teste la connexion au spreadsheet
        
        Args:
            spreadsheet_id: ID du spreadsheet à tester
            
        Returns:
            bool: True si la connexion fonctionne
        """
        try:
            service = self.get_service()
            
            # Tester l'accès au spreadsheet
            spreadsheet = service.spreadsheets().get(
                spreadsheetId=spreadsheet_id
            ).execute()
            
            title = spreadsheet.get('properties', {}).get('title', 'N/A')
            logger.info(f"✅ Accès au spreadsheet: {title}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur test connexion: {e}")
            return False
