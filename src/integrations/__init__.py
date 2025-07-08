"""
Integrations module initialization
"""

# Import conditionnel pour éviter les erreurs si Discord n'est pas installé
try:
    from .discord import DiscordNotifier, create_discord_notifier
    DISCORD_AVAILABLE = True
except ImportError:
    DISCORD_AVAILABLE = False
    DiscordNotifier = None
    create_discord_notifier = None

__all__ = [
    'DiscordNotifier',
    'create_discord_notifier',
    'DISCORD_AVAILABLE'
]
