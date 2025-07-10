"""
Discord Bot Integration Module
Provides Discord bot functionality for notifications and commands
"""

# Import conditionnel pour éviter les erreurs si Discord n'est pas installé
try:
    from .bot import DiscordBot
    BOT_AVAILABLE = True
except ImportError:
    DiscordBot = None
    BOT_AVAILABLE = False

from .notifier import DiscordNotifier, create_discord_notifier
from .user_notifier import DiscordUserNotifier

__all__ = ['DiscordBot', 'DiscordNotifier', 'DiscordUserNotifier', 'create_discord_notifier', 'BOT_AVAILABLE']
