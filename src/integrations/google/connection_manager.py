#!/usr/bin/env python3
"""
Google Connection Manager
Gestionnaire centralisé de connexions persistantes pour Google APIs
"""

import logging
import threading
from typing import Dict, Optional, Any
from pathlib import Path
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import gspread

logger = logging.getLogger(__name__)


class GoogleConnectionManager:
    """
    Gestionnaire singleton de connexions persistantes Google
    Maintient les connexions ouvertes et les réutilise pour éviter l'overhead
    """
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if hasattr(self, '_initialized'):
            return
            
        self._initialized = True
        self._connections = {}
        self._credentials = None
        self._credentials_file = None
        self._last_refresh = None
        self._refresh_interval = timedelta(minutes=50)  # Refresh avant expiration
        
        logger.info("🔗 GoogleConnectionManager initialized")
    
    def initialize(self, credentials_file: str, spreadsheet_id: str = None):
        """
        Initialise le gestionnaire avec les credentials
        
        Args:
            credentials_file: Chemin vers le fichier de credentials
            spreadsheet_id: ID du spreadsheet principal (optionnel)
        """
        try:
            self._credentials_file = credentials_file
            
            # Vérifier que le fichier existe
            credentials_path = Path(credentials_file)
            if not credentials_path.exists():
                raise FileNotFoundError(f"Credentials file not found: {credentials_path}")
            
            # Charger les credentials
            scopes = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive',
                'https://spreadsheets.google.com/feeds'
            ]
            
            self._credentials = Credentials.from_service_account_file(
                credentials_file, 
                scopes=scopes
            )
            
            self._last_refresh = datetime.now()
            
            # Initialiser les connexions principales
            self._init_core_connections(spreadsheet_id)
            
            logger.info("✅ GoogleConnectionManager initialisé avec succès")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation GoogleConnectionManager: {e}")
            raise
    
    def _init_core_connections(self, spreadsheet_id: str = None):
        """Initialise les connexions principales"""
        try:
            # Service Google Sheets API v4
            self._connections['sheets_v4'] = build(
                'sheets', 'v4', 
                credentials=self._credentials,
                cache_discovery=False  # Éviter les warnings de cache
            )
            
            # Service Google Drive API v3
            self._connections['drive_v3'] = build(
                'drive', 'v3', 
                credentials=self._credentials,
                cache_discovery=False
            )
            
            # Client gspread pour les opérations simplifiées
            self._connections['gspread'] = gspread.authorize(self._credentials)
            
            # Spreadsheet principal si fourni
            if spreadsheet_id:
                self._connections['main_spreadsheet'] = self._connections['gspread'].open_by_key(spreadsheet_id)
            
            logger.info("✅ Connexions Google initialisées")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation connexions: {e}")
            raise
    
    def get_sheets_service(self) -> Any:
        """
        Retourne le service Google Sheets API v4
        
        Returns:
            googleapiclient.discovery.Resource: Service Sheets
        """
        self._check_and_refresh()
        return self._connections.get('sheets_v4')
    
    def get_drive_service(self) -> Any:
        """
        Retourne le service Google Drive API v3
        
        Returns:
            googleapiclient.discovery.Resource: Service Drive
        """
        self._check_and_refresh()
        return self._connections.get('drive_v3')
    
    def get_gspread_client(self) -> gspread.Client:
        """
        Retourne le client gspread
        
        Returns:
            gspread.Client: Client gspread
        """
        self._check_and_refresh()
        return self._connections.get('gspread')
    
    def get_spreadsheet(self, spreadsheet_id: str) -> gspread.Spreadsheet:
        """
        Retourne un spreadsheet par ID (avec cache)
        
        Args:
            spreadsheet_id: ID du spreadsheet
            
        Returns:
            gspread.Spreadsheet: Le spreadsheet
        """
        cache_key = f'spreadsheet_{spreadsheet_id}'
        
        if cache_key not in self._connections:
            client = self.get_gspread_client()
            self._connections[cache_key] = client.open_by_key(spreadsheet_id)
            logger.debug(f"📋 Spreadsheet mis en cache: {spreadsheet_id}")
        
        return self._connections[cache_key]
    
    def get_worksheet(self, spreadsheet_id: str, worksheet_name: str) -> gspread.Worksheet:
        """
        Retourne une worksheet par nom (avec cache)
        
        Args:
            spreadsheet_id: ID du spreadsheet
            worksheet_name: Nom de la worksheet
            
        Returns:
            gspread.Worksheet: La worksheet
        """
        cache_key = f'worksheet_{spreadsheet_id}_{worksheet_name}'
        
        if cache_key not in self._connections:
            spreadsheet = self.get_spreadsheet(spreadsheet_id)
            self._connections[cache_key] = spreadsheet.worksheet(worksheet_name)
            logger.debug(f"📄 Worksheet mise en cache: {worksheet_name}")
        
        return self._connections[cache_key]
    
    def _check_and_refresh(self):
        """Vérifie si un refresh des credentials est nécessaire"""
        if not self._last_refresh:
            return
            
        if datetime.now() - self._last_refresh > self._refresh_interval:
            logger.info("🔄 Refresh des connexions Google...")
            self._refresh_connections()
    
    def _refresh_connections(self):
        """Refresh les connexions Google"""
        try:
            # Refresh des credentials si nécessaire
            if self._credentials.expired:
                self._credentials.refresh()
            
            # Re-créer les services principaux
            self._init_core_connections()
            
            # Nettoyer le cache des spreadsheets/worksheets
            keys_to_remove = [k for k in self._connections.keys() 
                            if k.startswith(('spreadsheet_', 'worksheet_'))]
            for key in keys_to_remove:
                del self._connections[key]
            
            self._last_refresh = datetime.now()
            logger.info("✅ Connexions Google refreshées")
            
        except Exception as e:
            logger.error(f"❌ Erreur refresh connexions: {e}")
            # En cas d'erreur, on recharge tout
            self.initialize(self._credentials_file)
    
    def is_connected(self) -> bool:
        """
        Vérifie si les connexions sont établies
        
        Returns:
            bool: True si connecté
        """
        required_services = ['sheets_v4', 'drive_v3', 'gspread']
        return all(service in self._connections for service in required_services)
    
    def test_connection(self, spreadsheet_id: str = None) -> bool:
        """
        Teste la connexion avec un appel API simple
        
        Args:
            spreadsheet_id: ID du spreadsheet à tester (optionnel)
            
        Returns:
            bool: True si la connexion fonctionne
        """
        try:
            if spreadsheet_id:
                # Test avec un spreadsheet spécifique
                sheets_service = self.get_sheets_service()
                result = sheets_service.spreadsheets().get(
                    spreadsheetId=spreadsheet_id
                ).execute()
                logger.info(f"✅ Test connexion réussi: {result.get('properties', {}).get('title', 'Unknown')}")
            else:
                # Test simple avec Drive
                drive_service = self.get_drive_service()
                result = drive_service.about().get(fields='user').execute()
                logger.info(f"✅ Test connexion réussi: {result.get('user', {}).get('emailAddress', 'Unknown')}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test connexion échoué: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Retourne les statistiques du gestionnaire
        
        Returns:
            Dict: Statistiques
        """
        return {
            'connected': self.is_connected(),
            'cached_connections': len(self._connections),
            'last_refresh': self._last_refresh.isoformat() if self._last_refresh else None,
            'credentials_file': self._credentials_file,
            'connection_types': list(self._connections.keys())
        }


# Instance globale singleton
connection_manager = GoogleConnectionManager()
