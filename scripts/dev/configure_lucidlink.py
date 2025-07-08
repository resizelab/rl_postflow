#!/usr/bin/env python3
"""
🔧 Configuration optimisée pour LucidLink
=======================================

Script pour ajuster les paramètres du watcher pour LucidLink
"""

import json
import logging
import sys
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def update_pipeline_config_for_lucidlink():
    """Met à jour la configuration du pipeline pour LucidLink"""
    logger.info("🔧 Mise à jour de la configuration pour LucidLink...")
    
    config_path = Path("pipeline_config.json")
    
    # Charger la configuration existante
    if config_path.exists():
        with open(config_path, 'r') as f:
            config = json.load(f)
    else:
        config = {}
    
    # Configuration optimisée pour LucidLink
    lucidlink_config = {
        "file_watcher": {
            "enabled": True,
            "watch_directories": [
                "/Volumes/LucidLink",
                "/mnt/lucidlink",
                "~/LucidLink"
            ],
            "file_extensions": [".mp4", ".mov", ".avi", ".mkv", ".mxf", ".prores"],
            "min_file_size": 1048576,  # 1MB minimum
            "min_file_age": 60,  # 1 minute minimum (augmenté pour LucidLink)
            "max_file_age": 3600,  # 1 heure maximum
            "stability_check": {
                "enabled": True,
                "max_wait": 300,  # 5 minutes pour LucidLink
                "check_interval": 5,  # Vérification toutes les 5 secondes
                "required_stable_checks": 3
            },
            "lucidlink_specific": {
                "enabled": True,
                "sync_timeout": 600,  # 10 minutes pour la synchronisation
                "integrity_check": True,
                "hash_verification": True,
                "partial_file_detection": True
            }
        },
        "frameio_integration": {
            "upload_timeout": 1800,  # 30 minutes pour les gros fichiers
            "retry_attempts": 5,
            "retry_delay": 30,
            "chunk_size": 8388608,  # 8MB chunks
            "concurrent_uploads": 2  # Limite pour éviter la surcharge
        },
        "error_handling": {
            "lucidlink_errors": {
                "sync_timeout": "retry_with_longer_wait",
                "partial_file": "wait_and_retry",
                "access_denied": "retry_with_backoff"
            }
        }
    }
    
    # Fusionner avec la configuration existante
    config.update(lucidlink_config)
    
    # Sauvegarder
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    logger.info("✅ Configuration mise à jour")
    logger.info(f"📁 Fichier: {config_path}")
    
    return config

def update_watcher_state_for_lucidlink():
    """Met à jour l'état du watcher pour LucidLink"""
    logger.info("🔧 Mise à jour de l'état du watcher pour LucidLink...")
    
    state_path = Path("data/watcher_state.json")
    
    if state_path.exists():
        with open(state_path, 'r') as f:
            state = json.load(f)
    else:
        state = {}
    
    # Ajouter des métadonnées LucidLink
    state.update({
        "lucidlink_detection": {
            "enabled": True,
            "last_check": None,
            "mount_points": [],
            "sync_stats": {
                "total_files": 0,
                "sync_failures": 0,
                "avg_sync_time": 0
            }
        },
        "file_processing": {
            "pre_upload_checks": [
                "file_exists",
                "file_accessible",
                "file_stable",
                "lucidlink_synced"
            ],
            "lucidlink_specific_checks": [
                "size_verification",
                "hash_verification",
                "partial_file_detection"
            ]
        }
    })
    
    # Créer le répertoire data si nécessaire
    state_path.parent.mkdir(exist_ok=True)
    
    # Sauvegarder
    with open(state_path, 'w') as f:
        json.dump(state, f, indent=2)
    
    logger.info("✅ État du watcher mis à jour")
    logger.info(f"📁 Fichier: {state_path}")
    
    return state

def main():
    """Fonction principale"""
    logger.info("🚀 Configuration optimisée pour LucidLink...")
    
    try:
        # Mettre à jour la configuration du pipeline
        config = update_pipeline_config_for_lucidlink()
        
        # Mettre à jour l'état du watcher
        state = update_watcher_state_for_lucidlink()
        
        logger.info("✅ Configuration terminée avec succès")
        logger.info("📋 Paramètres clés:")
        logger.info(f"  - Âge minimum fichier: {config.get('file_watcher', {}).get('min_file_age', 'N/A')}s")
        logger.info(f"  - Timeout synchronisation: {config.get('file_watcher', {}).get('lucidlink_specific', {}).get('sync_timeout', 'N/A')}s")
        logger.info(f"  - Timeout upload: {config.get('frameio_integration', {}).get('upload_timeout', 'N/A')}s")
        
        logger.info("🔄 Redémarrez le pipeline pour appliquer les changements")
        
        return 0
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la configuration: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
