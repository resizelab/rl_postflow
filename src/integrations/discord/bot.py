"""
Discord Bot Module
Provides Discord bot functionality with commands and notifications
"""

import asyncio
import logging
from typing import Dict, Optional, Any
from dataclasses import dataclass
import discord
from discord.ext import commands
import os
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class DiscordBotConfig:
    """Configuration for Discord bot."""
    bot_token: str
    guild_id: Optional[int] = None
    channel_id: Optional[int] = None
    command_prefix: str = "!"
    intents_enabled: bool = True


class DiscordBot:
    """Discord Bot for PostFlow notifications and commands."""
    
    def __init__(self, config: DiscordBotConfig):
        """
        Initialize Discord bot.
        
        Args:
            config: Bot configuration
        """
        self.config = config
        self.bot = None
        self.is_running = False
        self.target_channel = None
        
        # Configure intents
        intents = discord.Intents.default()
        if config.intents_enabled:
            intents.message_content = True
            intents.guild_messages = True
            intents.guilds = True
        
        # Create bot instance
        self.bot = commands.Bot(
            command_prefix=config.command_prefix,
            intents=intents,
            help_command=None
        )
        
        # Setup event handlers
        self._setup_events()
        self._setup_commands()
    
    def _setup_events(self):
        """Setup bot event handlers."""
        
        @self.bot.event
        async def on_ready():
            """Called when bot is ready."""
            logger.info(f"Discord bot logged in as {self.bot.user}")
            
            # Get target channel if specified
            if self.config.channel_id:
                self.target_channel = self.bot.get_channel(self.config.channel_id)
                if self.target_channel:
                    logger.info(f"Target channel set: {self.target_channel.name}")
                else:
                    logger.warning(f"Channel ID {self.config.channel_id} not found")
            
            self.is_running = True
        
        @self.bot.event
        async def on_error(event, *args, **kwargs):
            """Handle bot errors."""
            logger.error(f"Discord bot error in {event}: {args}")
    
    def _setup_commands(self):
        """Setup bot commands."""
        
        @self.bot.command(name='ping')
        async def ping_command(ctx):
            """Test command to check bot responsiveness."""
            latency = round(self.bot.latency * 1000)
            await ctx.send(f"🏓 Pong! Latency: {latency}ms")
        
        @self.bot.command(name='status')
        async def status_command(ctx):
            """Get pipeline status."""
            embed = discord.Embed(
                title="PostFlow Pipeline Status",
                description="Current system status",
                color=0x00ff00
            )
            
            embed.add_field(
                name="Bot Status",
                value="✅ Online",
                inline=True
            )
            
            embed.add_field(
                name="Server",
                value=f"Connected to {ctx.guild.name}",
                inline=True
            )
            
            embed.add_field(
                name="Channel",
                value=f"#{ctx.channel.name}",
                inline=True
            )
            
            await ctx.send(embed=embed)
        
        @self.bot.command(name='help')
        async def help_command(ctx):
            """Show available commands."""
            embed = discord.Embed(
                title="PostFlow Bot Commands",
                description="Available commands for the PostFlow pipeline bot",
                color=0x0099ff
            )
            
            commands_info = [
                ("!ping", "Test bot responsiveness"),
                ("!status", "Get pipeline status"),
                ("!help", "Show this help message")
            ]
            
            for command, description in commands_info:
                embed.add_field(
                    name=command,
                    value=description,
                    inline=False
                )
            
            await ctx.send(embed=embed)
    
    async def send_message(self, content: str, embed: Optional[discord.Embed] = None, 
                          channel_id: Optional[int] = None) -> bool:
        """
        Send a message to a Discord channel.
        
        Args:
            content: Message content
            embed: Optional embed
            channel_id: Channel ID (uses default if not specified)
            
        Returns:
            bool: True if sent successfully
        """
        if not self.is_running:
            logger.warning("Bot is not running, cannot send message")
            return False
        
        try:
            # Determine target channel
            channel = None
            if channel_id:
                channel = self.bot.get_channel(channel_id)
            elif self.target_channel:
                channel = self.target_channel
            
            if not channel:
                logger.error("No target channel available")
                return False
            
            # Send message
            await channel.send(content=content, embed=embed)
            logger.info(f"Sent message to #{channel.name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send Discord message: {e}")
            return False
    
    async def send_notification(self, shot_nomenclature: str, stage: str, status: str, 
                               frameio_link: Optional[str] = None, 
                               mention_user_id: Optional[str] = None) -> bool:
        """
        Send a shot notification with optional user mention.
        
        Args:
            shot_nomenclature: Shot nomenclature
            stage: Pipeline stage
            status: Shot status
            frameio_link: Frame.io review link
            mention_user_id: Discord user ID to mention
            
        Returns:
            bool: True if sent successfully
        """
        # Build message content
        message_parts = []
        
        if mention_user_id:
            message_parts.append(f"Hey <@{mention_user_id}>")
        
        message_parts.append(f"🎬 Le plan **{shot_nomenclature}** est maintenant à l'étape **{stage}**")
        
        if frameio_link:
            message_parts.append(f"📽️ [Voir sur Frame.io]({frameio_link})")
        
        content = " ".join(message_parts)
        
        # Create embed
        embed = discord.Embed(
            title="Notification Pipeline",
            description=f"Mise à jour pour {shot_nomenclature}",
            color=0x00ff00
        )
        
        embed.add_field(name="Plan", value=shot_nomenclature, inline=True)
        embed.add_field(name="Étape", value=stage, inline=True)
        embed.add_field(name="Status", value=status, inline=True)
        
        if frameio_link:
            embed.add_field(name="Review", value=f"[Lien Frame.io]({frameio_link})", inline=False)
        
        return await self.send_message(content, embed)
    
    async def start(self):
        """Start the Discord bot."""
        if self.is_running:
            logger.warning("Bot is already running")
            return
        
        try:
            await self.bot.start(self.config.bot_token)
        except Exception as e:
            logger.error(f"Failed to start Discord bot: {e}")
            raise
    
    async def stop(self):
        """Stop the Discord bot."""
        if not self.is_running:
            return
        
        try:
            await self.bot.close()
            self.is_running = False
            logger.info("Discord bot stopped")
        except Exception as e:
            logger.error(f"Error stopping Discord bot: {e}")
    
    def run(self):
        """Run the Discord bot (blocking)."""
        try:
            self.bot.run(self.config.bot_token)
        except Exception as e:
            logger.error(f"Failed to run Discord bot: {e}")
            raise


def create_discord_bot(bot_token: str, channel_id: Optional[int] = None, 
                      guild_id: Optional[int] = None) -> DiscordBot:
    """
    Create a Discord bot instance.
    
    Args:
        bot_token: Discord bot token
        channel_id: Target channel ID
        guild_id: Guild ID
        
    Returns:
        DiscordBot: Configured Discord bot
    """
    config = DiscordBotConfig(
        bot_token=bot_token,
        guild_id=guild_id,
        channel_id=channel_id
    )
    
    return DiscordBot(config)
