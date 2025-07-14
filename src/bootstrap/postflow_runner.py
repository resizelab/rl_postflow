#!/usr/bin/env python3
"""
🚀 PostFlow Runner - Bootstrap Module
====================================

Contient la boucle principale du pipeline et le workflow de traitement.
Extrait de main.py pour une meilleure organisation.

Version: 4.1.5
Date: 14 juillet 2025
"""

import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from src.utils.config import ConfigManager

# Version du pipeline (synchronisée avec main.py)
POSTFLOW_VERSION = "4.1.5"
POSTFLOW_VERSION_NAME = "Emojis & Duplicate Detection Complete"

logger = logging.getLogger(__name__)

try:
    from src.utils.upload_tracker import UploadTracker
    from src.integrations.sheets.tracker import SheetsTracker
    from src.utils.thumbnail import ThumbnailGenerator
    from src.integrations.discord.notifier import DiscordNotifier
    from src.integrations.discord.user_notifier import DiscordUserNotifier
    from src.integrations.sheets.users import SheetsUserManager
    from src.utils.error_handler import ErrorHandler
    from src.utils.upload_queue import UploadQueue, QueuePriority
    PIPELINE_MODULES_AVAILABLE = True
except ImportError as e:
    logger.error(f"Pipeline modules not available: {e}")
    PIPELINE_MODULES_AVAILABLE = False

try:
    from src.utils.lucidlink_utils import lucidlink_waiter, lucidlink_detector
    LUCIDLINK_UTILS_AVAILABLE = True
except ImportError as e:
    logger.error(f"LucidLink utils not available: {e}")
    LUCIDLINK_UTILS_AVAILABLE = False


