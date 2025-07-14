"""
Google Integrations Module
Gestionnaire centralisé des connexions Google (Sheets, Drive)
"""

from .connection_manager import GoogleConnectionManager, connection_manager
from .optimized_sheets_adapter import OptimizedSheetsStatusAdapter

__all__ = [
    'GoogleConnectionManager',
    'connection_manager',
    'OptimizedSheetsStatusAdapter'
]
