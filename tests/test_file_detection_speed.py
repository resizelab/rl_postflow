#!/usr/bin/env python3
"""
Test de détection rapide des fichiers avec timeouts optimisés
Valide que les fichiers sont détectés dans un délai raisonnable après optimisation
"""

import asyncio
import sys
import logging
import time
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# Ajouter le répertoire racine au path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FileDetectionTest:
    """Test de détection rapide des fichiers"""
    
    def __init__(self):
        self.test_files = []
        self.detected_files = []
        self.detection_times = []
        self.test_dir = Path("/tmp/rl_postflow_test")
        self.test_dir.mkdir(exist_ok=True)
        
    def create_test_file(self, filename: str, size_mb: int = 1) -> Path:
        """Crée un fichier de test avec une taille donnée"""
        file_path = self.test_dir / filename
        
        # Créer un fichier de la taille spécifiée
        with open(file_path, 'wb') as f:
            # Écrire des données aléatoires
            data = b'0' * (1024 * 1024)  # 1MB de données
            for _ in range(size_mb):
                f.write(data)
        
        logger.info(f"📄 Fichier test créé: {file_path} ({size_mb}MB)")
        return file_path
    
    def on_file_detected(self, file_path: Path, detection_time: float):
        """Callback appelé lors de la détection d'un fichier"""
        self.detected_files.append(file_path)
        self.detection_times.append(detection_time)
        logger.info(f"✅ Fichier détecté: {file_path.name} (temps: {detection_time:.2f}s)")
    
    async def test_watcher_detection_speed(self):
        """Test la vitesse de détection du watcher"""
        logger.info("🔍 Test vitesse de détection du watcher...")
        
        try:
            from src.utils.file_watcher import LucidLinkWatcher
            
            # Configuration optimisée pour test
            watcher_config = {
                'base_path': str(self.test_dir),
                'polling_interval': 2,  # 2 secondes pour test rapide
                'min_file_age': 5,      # 5 secondes pour test
                'supported_extensions': ['.mov', '.mp4', '.avi'],
                'max_scan_errors': 3,
                'error_backoff': 10,
                'path_check_interval': 60
            }
            
            # Créer le watcher
            watcher = LucidLinkWatcher(watcher_config)
            
            # Ajouter callback pour mesurer le temps de détection
            start_times = {}
            
            def on_detection(file_event):
                file_path = Path(file_event.file_path)
                if str(file_path) in start_times:
                    detection_time = time.time() - start_times[str(file_path)]
                    self.on_file_detected(file_path, detection_time)
            
            watcher.add_callback(on_detection)
            
            # Démarrer le watcher
            watcher.start()
            
            # Attendre un peu pour que le watcher se stabilise
            await asyncio.sleep(3)
            
            # Créer des fichiers de test
            test_files = [
                "test_video_001.mov",
                "test_video_002.mp4",
                "test_video_003.avi"
            ]
            
            for filename in test_files:
                start_time = time.time()
                file_path = self.create_test_file(filename)
                start_times[str(file_path)] = start_time
                self.test_files.append(file_path)
                
                # Attendre un peu entre les fichiers
                await asyncio.sleep(1)
            
            # Attendre la détection (timeout de 30s)
            max_wait = 30
            start_wait = time.time()
            
            while len(self.detected_files) < len(self.test_files):
                if time.time() - start_wait > max_wait:
                    logger.warning(f"⏰ Timeout: {len(self.detected_files)}/{len(self.test_files)} fichiers détectés")
                    break
                await asyncio.sleep(0.5)
            
            # Arrêter le watcher
            watcher.stop()
            
            # Analyser les résultats
            if self.detection_times:
                avg_time = sum(self.detection_times) / len(self.detection_times)
                max_time = max(self.detection_times)
                min_time = min(self.detection_times)
                
                logger.info(f"📊 Résultats détection:")
                logger.info(f"  • Fichiers détectés: {len(self.detected_files)}/{len(self.test_files)}")
                logger.info(f"  • Temps moyen: {avg_time:.2f}s")
                logger.info(f"  • Temps min: {min_time:.2f}s")
                logger.info(f"  • Temps max: {max_time:.2f}s")
                
                # Vérifier que la détection est rapide
                if avg_time <= 15:  # Moins de 15 secondes en moyenne
                    logger.info("✅ Détection rapide validée!")
                    return True
                else:
                    logger.warning(f"⚠️ Détection lente: {avg_time:.2f}s (>15s)")
                    return False
            else:
                logger.error("❌ Aucun fichier détecté")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur test watcher: {e}")
            return False
    
    async def test_lucidlink_cache_detection(self):
        """Test la détection avec cache LucidLink"""
        logger.info("🔍 Test détection cache LucidLink...")
        
        try:
            from src.utils.lucidlink_utils import LucidLinkDetector, LucidLinkFileWaiter
            
            # Chercher des fichiers LucidLink existants
            lucidlink_path = Path("/Volumes/LucidLink")
            if not lucidlink_path.exists():
                logger.warning("⚠️ LucidLink non monté, test ignoré")
                return True
            
            # Tester la détection rapide
            detector = LucidLinkDetector()
            waiter = LucidLinkFileWaiter(detector)
            
            # Chercher des fichiers de test
            test_files = list(lucidlink_path.rglob("*.mov"))[:2]  # 2 premiers fichiers
            
            if not test_files:
                logger.warning("⚠️ Aucun fichier LucidLink trouvé pour test")
                return True
            
            detection_times = []
            
            for test_file in test_files:
                logger.info(f"🔍 Test avec: {test_file.name}")
                
                start_time = time.time()
                
                # Test de détection rapide
                is_lucidlink = detector.is_lucidlink_file(test_file)
                
                if is_lucidlink:
                    # Test de stabilité avec timeout réduit
                    is_stable = await waiter.wait_for_complete_sync(test_file, max_wait=10)
                    
                    detection_time = time.time() - start_time
                    detection_times.append(detection_time)
                    
                    logger.info(f"  • Détection: {detection_time:.2f}s, Stable: {is_stable}")
                else:
                    logger.info(f"  • Fichier non-LucidLink")
            
            if detection_times:
                avg_time = sum(detection_times) / len(detection_times)
                logger.info(f"📊 Temps moyen détection LucidLink: {avg_time:.2f}s")
                
                if avg_time <= 5:  # Moins de 5 secondes
                    logger.info("✅ Détection LucidLink rapide!")
                    return True
                else:
                    logger.warning(f"⚠️ Détection LucidLink lente: {avg_time:.2f}s")
                    return False
            else:
                logger.info("ℹ️ Aucun fichier LucidLink testé")
                return True
                
        except Exception as e:
            logger.error(f"❌ Erreur test LucidLink: {e}")
            return False
    
    def cleanup(self):
        """Nettoie les fichiers de test"""
        try:
            if self.test_dir.exists():
                shutil.rmtree(self.test_dir)
                logger.info("🧹 Fichiers de test nettoyés")
        except Exception as e:
            logger.warning(f"⚠️ Erreur nettoyage: {e}")
    
    async def run_all_tests(self):
        """Exécute tous les tests de détection"""
        logger.info("🚀 Tests de détection rapide des fichiers")
        
        results = []
        
        try:
            # Test 1: Vitesse de détection du watcher
            logger.info("\n" + "="*50)
            result1 = await self.test_watcher_detection_speed()
            results.append(("Vitesse watcher", result1))
            
            # Test 2: Détection cache LucidLink
            logger.info("\n" + "="*50)
            result2 = await self.test_lucidlink_cache_detection()
            results.append(("Cache LucidLink", result2))
            
            # Résultats
            logger.info("\n" + "="*50)
            logger.info("📊 RÉSULTATS DES TESTS")
            logger.info("="*50)
            
            all_passed = True
            for test_name, result in results:
                status = "✅ PASSED" if result else "❌ FAILED"
                logger.info(f"{test_name}: {status}")
                if not result:
                    all_passed = False
            
            logger.info("="*50)
            if all_passed:
                logger.info("🎉 TOUS LES TESTS PASSÉS - Détection rapide validée!")
            else:
                logger.error("❌ CERTAINS TESTS ÉCHOUÉS - Optimisation nécessaire")
            
            return all_passed
            
        finally:
            self.cleanup()

if __name__ == "__main__":
    test = FileDetectionTest()
    result = asyncio.run(test.run_all_tests())
    sys.exit(0 if result else 1)
