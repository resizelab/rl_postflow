#!/usr/bin/env python3
"""
Sheets Tracker - Alias de compatibilité
======================================

Alias pour maintenir la compatibilité avec l'ancien import
Redirige vers le vrai SheetsTracker dans integrations/sheets
"""

# Import du vrai tracker depuis integrations/sheets
from ..integrations.sheets.tracker import SheetsTracker as _SheetsTracker
from ..integrations.sheets.tracker import create_sheets_tracker

# Alias pour compatibilité
SheetsTracker = _SheetsTracker

# Également disponible pour import direct
__all__ = ['SheetsTracker', 'create_sheets_tracker']