class PostFlowRunner:
    """Gestionnaire de la boucle principale du pipeline"""
    
    def __init__(self, config: Dict[str, Any], pipeline_config: Dict[str, Any], config_manager: ConfigManager):
        self.config = config
        self.pipeline_config = pipeline_config
        self.config_manager = config_manager
        
        # Composants du pipeline
        self.frameio_auth = None
        self.frameio_manager = None
        self.watcher = None
        self.dashboard_initializer = None
        self.infrastructure_manager = None
        self.error_handler = None
        
        # Intégrations
        self.upload_tracker = None
        self.sheets_tracker = None
        self.thumbnail_generator = None
        self.discord_notifier = None
        self.user_notifier = None
        self.upload_queue = None
        
        # État du pipeline
        self.is_running = False
        self._shutdown_event = asyncio.Event()
        self._event_loop = None
        
        # Métriques
        self.metrics = {
            'start_time': datetime.now(),
            'files_processed': 0,
            'uploads_success': 0,
            'uploads_failed': 0,
            'token_refreshes': 0,
            'last_token_refresh': None,
            'last_activity': None
        }
        
        # Configuration de l'intervalle de vérification du token
        self.token_check_interval = pipeline_config.get('metrics', {}).get('token_check_interval', 300)
    
    def initialize_components(self, frameio_auth, frameio_manager, watcher, dashboard_initializer, 
                            infrastructure_manager, error_handler):
        """Initialise les composants du pipeline"""
        self.frameio_auth = frameio_auth
        self.frameio_manager = frameio_manager
        self.watcher = watcher
        self.dashboard_initializer = dashboard_initializer
        self.infrastructure_manager = infrastructure_manager
        self.error_handler = error_handler
        
        # Initialiser les intégrations
        self._initialize_integrations()
    
    def _initialize_integrations(self):
        """Initialise les intégrations (tracker, sheets, etc.)"""
        try:
            if not PIPELINE_MODULES_AVAILABLE:
                logger.warning("⚠️ Modules pipeline non disponibles")
                return
            
            logger.info("🔧 Initialisation des intégrations...")
            
            # Initialiser le tracker d'uploads
            self.upload_tracker = UploadTracker()
            
            # Initialiser le tracker Google Sheets avec connexions persistantes
            sheets_config = self.config.get('google_sheets', {})
            if sheets_config.get('enabled', True):
                try:
                    # Initialiser le gestionnaire de connexions Google persistantes
                    from src.integrations.google import connection_manager, OptimizedSheetsStatusAdapter
                    
                    credentials_file = sheets_config.get('service_account_file', 'config/google_credentials.json')
                    spreadsheet_id = sheets_config.get('spreadsheet_id')
                    
                    # Initialiser le gestionnaire avec les credentials
                    connection_manager.initialize(credentials_file, spreadsheet_id)
                    
                    # Ajouter le GoogleConnectionManager au config_manager pour les autres composants
                    self.config_manager.google_connection_manager = connection_manager
                    
                    # Tester la connexion
                    if connection_manager.test_connection(spreadsheet_id):
                        # Créer l'adaptateur optimisé pour Sheets
                        worksheet_name = sheets_config.get('worksheet_shots_tracks', 'SHOTS_TRACK')
                        self.sheets_adapter = OptimizedSheetsStatusAdapter(
                            connection_manager, 
                            spreadsheet_id, 
                            worksheet_name
                        )
                        
                        # Créer le tracker avec l'adaptateur optimisé et le GoogleConnectionManager
                        self.sheets_tracker = SheetsTracker(spreadsheet_id, user_manager=connection_manager)
                        self.sheets_tracker.status_adapter = self.sheets_adapter
                        
                        logger.info("✅ Google Sheets tracker initialisé avec connexions persistantes")
                        logger.info(f"📊 Stats connexions: {connection_manager.get_stats()}")
                    else:
                        logger.warning("⚠️ Test connexion Google Sheets échoué, mode simulation")
                        self.sheets_tracker = SheetsTracker(spreadsheet_id)
                        self.sheets_adapter = None
                        
                except Exception as e:
                    logger.warning(f"⚠️ Erreur initialisation connexions Google persistantes: {e}")
                    logger.warning("⚠️ Fallback vers mode simulation")
                    self.sheets_tracker = SheetsTracker(sheets_config.get('spreadsheet_id'))
                    self.sheets_adapter = None
            
            # Initialiser le générateur de thumbnails
            thumbnail_config = self.config.get('thumbnails', {})
            if thumbnail_config.get('enabled', True):
                self.thumbnail_generator = ThumbnailGenerator(self.config_manager)
            
            # Initialiser le notificateur Discord
            discord_config = self.config.get('discord', {})
            if discord_config.get('enabled', True):
                try:
                    # Vérifier que l'URL webhook est présente
                    webhook_url = discord_config.get('webhook_url')
                    if not webhook_url or webhook_url == "YOUR_WEBHOOK_URL":
                        logger.warning("⚠️ Discord webhook URL non configurée, notifications désactivées")
                        self.discord_notifier = None
                    else:
                        # Créer un wrapper de configuration pour DiscordNotifier
                        class DiscordConfigWrapper:
                            def __init__(self, discord_config):
                                self.discord_config = discord_config
                            
                            def get(self, key, default=None):
                                if key == 'discord.webhook_url':
                                    return self.discord_config.get('webhook_url', default)
                                elif key == 'discord.username':
                                    return self.discord_config.get('username', default)
                                elif key == 'discord.avatar_url':
                                    return self.discord_config.get('avatar_url', default)
                                return default
                        
                        config_wrapper = DiscordConfigWrapper(discord_config)
                        self.discord_notifier = DiscordNotifier(config_wrapper)
                        
                        # Initialiser le User Notifier avec intégration Google Sheets
                        try:
                            # Utiliser le user_manager existant du sheets_tracker si disponible
                            if self.sheets_tracker and hasattr(self.sheets_tracker, 'user_manager') and self.sheets_tracker.user_manager:
                                user_manager = self.sheets_tracker.user_manager
                                self.user_notifier = DiscordUserNotifier(
                                    discord_notifier=self.discord_notifier,
                                    user_manager=user_manager
                                )
                                logger.info("✅ Discord User Notifier initialisé avec intégration Google Sheets")
                            else:
                                logger.info("ℹ️ Pas d'user_manager disponible, utilisation du Discord Notifier standard")
                                self.user_notifier = None
                        except Exception as e:
                            logger.warning(f"⚠️ Impossible d'initialiser User Notifier: {e}")
                            logger.info("🔄 Utilisation du Discord Notifier standard")
                            self.user_notifier = None
                        
                        logger.info("✅ Discord notifier initialisé")
                except Exception as e:
                    logger.warning(f"⚠️ Erreur initialisation Discord: {e}")
                    self.discord_notifier = None
            
            # Initialiser la queue d'upload
            queue_config = self.pipeline_config.get('upload_queue', {})
            max_concurrent = queue_config.get('max_concurrent', 1)  # Séquentiel par défaut
            max_queue_size = queue_config.get('max_queue_size', 100)
            
            self.upload_queue = UploadQueue(
                max_concurrent=max_concurrent,
                max_queue_size=max_queue_size
            )
            
            # Définir le callback de traitement
            self.upload_queue.set_process_callback(self._queue_file_processor)
            
            logger.info(f"📋 Queue d'upload initialisée (max_concurrent={max_concurrent}, max_queue_size={max_queue_size})")
            
            logger.info("✅ Intégrations initialisées avec succès")
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur lors de l'initialisation des intégrations: {e}")
    
    async def run_pipeline(self):
        f"""Lance le pipeline principal PostFlow v{POSTFLOW_VERSION}"""
        logger.info(f"🚀 Démarrage du pipeline PostFlow v{POSTFLOW_VERSION}...")
        
        # Stocker la boucle d'événements pour les callbacks
        self._event_loop = asyncio.get_running_loop()
        
        # Vérifier les composants essentiels
        if not self.frameio_manager:
            logger.error("[ERROR] Frame.io requis pour le fonctionnement")
            return False
        
        if not self.watcher:
            logger.error("[ERROR] Watcher requis pour le fonctionnement")
            return False
        
        self.is_running = True
        
        # Vérification de synchronisation au démarrage
        logger.info("🔍 Lancement de la vérification de synchronisation...")
        sync_ok = await self.startup_sync_check()
        if sync_ok:
            logger.info("✅ Vérification de synchronisation terminée")
        else:
            logger.warning("⚠️ Vérification de synchronisation échouée")
        
        # Boucle principale
        try:
            logger.info(f"🔄 Pipeline PostFlow v{POSTFLOW_VERSION} en cours d'exécution...")
            
            # Démarrer la queue d'upload
            if self.upload_queue:
                await self.upload_queue.start()
            
            # Démarrer le watcher
            if self.watcher:
                logger.info("👁️ Démarrage de la surveillance des fichiers...")
                self.watcher.start()
            
            # Notification de démarrage
            notifier = self.user_notifier or self.discord_notifier
            if notifier:
                await self._send_discord_notification(
                    f"🚀 PostFlow v{POSTFLOW_VERSION} démarré",
                    f"Le pipeline de traitement {POSTFLOW_VERSION_NAME} est maintenant actif"
                )
            
            # Boucle principale avec arrêt propre
            while self.is_running:
                try:
                    # Vérifier et rafraîchir le token périodiquement
                    if not await self._check_and_refresh_token():
                        logger.error("[ERROR] Problème avec le token Frame.io")
                    
                    # Attendre soit le timeout soit l'événement d'arrêt
                    try:
                        await asyncio.wait_for(self._shutdown_event.wait(), timeout=self.token_check_interval)
                        # Si on arrive ici, l'événement d'arrêt a été déclenché
                        logger.info("[STOP] Événement d'arrêt détecté")
                        break
                    except asyncio.TimeoutError:
                        # Timeout normal, continuer la boucle
                        continue
                        
                except asyncio.CancelledError:
                    logger.info("[STOP] Boucle principale annulée")
                    break
                except Exception as e:
                    logger.error(f"[ERROR] Erreur dans la boucle principale: {e}")
                    # En cas d'erreur, attendre un peu avant de continuer
                    await asyncio.sleep(1)
                    
        except KeyboardInterrupt:
            logger.info("[STOP] Arrêt demandé par l'utilisateur")
        except Exception as e:
            logger.error(f"[ERROR] Erreur dans la boucle principale: {e}")
        finally:
            # Arrêt avec timeout pour éviter les blocages
            try:
                if self.is_running:
                    await asyncio.wait_for(self.shutdown(), timeout=30.0)
            except asyncio.TimeoutError:
                logger.warning("⚠️ Timeout lors de l'arrêt, arrêt forcé")
                self.is_running = False
            except asyncio.CancelledError:
                logger.info("[STOP] Arrêt annulé - signal reçu")
                self.is_running = False
            except Exception as e:
                logger.warning(f"⚠️ Erreur lors de l'arrêt: {e}")
                self.is_running = False
        
        return True
    
    async def _handle_new_file(self, file_path: str, metadata: Dict[str, Any] = None, force: bool = False):
        """Callback pour traiter les nouveaux fichiers détectés"""
        try:
            logger.info(f"🎬 Nouveau fichier détecté: {file_path}")
            
            # Afficher les métadonnées si disponibles
            if metadata:
                logger.info(f"📊 Métadonnées: {metadata}")
            
            # === VÉRIFICATION PRÉALABLE DES DOUBLONS ===
            if self.upload_tracker and not force:
                file_metadata = metadata or self._extract_metadata_from_path(Path(file_path))
                shot_id = file_metadata.get('shot_id', '')
                version = file_metadata.get('version', 'v001')
                
                duplicate = self.upload_tracker.is_duplicate(file_path, shot_id, version)
                if duplicate:
                    status = duplicate.get('status', 'UNKNOWN')
                    if status in ['COMPLETED', '🎉 COMPLETED']:
                        logger.info(f"✅ Fichier déjà traité, ignoré: {Path(file_path).name}")
                        return
                    elif status in ['CREATED', 'PROCESSING', 'REPROCESSING', '⏳ WAITING_APPROVAL', '🔄 UPLOADING', '⚙️ PROCESSING', '🔄 REPROCESSING']:
                        logger.info(f"🔄 Fichier déjà en traitement, ignoré: {Path(file_path).name}")
                        return
            
            # Ajouter le fichier à la queue au lieu de le traiter directement
            if self.upload_queue:
                # Déterminer la priorité basée sur les métadonnées
                priority = QueuePriority.NORMAL
                if metadata and metadata.get('urgent'):
                    priority = QueuePriority.HIGH
                elif force:
                    priority = QueuePriority.HIGH
                
                queue_id = await self.upload_queue.add_file(
                    Path(file_path),
                    priority=priority,
                    force=force,
                    metadata=metadata
                )
                
                logger.info(f"📋 Fichier ajouté à la queue: {Path(file_path).name} (ID: {queue_id})")
            else:
                # Fallback : traitement direct si pas de queue
                logger.warning("⚠️ Queue non disponible, traitement direct")
                await self._process_file_workflow(Path(file_path), force=force)
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur ajout fichier à la queue {file_path}: {e}")
            # Fallback : essayer traitement direct
            try:
                await self._process_file_workflow(Path(file_path), force=force)
            except Exception as e2:
                logger.error(f"[ERROR] Erreur traitement direct {file_path}: {e2}")
    
    async def _process_file_workflow(self, file_path: Path, force: bool = False):
        """Workflow complet de traitement d'un fichier"""
        try:
            self.metrics['last_activity'] = datetime.now()
            
            # Vérifier la stabilité du fichier
            if not await self._wait_for_file_stability(file_path):
                logger.error(f"❌ Fichier instable, abandon: {file_path}")
                return
            
            # === VÉRIFICATION DES DOUBLONS ===
            upload_id = None
            if self.upload_tracker:
                metadata = self._extract_metadata_from_path(file_path)
                shot_id = metadata.get('shot_id', '')
                version = metadata.get('version', 'v001')
                
                # Vérifier si le fichier est déjà traité
                duplicate = self.upload_tracker.is_duplicate(str(file_path), shot_id, version)
                if duplicate and not force:
                    status = duplicate.get('status', 'UNKNOWN')
                    if status in ['COMPLETED', '🎉 COMPLETED']:
                        logger.info(f"✅ Fichier déjà traité avec succès: {file_path.name}")
                        logger.info(f"📋 Upload ID existant: {duplicate.get('upload_id', 'N/A')}")
                        return duplicate.get('upload_id')
                    elif status in ['CREATED', 'PROCESSING', '⏳ WAITING_APPROVAL', '🔄 UPLOADING', '⚙️ PROCESSING']:
                        logger.info(f"🔄 Fichier en cours de traitement: {file_path.name}")
                        logger.info(f"📋 Upload ID existant: {duplicate.get('upload_id', 'N/A')}")
                        return duplicate.get('upload_id')
                    else:
                        logger.warning(f"⚠️ Fichier précédemment échoué, nouveau traitement: {file_path.name}")
                
                # Ajouter nouveau tracking ou récupérer l'existant
                if duplicate and force:
                    upload_id = duplicate.get('upload_id')
                    logger.info(f"🔄 Retraitement forcé: {file_path.name} (ID: {upload_id})")
                    # Mettre à jour le statut pour indiquer un nouveau traitement
                    self.upload_tracker.update_upload(upload_id, {
                        'status': '🔄 REPROCESSING',
                        'reprocessing_at': datetime.now().isoformat()
                    })
                else:
                    upload_id = self.upload_tracker.add_upload(
                        str(file_path),
                        shot_id,
                        version,
                        metadata
                    )
                    logger.info(f"📋 Nouveau tracking créé: {file_path.name} (ID: {upload_id})")
            
            # 1. Générer la miniature avec upload vers Google Drive pour Discord
            thumbnail_path = None
            thumbnail_url = None
            if self.config.get('workflow', {}).get('enable_thumbnails', True):
                metadata = self._extract_metadata_from_path(file_path)
                shot_name = metadata.get('shot_name', '')
                
                # Générer et uploader directement depuis la vidéo vers Hostinger
                if self.thumbnail_generator:
                    thumbnail_url = self.thumbnail_generator.generate_with_hostinger_upload(
                        str(file_path), shot_name
                    )
            
            # 2. Vérifier et rafraîchir le token si nécessaire
            if not await self._check_and_refresh_token():
                logger.error("[ERROR] Token Frame.io invalide")
                return
            
            # 3. Upload vers Frame.io avec la nouvelle méthode
            frameio_link = None
            if self.config.get('workflow', {}).get('enable_frameio_upload', True):
                try:
                    frameio_link = await self._upload_to_frameio(file_path)
                except Exception as e:
                    logger.error(f"[ERROR] Erreur upload Frame.io: {e}")
            
            # 4. Upload thumbnail vers Google Drive et mise à jour Google Sheets
            thumbnail_drive_url = thumbnail_url  # Déjà uploadé à l'étape 1
            
            # 5. Mise à jour Google Sheets avec les infos du traitement
            if self.config.get('workflow', {}).get('enable_sheets_updates', True):
                try:
                    metadata = self._extract_metadata_from_path(file_path)
                    await self._update_sheets_with_processing_info(
                        metadata, frameio_link, thumbnail_drive_url, file_path
                    )
                except Exception as e:
                    logger.error(f"[ERROR] Erreur mise à jour Google Sheets: {e}")
            
            # 6. Notification Discord avec thumbnail
            if self.config.get('workflow', {}).get('enable_discord_notifications', True):
                try:
                    await self._send_file_notification(file_path, frameio_link, thumbnail_url)
                except Exception as e:
                    logger.error(f"[ERROR] Erreur notification Discord: {e}")
            
            # Marquer comme approuvé automatiquement pour l'instant (peut être modifié pour workflow d'approbation)
            if upload_id and self.upload_tracker:
                self.upload_tracker.approve_upload(upload_id, "auto-approved")
                self.upload_tracker.start_upload(upload_id)
            
            # Mettre à jour les métriques
            self.metrics['files_processed'] += 1
            
            # === RÉSUMÉ DU TRACKING ===
            if upload_id and self.upload_tracker:
                try:
                    self.upload_tracker.update_upload(upload_id, {
                        'frameio_link': frameio_link,
                        'thumbnail_url': thumbnail_drive_url,
                        'processing_time': datetime.now().isoformat(),
                        'status': '🎉 COMPLETED'
                    })
                except Exception as e:
                    logger.error(f"[ERROR] Erreur finalisation tracking: {e}")
            
            logger.info(f"[PARTY] Workflow terminé avec succès: {file_path.name}")
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur workflow: {e}")
            self.metrics['uploads_failed'] += 1
            
            # Mettre à jour le tracker avec l'erreur
            if upload_id and self.upload_tracker:
                try:
                    self.upload_tracker.update_upload(upload_id, {
                        'status': '❌ FAILED',
                        'error': str(e),
                        'processing_time': datetime.now().isoformat()
                    })
                except Exception as track_error:
                    logger.error(f"[ERROR] Erreur tracking échec: {track_error}")
    
    async def _generate_thumbnail(self, file_path: Path) -> tuple[Optional[str], Optional[str]]:
        """Génère une thumbnail pour le fichier"""
        try:
            if not self.thumbnail_generator:
                return None, None
            
            thumbnail_path = self.thumbnail_generator.generate(str(file_path))
            
            # Upload vers le serveur HTTP pour URL temporaire
            if thumbnail_path and self.infrastructure_manager and self.infrastructure_manager.get_http_server():
                http_server = self.infrastructure_manager.get_http_server()
                thumbnail_url = http_server.serve_file(thumbnail_path)  # serve_file est synchrone
                return thumbnail_path, thumbnail_url
            
            return thumbnail_path, None
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur génération thumbnail: {e}")
            return None, None
    
    async def _upload_to_frameio(self, file_path: Path) -> Optional[str]:
        """Upload le fichier vers Frame.io"""
        try:
            if not self.frameio_manager:
                return None
            
            # Extraire les métadonnées pour obtenir shot_name et scene_name
            metadata = self._extract_metadata_from_path(file_path)
            shot_name = metadata.get('shot_id', '')
            scene_name = metadata.get('scene_name', '')
            
            if not shot_name:
                logger.error(f"[ERROR] Impossible d'extraire shot_name de: {file_path}")
                return None
            
            # Utiliser la méthode de production avec remote_upload via Cloudflare/RangeServer
            result = await self.frameio_manager.upload_file_production(
                file_path=str(file_path),
                shot_name=shot_name,
                scene_name=scene_name
            )
            
            if result:
                self.metrics['uploads_success'] += 1
                logger.info(f"✅ Upload Frame.io réussi: {result}")
                return result
            else:
                self.metrics['uploads_failed'] += 1
                logger.error(f"[ERROR] Upload Frame.io échoué pour: {file_path.name}")
                return None
            
        except Exception as e:
            self.metrics['uploads_failed'] += 1
            logger.error(f"[ERROR] Erreur upload Frame.io: {e}")
            return None
    
    async def _check_and_refresh_token(self) -> bool:
        """Vérifie et rafraîchit le token Frame.io si nécessaire"""
        try:
            if not self.frameio_auth:
                return False
            
            # Vérifier si le token existe et est valide
            if await self.frameio_auth.test_connection():
                return True
            
            # Tenter de rafraîchir le token
            if await self.frameio_auth.refresh_token():
                self.metrics['token_refreshes'] += 1
                self.metrics['last_token_refresh'] = datetime.now()
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur vérification token: {e}")
            return False
    
    async def _wait_for_file_stability(self, file_path: Path, max_wait: int = 60, check_interval: int = 2) -> bool:
        """Attend que le fichier soit stable avec support LucidLink amélioré"""
        try:
            if not file_path.exists():
                logger.warning(f"⚠️ Fichier non trouvé: {file_path}")
                return False
            
            # Utiliser les utilitaires LucidLink si disponibles
            if LUCIDLINK_UTILS_AVAILABLE:
                logger.info(f"🔍 Vérification LucidLink pour: {file_path.name}")
                
                # Vérifier si c'est un fichier LucidLink
                if lucidlink_detector.is_lucidlink_file(file_path):
                    logger.info(f"🔄 Fichier LucidLink détecté: {file_path.name}")
                    
                    # Utiliser l'attente spécialisée pour LucidLink (max 5 minutes)
                    return await lucidlink_waiter.wait_for_complete_sync(
                        file_path, 
                        max_wait=max(max_wait, 300),
                        check_interval=check_interval
                    )
                else:
                    logger.debug(f"📁 Fichier local standard: {file_path.name}")
                    return await lucidlink_waiter._standard_stability_check(
                        file_path, max_wait, check_interval
                    )
            else:
                logger.warning("⚠️ Utilitaires LucidLink non disponibles, utilisation méthode standard")
                return await self._standard_stability_check(file_path, max_wait, check_interval)
                
        except Exception as e:
            logger.error(f"[ERROR] Erreur vérification stabilité: {file_path} - {e}")
            return False
    
    async def _standard_stability_check(self, file_path: Path, max_wait: int = 60, check_interval: int = 2) -> bool:
        """Vérification de stabilité standard (fallback)"""
        try:
            if not file_path.exists():
                logger.warning(f"⚠️ Fichier non trouvé: {file_path}")
                return False
            
            logger.info(f"⏳ Vérification stabilité standard: {file_path.name}")
            
            prev_size = None
            prev_mtime = None
            stable_checks = 0
            required_stable_checks = 3
            
            start_time = asyncio.get_event_loop().time()
            
            while (asyncio.get_event_loop().time() - start_time) < max_wait:
                try:
                    stat = file_path.stat()
                    current_size = stat.st_size
                    current_mtime = stat.st_mtime
                    
                    if prev_size is not None and prev_mtime is not None:
                        if current_size == prev_size and current_mtime == prev_mtime:
                            stable_checks += 1
                            if stable_checks >= required_stable_checks:
                                logger.info(f"✅ Fichier stable: {file_path.name}")
                                return True
                        else:
                            stable_checks = 0
                    
                    prev_size = current_size
                    prev_mtime = current_mtime
                    
                    await asyncio.sleep(check_interval)
                    
                except (OSError, PermissionError) as e:
                    logger.warning(f"⚠️ Erreur accès fichier: {file_path} - {e}")
                    await asyncio.sleep(check_interval)
                    continue
            
            logger.warning(f"⏰ Timeout stabilité standard: {file_path}")
            return False
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur vérification stabilité standard: {file_path} - {e}")
            return False
    
    def _extract_metadata_from_path(self, file_path: Path) -> Dict[str, str]:
        """Extrait les métadonnées à partir du chemin du fichier"""
        try:
            path_parts = file_path.parts
            file_name = file_path.name
            
            metadata = {}
            
            # Utiliser la validation stricte pour extraire les données
            try:
                from src.integrations.frameio.upload import validate_strict_nomenclature
                nomenclature_data = validate_strict_nomenclature(str(file_path))
                
                # Copier toutes les données validées
                metadata.update(nomenclature_data)
                
                # Ajouter quelques mappings pour compatibilité
                metadata['shot_name'] = nomenclature_data.get('shot_id', '')
                metadata['nomenclature'] = nomenclature_data.get('shot_id', '')
                
                logger.info(f"✅ Métadonnées extraites avec validation stricte")
                
            except Exception as e:
                logger.warning(f"⚠️ Validation stricte échouée, fallback sur regex: {e}")
                
                # Fallback sur l'ancienne méthode si la validation échoue
                if len(path_parts) >= 3:
                    # Trouver la scène dans le chemin
                    for part in path_parts:
                        if part.startswith('SQ'):
                            metadata['scene_name'] = part
                            break
                    
                    # Extraire du nom de fichier
                    if 'UNDLM_' in file_name:
                        parts = file_name.split('_')
                        if len(parts) >= 4:
                            metadata['shot_name'] = f"{parts[0]}_{parts[1]}_{parts[2]}"
                            metadata['nomenclature'] = metadata['shot_name']
                            metadata['version'] = parts[3].split('.')[0]
            
            # Ajouter la taille du fichier
            try:
                metadata['file_size'] = file_path.stat().st_size
            except:
                metadata['file_size'] = 0
            
            # Debug: afficher les métadonnées extraites
            logger.info(f"📊 Métadonnées extraites: {metadata}")
            
            return metadata
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur extraction métadonnées: {e}")
            return {}
    
    async def _upload_thumbnail_to_drive(self, thumbnail_path: str, shot_name: str, nomenclature: str) -> Optional[str]:
        """Upload une thumbnail vers Google Drive et retourne l'URL pour la formule =IMAGE()"""
        try:
            if not self.thumbnail_generator:
                logger.warning("⚠️ Thumbnail generator non disponible")
                return None
            
            # Utiliser la méthode Hostinger intégrée du ThumbnailGenerator
            drive_url = self.thumbnail_generator.generate_with_hostinger_upload(
                thumbnail_path, shot_name
            )
            
            if drive_url:
                logger.info(f"☁️ Thumbnail uploadé vers Google Drive: {shot_name}")
                return drive_url
            else:
                logger.warning(f"⚠️ Échec upload thumbnail Drive: {shot_name}")
                return None
                
        except Exception as e:
            logger.error(f"[ERROR] Erreur upload thumbnail vers Drive: {e}")
            return None
    
    async def _update_sheets_with_processing_info(self, metadata: dict, frameio_link: str = None, 
                                                thumbnail_drive_url: str = None, file_path: Path = None):
        """Met à jour Google Sheets avec les informations de traitement - Version optimisée"""
        try:
            if not self.sheets_adapter:
                logger.warning("⚠️ Adaptateur Google Sheets non disponible")
                return
            
            nomenclature = metadata.get('nomenclature', '')
            if not nomenclature:
                logger.error("[ERROR] Pas de nomenclature disponible pour Google Sheets")
                return
            
            # Trouver la ligne du shot
            row_number = await self.sheets_adapter.find_shot_row(nomenclature)
            if not row_number:
                logger.warning(f"⚠️ Shot non trouvé dans Google Sheets: {nomenclature}")
                return
            
            # Préparer les données de mise à jour avec formules Google Sheets
            update_data = {
                'version': metadata.get('version', ''),
                'file_name': metadata.get('filename', file_path.name if file_path else ''),
                'processing_date': datetime.now().isoformat(),
            }
            
            # Frame.io link avec formule LIEN_HYPERTEXTE
            if frameio_link:
                version = metadata.get('version', 'v001')
                link_text = f"REVIEW {version}"
                frameio_formula = f'=LIEN_HYPERTEXTE("{frameio_link}";"{link_text}")'
                update_data['frameio_link'] = frameio_formula
                logger.info(f"📊 Formule Frame.io préparée: {link_text}")
            
            # Thumbnail avec formule =IMAGE()
            if thumbnail_drive_url:
                update_data['thumbnail_url'] = thumbnail_drive_url  # L'adaptateur gère la formule IMAGE()
                logger.info(f"🖼️ Formule thumbnail préparée")
            
            # Mettre à jour avec l'adaptateur optimisé (connexion persistante)
            success = await self.sheets_adapter.update_status(
                row_number=row_number,
                status="PROCESSED", 
                additional_data=update_data
            )
            
            if success:
                logger.info(f"✅ Google Sheets mis à jour avec formules pour: {nomenclature}")
            else:
                logger.error(f"❌ Échec mise à jour Google Sheets pour: {nomenclature}")
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur mise à jour Sheets optimisée: {e}")
    
    async def _send_file_notification(self, file_path: Path, frameio_link: str = None, thumbnail_url: str = None):
        """Envoie une notification Discord pour un fichier traité"""
        try:
            # Utiliser user_notifier en priorité, sinon discord_notifier
            notifier = self.user_notifier or self.discord_notifier
            if not notifier:
                return
            
            message = f"🎬 Fichier traité: {file_path.name}"
            if frameio_link:
                message += f"\n[LINK] Frame.io: {frameio_link}"
            
            # Si on utilise le user_notifier
            if self.user_notifier:
                result = await self.user_notifier.notify_file_processed(
                    file_path=file_path,
                    frameio_link=frameio_link,
                    thumbnail_url=thumbnail_url
                )
            else:
                # Fallback vers discord_notifier classique
                result = self.discord_notifier.notify_file_processed(
                    file_path.name, message, frameio_link, thumbnail_url
                )
            
            if not result:
                logger.debug(f"⚠️ Notification fichier Discord non envoyée: {file_path.name}")
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur notification Discord: {e}")
    
    async def _send_discord_notification(self, title: str, message: str):
        """Envoie une notification Discord de façon asynchrone"""
        try:
            # Utiliser user_notifier en priorité, sinon discord_notifier
            notifier = self.user_notifier or self.discord_notifier
            if not notifier:
                return
            
            # Si on utilise le user_notifier
            if self.user_notifier:
                result = await self.user_notifier.send_system_notification(title, message)
            else:
                # Fallback vers discord_notifier classique
                result = self.discord_notifier.notify_system_status(title, message)
            
            if not result:
                logger.debug(f"⚠️ Notification Discord non envoyée: {title}")
        except Exception as e:
            logger.warning(f"⚠️ Erreur notification Discord: {e}")
    
    async def startup_sync_check(self) -> bool:
        """Vérification de synchronisation au démarrage du pipeline"""
        try:
            from src.bootstrap.sync_checker import SyncChecker
            
            # Créer et utiliser le vrai SyncChecker
            checker = SyncChecker(
                self.config, 
                self.config_manager, 
                self.upload_tracker,
                self.discord_notifier or self.user_notifier
            )
            
            # Lancer la vérification avec callback et sans limitation de fichiers
            return await checker.startup_sync_check(
                process_file_callback=self._handle_new_file,
                max_files_to_process=999  # Traiter tous les fichiers
            )
            
        except Exception as e:
            logger.error(f"[ERROR] Erreur vérification synchronisation: {e}")
            return False
    
    async def shutdown(self):
        f"""Arrêt propre du pipeline PostFlow v{POSTFLOW_VERSION}"""
        if not self.is_running:
            return
            
        logger.info(f"[STOP] Arrêt du pipeline PostFlow v{POSTFLOW_VERSION}...")
        
        self.is_running = False
        
        # Déclencher l'événement d'arrêt pour sortir de la boucle principale
        self._shutdown_event.set()
        
        # Notification d'arrêt
        notifier = self.user_notifier or self.discord_notifier
        if notifier:
            try:
                await asyncio.wait_for(
                    self._send_discord_notification(
                        f"[STOP] PostFlow v{POSTFLOW_VERSION} arrêté",
                        "Le pipeline de traitement a été arrêté"
                    ),
                    timeout=5.0
                )
            except asyncio.TimeoutError:
                logger.warning("⚠️ Timeout notification Discord")
            except Exception as e:
                logger.warning(f"⚠️ Erreur notification Discord: {e}")
        
        # Arrêter le watcher
        if self.watcher:
            logger.info("[STOP] Arrêt du watcher...")
            try:
                self.watcher.stop()
                logger.info("✅ Watcher arrêté")
            except Exception as e:
                logger.warning(f"⚠️ Erreur arrêt watcher: {e}")
        
        # Arrêter la queue d'upload
        if self.upload_queue:
            logger.info("[STOP] Arrêt de la queue d'upload...")
            try:
                await self.upload_queue.stop()
                logger.info("✅ Queue d'upload arrêtée")
            except Exception as e:
                logger.warning(f"⚠️ Erreur arrêt queue d'upload: {e}")
        
        # Arrêter l'infrastructure
        if self.infrastructure_manager:
            self.infrastructure_manager.stop_infrastructure()
        
        # Arrêter le dashboard
        if self.dashboard_initializer:
            self.dashboard_initializer.stop_dashboard()
        
        # Annuler toutes les tâches asyncio en cours
        try:
            current_task = asyncio.current_task()
            tasks = [task for task in asyncio.all_tasks() if not task.done() and task != current_task]
            if tasks:
                logger.info(f"[STOP] Annulation de {len(tasks)} tâches asyncio...")
                for task in tasks:
                    if not task.done():
                        task.cancel()
                
                # Attendre que toutes les tâches soient annulées (avec timeout)
                if tasks:
                    await asyncio.wait(tasks, timeout=5.0, return_when=asyncio.ALL_COMPLETED)
                logger.info("✅ Tâches asyncio annulées")
        except Exception as e:
            logger.warning(f"⚠️ Erreur annulation tâches: {e}")
        
        # Afficher les métriques finales
        duration = datetime.now() - self.metrics['start_time']
        print("\n📊 MÉTRIQUES FINALES")
        print("-" * 50)
        print(f"Durée d'exécution: {duration}")
        print(f"Fichiers traités: {self.metrics['files_processed']}")
        print(f"Uploads réussis: {self.metrics['uploads_success']}")
        print(f"Uploads échoués: {self.metrics['uploads_failed']}")
        print(f"Rafraîchissements token: {self.metrics['token_refreshes']}")
        if self.metrics['last_token_refresh']:
            print(f"Dernier rafraîchissement: {self.metrics['last_token_refresh']}")
        
        logger.info(f"✅ Pipeline PostFlow v{POSTFLOW_VERSION} arrêté")
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut du pipeline pour le dashboard"""
        status = {
            'running': self.is_running,
            'components': {
                'frameio': self.frameio_manager is not None,
                'watcher': self.watcher is not None,
                'error_handler': self.error_handler is not None,
                'dashboard': self.dashboard_initializer is not None,
                'upload_queue': self.upload_queue is not None
            },
            'metrics': self.metrics,
            'config': {
                'frameio_enabled': self.frameio_manager is not None,
                'watcher_enabled': self.watcher is not None,
                'error_handler_enabled': self.error_handler is not None,
                'upload_queue_enabled': self.upload_queue is not None
            }
        }
        
        # Ajouter les informations de la queue si disponible
        if self.upload_queue:
            status['upload_queue'] = self.upload_queue.get_status()
        
        return status
    
    def force_shutdown(self):
        """Arrêt forcé pour debugging - ne pas utiliser en production"""
        logger.warning("⚠️ Arrêt forcé demandé (mode debug)")
        self.is_running = False
        self._shutdown_event.set()
    
    async def process_file(self, file_path: Path, force: bool = False) -> bool:
        """Traite un fichier spécifique via la queue"""
        try:
            if self.upload_queue:
                # Traitement via la queue avec priorité haute
                queue_id = await self.upload_queue.add_file(
                    file_path,
                    priority=QueuePriority.HIGH,
                    force=force,
                    metadata={'source': 'manual_processing'}
                )
                
                logger.info(f"📋 Fichier ajouté à la queue pour traitement: {file_path.name} (ID: {queue_id})")
                
                # Attendre que le fichier soit traité
                timeout = 300  # 5 minutes max
                start_time = datetime.now()
                
                while (datetime.now() - start_time).total_seconds() < timeout:
                    item_status = self.upload_queue.get_item_status(queue_id)
                    if not item_status:
                        break
                    
                    if item_status['status'] == 'COMPLETED':
                        logger.info(f"✅ Traitement terminé: {file_path.name}")
                        return True
                    elif item_status['status'] == 'FAILED':
                        logger.error(f"[ERROR] Traitement échoué: {file_path.name}")
                        return False
                    
                    await asyncio.sleep(1)
                
                logger.warning(f"⚠️ Timeout traitement: {file_path.name}")
                return False
            else:
                # Traitement direct si pas de queue
                await self._process_file_workflow(file_path, force)
                return True
                
        except Exception as e:
            logger.error(f"[ERROR] Erreur traitement fichier: {e}")
            return False
    
    async def _queue_file_processor(self, file_path: str, metadata: Dict[str, Any] = None, force: bool = False):
        """Wrapper pour traiter les fichiers via la queue (adaptation des signatures)"""
        try:
            logger.info(f"📋 [Queue] Traitement: {Path(file_path).name}")
            
            # Convertir le string en Path et appeler le workflow
            await self._process_file_workflow(Path(file_path), force=force)
            
        except Exception as e:
            logger.error(f"[ERROR] [Queue] Erreur traitement {file_path}: {e}")
            raise  # Re-raise pour que la queue gère le retry
