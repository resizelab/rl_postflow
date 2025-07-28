#!/usr/bin/env python3
"""
Frame.io Manager - Alias de compatibilité
=========================================

Alias pour maintenir la compatibilité avec l'ancien import
Redirige vers le vrai FrameIOUploadManager dans bootstrap
"""

# Import du vrai manager depuis bootstrap
from ...bootstrap.frameio_initializer import FrameIOInitializer

# Alias pour compatibilité
FrameIOManager = FrameIOInitializer

# Également disponible pour import direct
__all__ = ['FrameIOManager', 'FrameIOInitializer']
