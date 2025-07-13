"""
🎬 RL PostFlow - Safe Logging pour Windows
==========================================

Gestionnaire de logging sécurisé pour les emojis sur Windows
Évite les erreurs d'encodage UTF-8 vs CP1252

Version: 4.1.5
Date: 13 juillet 2025
"""

import logging
import platform
import sys
from typing import Any

def safe_log_info(logger: logging.Logger, message: str, *args: Any) -> None:
    """
    Log info avec encodage sécurisé pour Windows
    """
    try:
        if platform.system() == "Windows":
            # Remplacer les emojis problématiques sur Windows
            safe_message = message.replace("✅", "[OK]").replace("🖥️", "[PC]").replace("📁", "[DIR]")
            logger.info(safe_message, *args)
        else:
            logger.info(message, *args)
    except UnicodeEncodeError:
        # Fallback sans emojis
        safe_message = message.encode('ascii', 'ignore').decode('ascii')
        logger.info(f"[SAFE] {safe_message}", *args)

def safe_log_error(logger: logging.Logger, message: str, *args: Any) -> None:
    """
    Log error avec encodage sécurisé pour Windows
    """
    try:
        if platform.system() == "Windows":
            safe_message = message.replace("❌", "[ERR]").replace("⚠️", "[WARN]")
            logger.error(safe_message, *args)
        else:
            logger.error(message, *args)
    except UnicodeEncodeError:
        safe_message = message.encode('ascii', 'ignore').decode('ascii')
        logger.error(f"[SAFE] {safe_message}", *args)

def safe_log_warning(logger: logging.Logger, message: str, *args: Any) -> None:
    """
    Log warning avec encodage sécurisé pour Windows
    """
    try:
        if platform.system() == "Windows":
            safe_message = message.replace("⚠️", "[WARN]").replace("🔧", "[FIX]")
            logger.warning(safe_message, *args)
        else:
            logger.warning(message, *args)
    except UnicodeEncodeError:
        safe_message = message.encode('ascii', 'ignore').decode('ascii')
        logger.warning(f"[SAFE] {safe_message}", *args)
