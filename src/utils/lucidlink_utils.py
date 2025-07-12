"""
Utilitaires pour LucidLink - Détection de la synchronisation complète des fichiers
"""

import asyncio
import logging
import os
import subprocess
import time
from pathlib import Path
from typing import Optional, Dict, Any
import hashlib

# Import du gestionnaire de chemins multi-plateforme
from .cross_platform_paths import get_platform_path_manager, normalize_lucidlink_path, is_windows_platform

logger = logging.getLogger(__name__)

class LucidLinkDetector:
    """Détecteur et utilitaires pour LucidLink avec support multi-plateforme"""
    
    def __init__(self):
        # Utiliser le gestionnaire de chemins multi-plateforme
        self.path_manager = get_platform_path_manager()
        self.is_lucidlink_mounted = self._check_lucidlink_mount()
        self.lucidlink_paths = self._detect_lucidlink_paths()
        
    def _check_lucidlink_mount(self) -> bool:
        """Vérifie si LucidLink est monté (compatible Windows/macOS/Linux)"""
        try:
            # Vérifier si le chemin de base LucidLink existe
            lucidlink_base = self.path_manager.get_lucidlink_base_path()
            if lucidlink_base.exists():
                logger.debug(f"LucidLink trouvé à: {lucidlink_base}")
                return True
            
            # Vérifier la présence du processus LucidLink selon l'OS
            if is_windows_platform():
                # Sur Windows, chercher les processus LucidLink
                try:
                    result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq lucid*'], 
                                         capture_output=True, text=True, timeout=5)
                    return 'lucid' in result.stdout.lower()
                except Exception:
                    pass
            else:
                # Sur macOS/Linux, utiliser pgrep
                try:
                    result = subprocess.run(['pgrep', '-f', 'lucid'], 
                                         capture_output=True, text=True, timeout=5)
                    return result.returncode == 0
                except Exception:
                    pass
            
            return False
        except Exception as e:
            logger.debug(f"Erreur vérification mount LucidLink: {e}")
            return False
    
    def _detect_lucidlink_paths(self) -> list:
        """Détecte les chemins montés par LucidLink (multi-plateforme)"""
        paths = []
        try:
            # Utiliser le gestionnaire de chemins pour obtenir le chemin de base
            base_path = self.path_manager.get_lucidlink_base_path()
            
            if base_path.exists():
                paths.append(str(base_path))
                logger.debug(f"Chemin LucidLink principal détecté: {base_path}")
            
            # Vérifier des chemins additionnels selon la plateforme
            if is_windows_platform():
                # Chemins Windows spécifiques
                windows_paths = [
                    "E:\\Volumes\\resizelab",
                    "D:\\Volumes\\resizelab", 
                    "C:\\Volumes\\resizelab",
                    "E:\\resizelab",
                    "D:\\resizelab"
                ]
                
                for path_str in windows_paths:
                    path = Path(path_str)
                    if path.exists() and str(path) not in paths:
                        if self._is_lucidlink_directory(str(path)):
                            paths.append(str(path))
                            logger.debug(f"Chemin LucidLink Windows détecté: {path}")
            else:
                # Chemins macOS/Linux spécifiques
                unix_paths = [
                    '/Volumes/LucidLink',
                    '/Volumes/resizelab',
                    '/mnt/lucidlink',
                    '/Users/Shared/LucidLink',
                    os.path.expanduser('~/LucidLink')
                ]
                
                for path_str in unix_paths:
                    path = Path(path_str)
                    if path.exists() and str(path) not in paths:
                        if self._is_lucidlink_directory(str(path)):
                            paths.append(str(path))
                            logger.debug(f"Chemin LucidLink Unix détecté: {path}")
                        
        except Exception as e:
            logger.debug(f"Erreur détection LucidLink: {e}")
            
        return paths
    
    def _is_lucidlink_directory(self, path: str) -> bool:
        """Vérifie si un répertoire est géré par LucidLink (multi-plateforme)"""
        try:
            # Méthode 1: Vérifier la présence de fichiers spéciaux LucidLink
            lucid_indicators = [
                os.path.join(path, '.lucidlink'),
                os.path.join(path, '.lucid'),
            ]
            
            for indicator in lucid_indicators:
                if os.path.exists(indicator):
                    return True
            
            # Méthode 2: Vérifier le type de système de fichiers (Unix seulement)
            if not is_windows_platform() and os.path.exists(path):
                try:
                    result = subprocess.run(['df', '-T', path], 
                                         capture_output=True, text=True, timeout=5)
                    if 'fuse' in result.stdout.lower() or 'lucid' in result.stdout.lower():
                        return True
                except (subprocess.TimeoutExpired, FileNotFoundError):
                    pass
            
            # Méthode 3: Heuristique basée sur le nom du chemin
            path_lower = path.lower()
            if any(keyword in path_lower for keyword in ['lucid', 'resizelab']):
                return True
            
            # Méthode 4: Vérifier la structure de dossiers typique du projet
            if os.path.exists(path):
                # Chercher des dossiers caractéristiques
                project_indicators = [
                    os.path.join(path, '2_IN'),
                    os.path.join(path, '3_PROJECTS'),
                    os.path.join(path, '4_OUT'),
                    os.path.join(path, '5_DELIVERABLES')
                ]
                
                found_indicators = sum(1 for indicator in project_indicators if os.path.exists(indicator))
                if found_indicators >= 2:  # Au moins 2 dossiers trouvés
                    return True
                
            return False
            
        except Exception as e:
            logger.debug(f"Erreur vérification répertoire LucidLink: {e}")
            return False
    
    def is_lucidlink_file(self, file_path: Path) -> bool:
        """Vérifie si un fichier est sur un système LucidLink (multi-plateforme)"""
        try:
            # Normaliser le chemin pour la plateforme actuelle
            normalized_path = normalize_lucidlink_path(file_path)
            file_str = str(normalized_path.resolve())
            
            # Vérifier si le fichier est sous un des chemins LucidLink détectés
            return any(file_str.startswith(path) for path in self.lucidlink_paths)
        except Exception as e:
            logger.debug(f"Erreur vérification fichier LucidLink: {e}")
            return False
    
    def get_lucidlink_file_status(self, file_path: Path) -> Dict[str, Any]:
        """Obtient le statut d'un fichier LucidLink"""
        try:
            if not self.is_lucidlink_file(file_path):
                return {'is_lucidlink': False}
            
            # Tentative d'utilisation de la CLI LucidLink si disponible
            try:
                result = subprocess.run(['lucid', 'status', str(file_path)], 
                                     capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    # Analyser la sortie pour déterminer le statut de cache
                    output = result.stdout.strip().lower()
                    is_cached = 'cached' in output or 'local' in output
                    return {
                        'is_lucidlink': True,
                        'status': 'cached' if is_cached else 'remote',
                        'is_cached': is_cached,
                        'cli_output': result.stdout.strip()
                    }
            except (subprocess.TimeoutExpired, FileNotFoundError):
                pass
            
            # Méthode de fallback basée sur l'inspection du fichier
            stat = file_path.stat()
            
            # Test empirique pour détecter si le fichier est en cache
            # Les fichiers non-cachés ont souvent des attributs spéciaux
            is_cached = self._test_file_cache_status(file_path)
            
            return {
                'is_lucidlink': True,
                'size': stat.st_size,
                'mtime': stat.st_mtime,
                'status': 'cached' if is_cached else 'unknown',
                'is_cached': is_cached
            }
            
        except Exception as e:
            logger.debug(f"Erreur statut LucidLink: {e}")
            return {'is_lucidlink': False, 'error': str(e)}
    
    def _test_file_cache_status(self, file_path: Path) -> bool:
        """Test empirique pour déterminer si un fichier est en cache"""
        try:
            # Test 1: Essayer de lire les premiers et derniers bytes rapidement
            start_time = time.time()
            with open(file_path, 'rb') as f:
                # Lire le début
                f.read(8192)
                # Aller à la fin
                f.seek(-8192, 2)
                f.read(8192)
            
            read_time = time.time() - start_time
            
            # Si la lecture est très rapide, le fichier est probablement en cache
            # Si elle est lente, il est probablement en cours de téléchargement
            is_fast_read = read_time < 1.0  # Moins d'une seconde
            
            logger.debug(f"Test cache LucidLink {file_path.name}: {read_time:.2f}s - {'Probablement en cache' if is_fast_read else 'Probablement distant'}")
            
            return is_fast_read
            
        except Exception as e:
            logger.debug(f"Erreur test cache: {e}")
            return False
    
    def force_cache_file(self, file_path: Path) -> bool:
        """Force la mise en cache d'un fichier LucidLink"""
        try:
            if not self.is_lucidlink_file(file_path):
                return True  # Pas un fichier LucidLink, pas besoin de cache
            
            logger.info(f"🔄 Force la mise en cache LucidLink: {file_path.name}")
            
            # Méthode 1: Utiliser la CLI LucidLink si disponible
            try:
                result = subprocess.run(['lucid', 'cache', str(file_path)], 
                                     capture_output=True, text=True, timeout=30)
                if result.returncode == 0:
                    logger.info(f"✅ Cache forcé via CLI: {file_path.name}")
                    return True
            except (subprocess.TimeoutExpired, FileNotFoundError):
                logger.debug("CLI LucidLink non disponible pour forcer le cache")
            
            # Méthode 2: Forcer le cache en lisant le fichier entier
            logger.info(f"🔄 Lecture complète pour forcer le cache: {file_path.name}")
            
            file_size = file_path.stat().st_size
            chunk_size = 1024 * 1024  # 1MB par chunk
            bytes_read = 0
            
            start_time = time.time()
            
            with open(file_path, 'rb') as f:
                while True:
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    bytes_read += len(chunk)
                    
                    # Afficher le progrès
                    progress = (bytes_read / file_size) * 100
                    if bytes_read % (10 * 1024 * 1024) == 0:  # Tous les 10MB
                        logger.info(f"📊 Cache en cours: {progress:.1f}% ({bytes_read:,}/{file_size:,} bytes)")
            
            cache_time = time.time() - start_time
            speed_mbps = (bytes_read / (1024 * 1024)) / cache_time if cache_time > 0 else 0
            
            logger.info(f"✅ Fichier mis en cache: {file_path.name}")
            logger.info(f"📊 Taille: {bytes_read:,} bytes en {cache_time:.1f}s ({speed_mbps:.1f} MB/s)")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la mise en cache: {e}")
            return False

class LucidLinkFileWaiter:
    """Attente spécialisée pour les fichiers LucidLink"""
    
    def __init__(self, detector: Optional[LucidLinkDetector] = None):
        self.detector = detector or LucidLinkDetector()
        
    async def wait_for_complete_sync(self, file_path: Path, 
                                   max_wait: int = 300, 
                                   check_interval: int = 5) -> bool:
        """
        Attend que le fichier soit complètement synchronisé depuis LucidLink
        
        Args:
            file_path: Chemin vers le fichier
            max_wait: Temps d'attente maximum en secondes (5 minutes par défaut)
            check_interval: Intervalle entre les vérifications en secondes
            
        Returns:
            bool: True si le fichier est complètement synchronisé
        """
        if not self.detector.is_lucidlink_file(file_path):
            logger.debug(f"Fichier non-LucidLink: {file_path}")
            return await self._standard_stability_check(file_path)
        
        logger.info(f"🔄 Vérification synchronisation LucidLink: {file_path.name}")
        
        # Étape 1: Vérifier le statut du cache
        status = self.detector.get_lucidlink_file_status(file_path)
        logger.info(f"📊 Statut LucidLink: {status}")
        
        # Étape 2: Forcer la mise en cache si nécessaire
        if not status.get('is_cached', False):
            logger.info(f"🔄 Fichier non en cache, force la synchronisation...")
            
            # Forcer la mise en cache en arrière-plan
            cache_success = await asyncio.get_event_loop().run_in_executor(
                None, self.detector.force_cache_file, file_path
            )
            
            if not cache_success:
                logger.error(f"❌ Impossible de forcer la mise en cache: {file_path}")
                return False
        
        # Étape 3: Vérification de stabilité après mise en cache
        start_time = time.time()
        consecutive_stable_checks = 0
        required_stable_checks = 3
        
        prev_size = None
        prev_hash = None
        
        while (time.time() - start_time) < max_wait:
            try:
                # Vérifier l'existence et l'accessibilité
                if not file_path.exists():
                    logger.debug(f"Fichier non trouvé: {file_path}")
                    await asyncio.sleep(check_interval)
                    continue
                
                # Vérifier la taille
                stat = file_path.stat()
                current_size = stat.st_size
                
                # Ignorer les fichiers vides ou très petits (potentiellement des placeholders)
                if current_size < 1024:  # Moins de 1KB
                    logger.debug(f"Fichier trop petit ({current_size} bytes), attente...")
                    await asyncio.sleep(check_interval)
                    continue
                
                # Vérifier l'accès en lecture avec test de cache
                try:
                    with open(file_path, 'rb') as f:
                        # Lire et calculer le hash des premiers 64KB
                        chunk = f.read(65536)
                        if not chunk:
                            logger.debug(f"Fichier vide ou inaccessible")
                            await asyncio.sleep(check_interval)
                            continue
                        
                        current_hash = hashlib.md5(chunk).hexdigest()
                        
                        # Test de cache rapide
                        cache_test_start = time.time()
                        f.seek(-65536, 2)  # Aller à la fin
                        end_chunk = f.read(65536)
                        cache_test_time = time.time() - cache_test_start
                        
                        # Si l'accès à la fin du fichier est rapide, il est probablement en cache
                        is_likely_cached = cache_test_time < 0.5  # Moins de 500ms
                        
                        if not is_likely_cached:
                            logger.info(f"⏳ Fichier probablement en cours de cache (temps accès: {cache_test_time:.2f}s)")
                            await asyncio.sleep(check_interval)
                            continue
                        
                        # Vérifier la stabilité
                        if prev_size is not None and prev_hash is not None:
                            if current_size == prev_size and current_hash == prev_hash:
                                consecutive_stable_checks += 1
                                logger.debug(f"Fichier stable (check {consecutive_stable_checks}/{required_stable_checks}): {current_size:,} bytes")
                                
                                if consecutive_stable_checks >= required_stable_checks:
                                    # Vérification finale approfondie
                                    if await self._verify_file_integrity(file_path):
                                        logger.info(f"✅ Fichier LucidLink synchronisé et en cache: {file_path.name} ({current_size:,} bytes)")
                                        return True
                                    else:
                                        logger.warning(f"⚠️ Fichier instable malgré les vérifications: {file_path}")
                                        consecutive_stable_checks = 0
                            else:
                                consecutive_stable_checks = 0
                                if current_size != prev_size:
                                    logger.info(f"📈 Taille LucidLink changée: {prev_size:,} → {current_size:,} bytes")
                        
                        prev_size = current_size
                        prev_hash = current_hash
                        
                except (OSError, PermissionError) as e:
                    logger.debug(f"Erreur accès fichier: {e}")
                    await asyncio.sleep(check_interval)
                    continue
                
            except Exception as e:
                logger.warning(f"Erreur vérification LucidLink: {e}")
                await asyncio.sleep(check_interval)
                continue
            
            await asyncio.sleep(check_interval)
        
        logger.warning(f"⏰ Timeout synchronisation LucidLink: {file_path}")
        return False
    
    async def _verify_file_integrity(self, file_path: Path) -> bool:
        """Vérification approfondie de l'intégrité du fichier"""
        try:
            # Vérifier que le fichier peut être lu entièrement
            size = file_path.stat().st_size
            
            # Pour les gros fichiers, vérifier seulement le début et la fin
            if size > 100 * 1024 * 1024:  # 100MB
                with open(file_path, 'rb') as f:
                    # Lire le début
                    f.read(1024 * 1024)  # 1MB
                    # Aller à la fin
                    f.seek(-1024 * 1024, 2)  # 1MB avant la fin
                    f.read(1024 * 1024)
            else:
                # Pour les fichiers plus petits, vérifier plus en détail
                with open(file_path, 'rb') as f:
                    # Lire par chunks
                    while True:
                        chunk = f.read(8192)
                        if not chunk:
                            break
            
            return True
            
        except Exception as e:
            logger.debug(f"Erreur vérification intégrité: {e}")
            return False
    
    async def _standard_stability_check(self, file_path: Path, 
                                      max_wait: int = 60, 
                                      check_interval: int = 2) -> bool:
        """Vérification de stabilité standard pour les fichiers non-LucidLink"""
        try:
            if not file_path.exists():
                return False
            
            prev_size = None
            prev_mtime = None
            stable_checks = 0
            required_stable_checks = 3
            
            start_time = time.time()
            
            while (time.time() - start_time) < max_wait:
                try:
                    stat = file_path.stat()
                    current_size = stat.st_size
                    current_mtime = stat.st_mtime
                    
                    if prev_size is not None and prev_mtime is not None:
                        if current_size == prev_size and current_mtime == prev_mtime:
                            stable_checks += 1
                            if stable_checks >= required_stable_checks:
                                # Vérification finale
                                with open(file_path, 'rb') as f:
                                    f.read(1024)
                                return True
                        else:
                            stable_checks = 0
                    
                    prev_size = current_size
                    prev_mtime = current_mtime
                    
                    await asyncio.sleep(check_interval)
                    
                except (OSError, PermissionError):
                    await asyncio.sleep(check_interval)
                    continue
            
            return False
            
        except Exception:
            return False

# Instance globale pour réutilisation
lucidlink_detector = LucidLinkDetector()
lucidlink_waiter = LucidLinkFileWaiter(lucidlink_detector)
