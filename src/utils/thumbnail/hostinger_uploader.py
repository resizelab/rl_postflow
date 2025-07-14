#!/usr/bin/env python3
"""
Module d'upload Hostinger pour thumbnails
Remplace Google Drive par un upload FTP/SFTP vers Hostinger
"""

import os
import ftplib
import paramiko
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class HostingerUploader:
    """Gestionnaire d'upload vers Hostinger via FTP/SFTP."""
    
    def __init__(self, config_path: str = "config/hostinger_config.json"):
        """
        Initialiser l'uploader Hostinger.
        
        Args:
            config_path: Chemin vers le fichier de configuration Hostinger
        """
        self.config_path = config_path
        self.config = self._load_config()
        self.ftp_client = None
        self.sftp_client = None
        self._connection_method = None
        
    def _load_config(self) -> Dict[str, Any]:
        """Charge la configuration Hostinger."""
        try:
            config_file = self.config_path
            if not os.path.exists(config_file):
                # Essayer le fichier exemple
                config_file = self.config_path + ".example"
                if os.path.exists(config_file):
                    logger.warning(f"⚠️ Utilisation du fichier exemple: {config_file}")
                    logger.info("💡 Copiez et configurez: hostinger_config.json.example → hostinger_config.json")
                else:
                    logger.error(f"❌ Fichier de configuration Hostinger non trouvé: {self.config_path}")
                    return {}
            
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            hostinger_config = config.get('hostinger', {})
            if not hostinger_config.get('enabled', False):
                logger.warning("⚠️ Upload Hostinger désactivé dans la configuration")
                
            return hostinger_config
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement de la configuration Hostinger: {e}")
            return {}
    
    def is_enabled(self) -> bool:
        """Vérifie si l'upload Hostinger est activé."""
        return self.config.get('enabled', False) and bool(self.config)
    
    def connect(self) -> bool:
        """Établit une connexion avec le serveur Hostinger."""
        if not self.is_enabled():
            logger.warning("⚠️ Upload Hostinger non configuré ou désactivé")
            return False
            
        upload_config = self.config.get('upload', {})
        method = upload_config.get('method', 'ftp').lower()
        
        try:
            if method == 'ftp':
                return self._connect_ftp()
            elif method == 'sftp':
                return self._connect_sftp()
            else:
                logger.error(f"❌ Méthode d'upload non supportée: {method}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur de connexion Hostinger ({method}): {e}")
            return False
    
    def _connect_ftp(self) -> bool:
        """Connexion FTP."""
        ftp_config = self.config.get('ftp', {})
        
        host = ftp_config.get('host')
        port = ftp_config.get('port', 21)
        username = ftp_config.get('username')
        password = ftp_config.get('password')
        use_ssl = ftp_config.get('use_ssl', False)
        
        if not all([host, username, password]):
            logger.error("❌ Configuration FTP incomplète (host, username, password requis)")
            return False
        
        try:
            logger.info(f"🔗 Connexion FTP à {host}:{port}...")
            
            if use_ssl:
                self.ftp_client = ftplib.FTP_TLS()
            else:
                self.ftp_client = ftplib.FTP()
            
            # Connexion avec timeout
            timeout = self.config.get('upload', {}).get('timeout', 30)
            self.ftp_client.connect(host, port, timeout)
            self.ftp_client.login(username, password)
            
            if use_ssl:
                self.ftp_client.prot_p()  # Protection des données
            
            logger.info("✅ Connexion FTP établie")
            self._connection_method = 'ftp'
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur connexion FTP: {e}")
            self.ftp_client = None
            return False
    
    def _connect_sftp(self) -> bool:
        """Connexion SFTP."""
        sftp_config = self.config.get('sftp', {})
        
        host = sftp_config.get('host')
        port = sftp_config.get('port', 22)
        username = sftp_config.get('username')
        password = sftp_config.get('password')
        private_key_path = sftp_config.get('private_key_path')
        
        if not host or not username:
            logger.error("❌ Configuration SFTP incomplète (host, username requis)")
            return False
        
        if not password and not private_key_path:
            logger.error("❌ Configuration SFTP incomplète (password ou private_key_path requis)")
            return False
        
        try:
            logger.info(f"🔗 Connexion SFTP à {host}:{port}...")
            
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            # Connexion avec clé privée ou mot de passe
            if private_key_path and os.path.exists(private_key_path):
                ssh_client.connect(host, port, username, key_filename=private_key_path)
            else:
                ssh_client.connect(host, port, username, password)
            
            self.sftp_client = ssh_client.open_sftp()
            logger.info("✅ Connexion SFTP établie")
            self._connection_method = 'sftp'
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur connexion SFTP: {e}")
            self.sftp_client = None
            return False
    
    def upload_thumbnail(self, local_file_path: str, shot_id: str, version: str) -> Optional[str]:
        """
        Upload un thumbnail vers Hostinger.
        
        Args:
            local_file_path: Chemin local du fichier
            shot_id: ID du shot
            version: Version du shot
            
        Returns:
            URL publique du fichier uploadé ou None si échec
        """
        if not self.is_enabled():
            logger.warning("⚠️ Upload Hostinger non configuré")
            return None
            
        if not os.path.exists(local_file_path):
            logger.error(f"❌ Fichier local non trouvé: {local_file_path}")
            return None
        
        # Connexion si nécessaire
        if not self._is_connected():
            if not self.connect():
                return None
        
        try:
            # Générer le chemin distant
            remote_path = self._generate_remote_path(local_file_path, shot_id, version)
            remote_dir = os.path.dirname(remote_path)
            
            # Créer les répertoires si nécessaire
            if self.config.get('upload', {}).get('create_directories', True):
                self._ensure_remote_directory(remote_dir)
            
            # Upload avec retry
            retry_attempts = self.config.get('upload', {}).get('retry_attempts', 3)
            retry_delay = self.config.get('upload', {}).get('retry_delay', 2)
            
            for attempt in range(retry_attempts):
                try:
                    logger.info(f"📤 Upload tentative {attempt + 1}/{retry_attempts}: {os.path.basename(local_file_path)}")
                    
                    if self._connection_method == 'ftp':
                        self._upload_ftp(local_file_path, remote_path)
                    elif self._connection_method == 'sftp':
                        self._upload_sftp(local_file_path, remote_path)
                    
                    # Générer l'URL publique
                    public_url = self._generate_public_url(remote_path)
                    logger.info(f"✅ Upload réussi: {public_url}")
                    return public_url
                    
                except Exception as e:
                    logger.warning(f"⚠️ Tentative {attempt + 1} échouée: {e}")
                    if attempt < retry_attempts - 1:
                        import time
                        time.sleep(retry_delay)
                        # Reconnecter si nécessaire
                        self.disconnect()
                        if not self.connect():
                            break
                    else:
                        logger.error(f"❌ Échec upload après {retry_attempts} tentatives")
                        
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'upload: {e}")
            return None
    
    def _is_connected(self) -> bool:
        """Vérifie si la connexion est active."""
        try:
            if self._connection_method == 'ftp' and self.ftp_client:
                self.ftp_client.voidcmd("NOOP")
                return True
            elif self._connection_method == 'sftp' and self.sftp_client:
                self.sftp_client.listdir('.')
                return True
        except:
            pass
        return False
    
    def _generate_remote_path(self, local_file_path: str, shot_id: str, version: str) -> str:
        """Génère le chemin distant du fichier."""
        upload_config = self.config.get('upload', {})
        thumbnails_config = self.config.get('thumbnails', {})
        
        base_path = upload_config.get('remote_path', '/public_html/thumbnails')
        
        # Organisation par date si activée
        if thumbnails_config.get('organize_by_date', True):
            date_format = thumbnails_config.get('date_format', '%Y/%m')
            date_path = datetime.now().strftime(date_format)
            base_path = os.path.join(base_path, date_path)
        
        # Nommage du fichier
        file_naming = thumbnails_config.get('file_naming', '{shot_id}_{version}_{timestamp}.jpg')
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        filename = file_naming.format(
            shot_id=shot_id,
            version=version,
            timestamp=timestamp
        )
        
        # Extension du fichier original
        original_ext = os.path.splitext(local_file_path)[1]
        if '.' not in filename:
            filename += original_ext
        
        return os.path.join(base_path, filename).replace('\\', '/')
    
    def _generate_public_url(self, remote_path: str) -> str:
        """Génère l'URL publique du fichier."""
        upload_config = self.config.get('upload', {})
        url_base = upload_config.get('url_base', 'https://votre-site.com/thumbnails')
        
        # Enlever le préfixe remote_path de base
        remote_base = upload_config.get('remote_path', '/public_html/thumbnails')
        if remote_path.startswith(remote_base):
            relative_path = remote_path[len(remote_base):].lstrip('/')
        else:
            relative_path = os.path.basename(remote_path)
        
        return f"{url_base.rstrip('/')}/{relative_path}"
    
    def _ensure_remote_directory(self, remote_dir: str):
        """Crée les répertoires distants si nécessaire."""
        if not remote_dir or remote_dir == '/':
            return
        
        try:
            if self._connection_method == 'ftp':
                self._ensure_ftp_directory(remote_dir)
            elif self._connection_method == 'sftp':
                self._ensure_sftp_directory(remote_dir)
        except Exception as e:
            logger.warning(f"⚠️ Erreur création répertoire {remote_dir}: {e}")
    
    def _ensure_ftp_directory(self, remote_dir: str):
        """Crée les répertoires FTP récursivement."""
        parts = remote_dir.strip('/').split('/')
        current_path = ''
        
        for part in parts:
            if not part:
                continue
            current_path += '/' + part
            
            try:
                self.ftp_client.cwd(current_path)
            except ftplib.error_perm:
                try:
                    self.ftp_client.mkd(current_path)
                    logger.debug(f"📁 Répertoire FTP créé: {current_path}")
                except ftplib.error_perm as e:
                    if "exists" not in str(e).lower():
                        raise
    
    def _ensure_sftp_directory(self, remote_dir: str):
        """Crée les répertoires SFTP récursivement."""
        parts = remote_dir.strip('/').split('/')
        current_path = ''
        
        for part in parts:
            if not part:
                continue
            current_path += '/' + part
            
            try:
                self.sftp_client.stat(current_path)
            except FileNotFoundError:
                try:
                    self.sftp_client.mkdir(current_path)
                    logger.debug(f"📁 Répertoire SFTP créé: {current_path}")
                except Exception as e:
                    if "exists" not in str(e).lower():
                        raise
    
    def _upload_ftp(self, local_file: str, remote_path: str):
        """Upload via FTP."""
        with open(local_file, 'rb') as f:
            self.ftp_client.storbinary(f'STOR {remote_path}', f)
        
        # Définir les permissions si configuré
        file_permissions = self.config.get('upload', {}).get('file_permissions')
        if file_permissions:
            try:
                self.ftp_client.voidcmd(f'SITE CHMOD {file_permissions} {remote_path}')
            except:
                pass  # Pas critique si les permissions échouent
    
    def _upload_sftp(self, local_file: str, remote_path: str):
        """Upload via SFTP."""
        self.sftp_client.put(local_file, remote_path)
        
        # Définir les permissions si configuré
        file_permissions = self.config.get('upload', {}).get('file_permissions')
        if file_permissions:
            try:
                # Convertir les permissions octales en int
                perm_int = int(file_permissions, 8)
                self.sftp_client.chmod(remote_path, perm_int)
            except:
                pass  # Pas critique si les permissions échouent
    
    def disconnect(self):
        """Ferme les connexions."""
        try:
            if self.ftp_client:
                self.ftp_client.quit()
                self.ftp_client = None
        except:
            pass
            
        try:
            if self.sftp_client:
                self.sftp_client.close()
                self.sftp_client = None
        except:
            pass
        
        self._connection_method = None
    
    def test_connection(self) -> bool:
        """Test la connexion Hostinger."""
        logger.info("🔧 Test de connexion Hostinger...")
        
        if not self.is_enabled():
            logger.error("❌ Configuration Hostinger manquante ou désactivée")
            return False
        
        if self.connect():
            logger.info("✅ Connexion Hostinger réussie")
            self.disconnect()
            return True
        else:
            logger.error("❌ Échec de connexion Hostinger")
            return False
    
    def __del__(self):
        """Destructeur pour nettoyer les connexions."""
        self.disconnect()
