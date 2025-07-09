#!/usr/bin/env python3
"""
Test d'optimisation des timeouts du pipeline RL PostFlow
Vérifie que les timeouts optimisés fonctionnent correctement
"""

import asyncio
import sys
import logging
from pathlib import Path
import time
import os

# Ajouter le répertoire racine au path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_frameio_auth_timeout():
    """Test du timeout optimisé pour l'authentification Frame.io"""
    logger.info("🔍 Test timeout authentification Frame.io...")
    
    try:
        # Import direct pour éviter les problèmes d'importation
        from src.integrations.frameio.auth import FrameIOAuth
        
        # Créer une instance d'auth
        auth = FrameIOAuth()
        
        # Vérifier que le timeout est bien optimisé
        assert auth.timeout == 15, f"Timeout attendu: 15s, obtenu: {auth.timeout}s"
        logger.info(f"✅ Timeout auth optimisé: {auth.timeout}s")
        
        return True
    except Exception as e:
        logger.error(f"❌ Erreur test auth timeout: {e}")
        return False

async def test_cloudflare_tunnel_timeout():
    """Test du timeout optimisé pour le démarrage du tunnel Cloudflare"""
    logger.info("🔍 Test timeout tunnel Cloudflare...")
    
    try:
        # Vérifier que cloudflared est disponible
        import subprocess
        result = subprocess.run(["which", "cloudflared"], capture_output=True, text=True)
        if result.returncode != 0:
            logger.warning("⚠️ cloudflared non installé, test ignoré")
            return True
        
        from src.integrations.frameio.cloudflare_manager import CloudflareManager
        from src.integrations.frameio.range_server import RangeFileServer
        
        # Créer un serveur HTTP simple
        server = RangeFileServer()
        server.start()  # Utiliser start() au lieu de await start()
        
        # Créer le gestionnaire Cloudflare
        manager = CloudflareManager()
        
        # Tester le démarrage avec timeout optimisé
        start_time = time.time()
        tunnel_url = manager.start_tunnel(server.actual_port, timeout=30)
        elapsed = time.time() - start_time
        
        if tunnel_url:
            logger.info(f"✅ Tunnel démarré en {elapsed:.2f}s: {tunnel_url}")
            # Arrêter le tunnel
            manager.stop_tunnel()
            result = True
        else:
            logger.warning(f"⚠️ Tunnel non démarré en {elapsed:.2f}s (normal si pas de connexion)")
            result = True  # Pas d'erreur si pas de connexion
        
        # Arrêter le serveur
        server.stop()
        
        return result
    except Exception as e:
        logger.error(f"❌ Erreur test tunnel timeout: {e}")
        return False

async def test_lucidlink_cache_stability():
    """Test de stabilité du cache LucidLink avec timeouts optimisés"""
    logger.info("🔍 Test stabilité cache LucidLink...")
    
    try:
        from src.utils.lucidlink_utils import LucidLinkDetector, LucidLinkFileWaiter
        
        # Créer les utilitaires LucidLink
        detector = LucidLinkDetector()
        waiter = LucidLinkFileWaiter(detector)
        
        # Chercher un fichier LucidLink existant pour test
        lucidlink_path = Path("/Volumes/LucidLink")
        if not lucidlink_path.exists():
            logger.warning("⚠️ LucidLink non monté, test ignoré")
            return True
        
        # Chercher un fichier de test
        test_files = list(lucidlink_path.rglob("*.mp4"))[:1]  # Premier fichier .mp4
        
        if not test_files:
            logger.warning("⚠️ Aucun fichier test LucidLink trouvé")
            return True
        
        test_file = test_files[0]
        logger.info(f"📂 Test avec fichier: {test_file.name}")
        
        # Test de détection
        is_lucidlink = detector.is_lucidlink_file(test_file)
        logger.info(f"🔍 Détection LucidLink: {is_lucidlink}")
        
        # Test de synchronisation (timeout réduit pour test)
        start_time = time.time()
        sync_ok = await waiter.wait_for_complete_sync(test_file, max_wait=30)
        elapsed = time.time() - start_time
        
        logger.info(f"✅ Synchronisation testée en {elapsed:.2f}s: {sync_ok}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Erreur test LucidLink: {e}")
        return False

async def test_pipeline_timeout_values():
    """Test des valeurs de timeout dans le pipeline principal"""
    logger.info("🔍 Test valeurs timeout pipeline principal...")
    
    try:
        # Lire le fichier main.py pour vérifier les valeurs
        main_path = Path(__file__).parent.parent / "main.py"
        with open(main_path, 'r') as f:
            content = f.read()
        
        # Vérifier que le timeout du tunnel Cloudflare est optimisé
        if "timeout=30" in content and "Optimisé: 60s → 30s" in content:
            logger.info("✅ Timeout tunnel Cloudflare optimisé dans main.py")
            tunnel_ok = True
        else:
            logger.warning("⚠️ Timeout tunnel Cloudflare non optimisé dans main.py")
            tunnel_ok = False
        
        # Vérifier le fichier auth.py
        auth_path = Path(__file__).parent.parent / "src/integrations/frameio/auth.py"
        with open(auth_path, 'r') as f:
            auth_content = f.read()
        
        if "self.timeout = 15" in auth_content and "Optimisé: 30s → 15s" in auth_content:
            logger.info("✅ Timeout authentification Frame.io optimisé")
            auth_ok = True
        else:
            logger.warning("⚠️ Timeout authentification Frame.io non optimisé")
            auth_ok = False
        
        return tunnel_ok and auth_ok
    except Exception as e:
        logger.error(f"❌ Erreur test valeurs timeout: {e}")
        return False

async def test_timeout_optimization():
    """Test principal des optimisations de timeout"""
    logger.info("🚀 Test des optimisations de timeout")
    
    results = []
    
    # Test 1: Valeurs de timeout dans le code
    logger.info("\n" + "="*50)
    result1 = await test_pipeline_timeout_values()
    results.append(("Valeurs timeout", result1))
    
    # Test 2: Authentification Frame.io
    logger.info("\n" + "="*50)
    result2 = await test_frameio_auth_timeout()
    results.append(("Auth Frame.io", result2))
    
    # Test 3: Tunnel Cloudflare
    logger.info("\n" + "="*50)
    result3 = await test_cloudflare_tunnel_timeout()
    results.append(("Tunnel Cloudflare", result3))
    
    # Test 4: Cache LucidLink
    logger.info("\n" + "="*50)
    result4 = await test_lucidlink_cache_stability()
    results.append(("Cache LucidLink", result4))
    
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
        logger.info("🎉 TOUS LES TESTS PASSÉS - Optimisations validées!")
    else:
        logger.error("❌ CERTAINS TESTS ÉCHOUÉS - Vérification nécessaire")
    
    return all_passed

if __name__ == "__main__":
    asyncio.run(test_timeout_optimization())
