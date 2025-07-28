#!/usr/bin/env python3
"""
Gestionnaire des services et dossiers Google Drive pour thumbnails
Module focalisé sur la configuration Drive
"""

import logging
from typing import Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class DriveManager:
    """Gestionnaire des services et dossiers Google Drive pour thumbnails."""
    
    def __init__(self, config_manager=None):
        """
        Initialiser le gestionnaire Drive.
        
        Args:
            config_manager: Instance du ConfigManager
        """
        self.config_manager = config_manager
        self._drive_service = None
        self._thumbnails_folder_id = None
    
    def setup_drive_service(self) -> bool:
        """Configure le service Google Drive."""
        try:
            if self._drive_service:
                return True
            
            if not self.config_manager or not hasattr(self.config_manager, 'google_connection_manager'):
                logger.error("❌ GoogleConnectionManager non disponible")
                return False
                
            connection_manager = self.config_manager.google_connection_manager
            
            try:
                # Essayer d'abord le service Drive persistant (Service Account)
                self._drive_service = connection_manager.get_drive_service()
                
                if self._drive_service:
                    logger.info("✅ Google Drive configuré via GoogleConnectionManager (Service Account)")
                    
                    # Tester avec un Shared Drive d'abord
                    shared_drive_id = self._get_shared_drive()
                    if shared_drive_id:
                        logger.info("✅ Shared Drive détecté, utilisation du Service Account")
                        return True
                    else:
                        logger.warning("⚠️ Aucun Shared Drive accessible au Service Account")
                        logger.info("🔄 Basculement vers credentials OAuth utilisateur pour éviter les limitations...")
                        
                        # Basculer vers OAuth credentials si possible
                        oauth_service = self._setup_oauth_drive_service(connection_manager)
                        if oauth_service:
                            self._drive_service = oauth_service
                            logger.info("✅ Google Drive configuré via OAuth utilisateur")
                            return True
                        else:
                            logger.error("❌ Impossible de configurer OAuth Drive service")
                            return False
                else:
                    logger.error("❌ Service Drive non disponible dans GoogleConnectionManager")
                    return False
                    
            except Exception as e:
                logger.error(f"❌ Erreur configuration Drive via Service Account: {e}")
                
                # Fallback vers OAuth si possible
                oauth_service = self._setup_oauth_drive_service(connection_manager)
                if oauth_service:
                    self._drive_service = oauth_service
                    logger.info("✅ Google Drive configuré via OAuth utilisateur (fallback)")
                    return True
                else:
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Impossible de configurer Google Drive: {e}")
            return False
    
    def _setup_oauth_drive_service(self, connection_manager):
        """Configure un service Google Drive avec des credentials OAuth utilisateur."""
        try:
            from google.oauth2.credentials import Credentials
            from googleapiclient.discovery import build
            import os
            
            # Vérifier si des credentials OAuth utilisateur sont disponibles
            token_path = os.path.join("config", "token.json")
            
            if os.path.exists(token_path):
                logger.info("🔍 Token OAuth trouvé, tentative d'utilisation...")
                try:
                    creds = Credentials.from_authorized_user_file(token_path)
                    
                    if creds and creds.valid:
                        logger.info("✅ Credentials OAuth valides trouvés")
                        oauth_drive_service = build('drive', 'v3', credentials=creds)
                        return oauth_drive_service
                    elif creds and creds.expired and creds.refresh_token:
                        logger.info("🔄 Rafraîchissement des credentials OAuth...")
                        from google.auth.transport.requests import Request
                        creds.refresh(Request())
                        oauth_drive_service = build('drive', 'v3', credentials=creds)
                        return oauth_drive_service
                    else:
                        logger.warning("⚠️ Credentials OAuth expirés ou invalides")
                        
                except Exception as token_error:
                    logger.warning(f"⚠️ Erreur lecture token OAuth: {token_error}")
            
            # Alternative: Utiliser le service gspread du connection_manager
            try:
                if hasattr(connection_manager, '_credentials') and connection_manager._credentials:
                    creds = connection_manager._credentials
                    if hasattr(creds, 'token') and not hasattr(creds, 'service_account_email'):
                        logger.info("✅ Credentials OAuth trouvés dans GoogleConnectionManager")
                        oauth_drive_service = build('drive', 'v3', credentials=creds)
                        return oauth_drive_service
                        
            except Exception as conn_error:
                logger.debug(f"Impossible d'utiliser credentials du connection_manager: {conn_error}")
            
            logger.warning("⚠️ Aucun credentials OAuth trouvé")
            logger.info("💡 Pour résoudre le problème de quota:")
            logger.info("   1. Créer un Shared Drive et inviter le Service Account")
            logger.info("   2. Ou configurer OAuth credentials utilisateur")
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur setup OAuth Drive service: {e}")
            return None
    
    def setup_drive_folder(self) -> bool:
        """Crée et configure le dossier Google Drive pour les thumbnails."""
        try:
            if not self._drive_service:
                logger.error("❌ Service Drive non configuré")
                return False
            
            logger.info("🔧 Configuration du dossier de stockage thumbnails...")
            
            # Essayer d'abord de détecter les Shared Drives disponibles
            shared_drive_info = self._get_shared_drive()
            
            if shared_drive_info:
                # Utiliser le Shared Drive détecté
                shared_drive_id, shared_drive_name = shared_drive_info
                logger.info(f"✅ Shared Drive détecté: {shared_drive_name} (ID: {shared_drive_id})")
                
                # Configuration pour Shared Drive
                current_month = datetime.now().strftime("%Y-%m")
                project_name = "PostFlow_Project"
                main_folder_name = "PostFlow_Thumbnails"
                
                try:
                    # Créer le dossier principal dans le Shared Drive
                    logger.info(f"📁 Création dossier principal dans Shared Drive: {main_folder_name}")
                    main_folder_id = self._get_or_create_folder_in_shared_drive(main_folder_name, shared_drive_id)
                    logger.info(f"✅ Dossier principal créé/trouvé: {main_folder_id}")
                    
                    # Créer le dossier projet
                    logger.info(f"📁 Création dossier projet: {project_name}")
                    project_folder_id = self._get_or_create_folder_in_shared_drive(project_name, shared_drive_id, main_folder_id)
                    logger.info(f"✅ Dossier projet créé/trouvé: {project_folder_id}")
                    
                    # Créer le dossier du mois
                    logger.info(f"📁 Création dossier mois: {current_month}")
                    self._thumbnails_folder_id = self._get_or_create_folder_in_shared_drive(current_month, shared_drive_id, project_folder_id)
                    logger.info(f"✅ Dossier final configuré dans Shared Drive: {self._thumbnails_folder_id}")
                    
                    # Stocker les infos du Shared Drive
                    self._shared_drive_id = shared_drive_id
                    
                    logger.info(f"📁 Dossier Drive (Shared Drive): {main_folder_name}/{project_name}/{current_month}")
                    return True
                    
                except Exception as e:
                    logger.error(f"❌ Erreur création dossiers dans Shared Drive: {e}")
                    logger.warning("🔄 Fallback vers dossier partagé...")
                    # Continuer vers le fallback ci-dessous
            
            # Fallback vers dossier partagé spécifique
            if not shared_drive_info:
                logger.warning("⚠️ Aucun Shared Drive accessible, utilisation du dossier partagé...")
            
            shared_folder_id = "11ywyx7AQSldrxyJnFIWPV9Atxh-s9jHs"
            logger.info(f"🔧 Configuration dossier partagé ID: {shared_folder_id}")
            
            project_name = "PostFlow_Project"
            current_month = datetime.now().strftime("%Y-%m")
            
            try:
                # Créer le dossier principal dans le dossier partagé
                main_folder_name = "PostFlow_Thumbnails"
                logger.info(f"📁 Création dossier principal: {main_folder_name}")
                main_folder_id = self._get_or_create_folder_in_shared_folder(main_folder_name, shared_folder_id)
                logger.info(f"✅ Dossier principal créé/trouvé: {main_folder_id}")
                
                # Créer le dossier projet
                logger.info(f"📁 Création dossier projet: {project_name}")
                project_folder_id = self._get_or_create_folder_in_shared_folder(project_name, main_folder_id)
                logger.info(f"✅ Dossier projet créé/trouvé: {project_folder_id}")
                
                # Créer le dossier du mois
                logger.info(f"📁 Création dossier mois: {current_month}")
                self._thumbnails_folder_id = self._get_or_create_folder_in_shared_folder(current_month, project_folder_id)
                logger.info(f"✅ Dossier final configuré: {self._thumbnails_folder_id}")
                
                logger.info(f"📁 Dossier Drive (Partagé): {main_folder_name}/{project_name}/{current_month}")
                return True
                
            except Exception as e:
                logger.error(f"❌ Erreur création dossier dans dossier partagé: {e}")
                logger.info("🔄 Fallback vers Drive personnel...")
                
                # Fallback vers Drive personnel
                main_folder_name = "PostFlow_Thumbnails"
                main_folder_id = self._get_or_create_folder_personal(main_folder_name)
                
                if main_folder_id:
                    project_folder_id = self._get_or_create_folder_personal(project_name, main_folder_id)
                    if project_folder_id:
                        self._thumbnails_folder_id = self._get_or_create_folder_personal(current_month, project_folder_id)
                        if self._thumbnails_folder_id:
                            logger.info(f"📁 Dossier Drive (Personnel): {main_folder_name}/{project_name}/{current_month}")
                            return True
                
                return False
            
        except Exception as e:
            logger.error(f"❌ Erreur setup dossier Drive: {e}")
            return False
    
    def _get_shared_drive(self):
        """Détecte et retourne le premier Shared Drive disponible."""
        try:
            logger.info("🔍 Recherche des Shared Drives disponibles...")
            results = self._drive_service.drives().list().execute()
            drives = results.get('drives', [])
            
            if drives:
                logger.info(f"📁 {len(drives)} Shared Drive(s) trouvé(s):")
                for drive in drives:
                    drive_id = drive['id']
                    drive_name = drive['name']
                    logger.info(f"  - {drive_name} (ID: {drive_id})")
                
                first_drive = drives[0]
                drive_id = first_drive['id']
                drive_name = first_drive['name']
                logger.info(f"✅ Utilisation du Shared Drive: {drive_name} (ID: {drive_id})")
                return (drive_id, drive_name)
            else:
                logger.warning("⚠️ Aucun Shared Drive accessible au Service Account")
                logger.info("💡 Le Service Account doit être invité dans un Shared Drive pour éviter les limitations de quota")
                return None
                
        except Exception as e:
            logger.warning(f"⚠️ Erreur accès Shared Drives: {e}")
            logger.info("💡 Vérifiez que le Service Account a accès aux Shared Drives de l'organisation")
            return None
    
    def _get_or_create_folder_in_shared_folder(self, folder_name, parent_id):
        """Trouve ou crée un dossier dans le dossier partagé spécifique."""
        try:
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and '{parent_id}' in parents"
            
            results = self._drive_service.files().list(
                q=query, 
                supportsAllDrives=True,
                includeItemsFromAllDrives=True
            ).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_id]
            }
            
            folder = self._drive_service.files().create(
                body=folder_metadata,
                supportsAllDrives=True
            ).execute()
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier dans dossier partagé '{folder_name}': {e}")
            raise
    
    def _get_or_create_folder_in_shared_drive(self, folder_name, shared_drive_id, parent_id=None):
        """Trouve ou crée un dossier dans un Shared Drive spécifique."""
        try:
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
            if parent_id:
                query += f" and '{parent_id}' in parents"
            
            list_params = {
                'q': query,
                'driveId': shared_drive_id,
                'corpora': 'drive',
                'includeItemsFromAllDrives': True,
                'supportsAllDrives': True
            }
            
            results = self._drive_service.files().list(**list_params).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            
            if parent_id:
                folder_metadata['parents'] = [parent_id]
            else:
                folder_metadata['parents'] = [shared_drive_id]
            
            folder = self._drive_service.files().create(
                body=folder_metadata,
                supportsAllDrives=True
            ).execute()
            
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier Shared Drive '{folder_name}': {e}")
            raise
    
    def _get_or_create_folder_personal(self, folder_name, parent_id=None):
        """Trouve ou crée un dossier dans le Drive personnel."""
        try:
            query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'"
            if parent_id:
                query += f" and '{parent_id}' in parents"
            
            results = self._drive_service.files().list(q=query).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]['id']
            
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            if parent_id:
                folder_metadata['parents'] = [parent_id]
            
            folder = self._drive_service.files().create(body=folder_metadata).execute()
            return folder.get('id')
            
        except Exception as e:
            logger.error(f"❌ Erreur création dossier personnel '{folder_name}': {e}")
            return None
    
    @property 
    def drive_service(self):
        """Accès au service Drive."""
        return self._drive_service
    
    @property
    def thumbnails_folder_id(self):
        """ID du dossier de thumbnails configuré."""
        return self._thumbnails_folder_id
