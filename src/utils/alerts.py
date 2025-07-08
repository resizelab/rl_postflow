"""
Système d'alertes et notifications pour Frame.io
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from pathlib import Path
from dataclasses import dataclass
from enum import Enum
import aiohttp

logger = logging.getLogger(__name__)

class AlertLevel(Enum):
    """Niveaux d'alerte"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class Alert:
    """Classe représentant une alerte"""
    level: AlertLevel
    title: str
    message: str
    timestamp: datetime
    category: str
    metadata: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'level': self.level.value,
            'title': self.title,
            'message': self.message,
            'timestamp': self.timestamp.isoformat(),
            'category': self.category,
            'metadata': self.metadata
        }

class AlertRule:
    """Règle de génération d'alerte"""
    
    def __init__(self, name: str, condition: Callable[[Dict[str, Any]], bool], 
                 level: AlertLevel, title: str, message_template: str):
        self.name = name
        self.condition = condition
        self.level = level
        self.title = title
        self.message_template = message_template
        self.last_triggered = None
        self.cooldown_minutes = 30  # Éviter le spam
    
    def should_trigger(self, metrics: Dict[str, Any]) -> bool:
        """Vérifier si l'alerte doit être déclenchée"""
        if not self.condition(metrics):
            return False
        
        # Vérifier le cooldown
        if self.last_triggered:
            if datetime.now() - self.last_triggered < timedelta(minutes=self.cooldown_minutes):
                return False
        
        return True
    
    def create_alert(self, metrics: Dict[str, Any]) -> Alert:
        """Créer une alerte basée sur les métriques"""
        self.last_triggered = datetime.now()
        
        # Formater le message avec les métriques
        message = self.message_template.format(**metrics)
        
        return Alert(
            level=self.level,
            title=self.title,
            message=message,
            timestamp=datetime.now(),
            category="frameio",
            metadata=metrics
        )

class NotificationChannel:
    """Canal de notification abstrait"""
    
    async def send(self, alert: Alert) -> bool:
        """Envoyer une alerte"""
        raise NotImplementedError

class DiscordNotificationChannel(NotificationChannel):
    """Canal de notification Discord"""
    
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url
    
    async def send(self, alert: Alert) -> bool:
        """Envoyer une alerte via Discord"""
        try:
            color_map = {
                AlertLevel.INFO: 0x00FF00,      # Vert
                AlertLevel.WARNING: 0xFFFF00,   # Jaune
                AlertLevel.ERROR: 0xFF8000,     # Orange
                AlertLevel.CRITICAL: 0xFF0000   # Rouge
            }
            
            embed = {
                "title": f"🚨 {alert.title}",
                "description": alert.message,
                "color": color_map.get(alert.level, 0x808080),
                "timestamp": alert.timestamp.isoformat(),
                "fields": [
                    {
                        "name": "Niveau",
                        "value": alert.level.value.upper(),
                        "inline": True
                    },
                    {
                        "name": "Catégorie",
                        "value": alert.category,
                        "inline": True
                    },
                    {
                        "name": "Timestamp",
                        "value": alert.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                        "inline": True
                    }
                ],
                "footer": {
                    "text": "RL PostFlow - Frame.io Monitoring"
                }
            }
            
            # Ajouter des champs de métadonnées si disponibles
            if alert.metadata:
                for key, value in alert.metadata.items():
                    if isinstance(value, (int, float, str)) and len(str(value)) < 100:
                        embed["fields"].append({
                            "name": key.replace('_', ' ').title(),
                            "value": str(value),
                            "inline": True
                        })
            
            payload = {
                "embeds": [embed]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.webhook_url, json=payload) as response:
                    if response.status == 204:
                        logger.info(f"Alerte Discord envoyée: {alert.title}")
                        return True
                    else:
                        logger.error(f"Erreur envoi Discord: {response.status}")
                        return False
                        
        except Exception as e:
            logger.error(f"Erreur notification Discord: {e}")
            return False

class EmailNotificationChannel(NotificationChannel):
    """Canal de notification Email (exemple)"""
    
    def __init__(self, smtp_config: Dict[str, Any]):
        self.smtp_config = smtp_config
    
    async def send(self, alert: Alert) -> bool:
        """Envoyer une alerte par email"""
        # Implémentation SMTP basique
        # Dans un vrai projet, utiliser aiosmtplib
        logger.info(f"Email notification: {alert.title}")
        return True

class AlertManager:
    """Gestionnaire d'alertes principal"""
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or Path(__file__).parent.parent / "config" / "alerts.json"
        self.config = self._load_config()
        self.rules = self._create_rules()
        self.channels = self._create_channels()
        self.alert_history = []
        self.max_history = 1000
    
    def _load_config(self) -> Dict[str, Any]:
        """Charger la configuration d'alertes"""
        default_config = {
            "enabled": True,
            "channels": {
                "discord": {
                    "enabled": False,
                    "webhook_url": ""
                },
                "email": {
                    "enabled": False,
                    "smtp_server": "",
                    "smtp_port": 587,
                    "username": "",
                    "password": "",
                    "from_email": "",
                    "to_emails": []
                }
            },
            "rules": {
                "high_error_rate": {
                    "enabled": True,
                    "threshold": 0.05,
                    "cooldown_minutes": 30
                },
                "slow_api_response": {
                    "enabled": True,
                    "threshold": 5.0,
                    "cooldown_minutes": 15
                },
                "low_cache_hit_rate": {
                    "enabled": True,
                    "threshold": 0.7,
                    "cooldown_minutes": 60
                },
                "high_memory_usage": {
                    "enabled": True,
                    "threshold": 500,
                    "cooldown_minutes": 30
                },
                "upload_failure": {
                    "enabled": True,
                    "threshold": 0.1,
                    "cooldown_minutes": 15
                }
            }
        }
        
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r') as f:
                    user_config = json.load(f)
                    # Fusionner avec la config par défaut
                    self._deep_merge(default_config, user_config)
            else:
                # Créer la config par défaut
                self.config_path.parent.mkdir(parents=True, exist_ok=True)
                with open(self.config_path, 'w') as f:
                    json.dump(default_config, f, indent=2)
                logger.info(f"Configuration d'alertes créée: {self.config_path}")
                
        except Exception as e:
            logger.error(f"Erreur chargement config alertes: {e}")
            return default_config
        
        return default_config
    
    def _deep_merge(self, base: Dict, update: Dict) -> Dict:
        """Fusion récursive de dictionnaires"""
        for key, value in update.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._deep_merge(base[key], value)
            else:
                base[key] = value
        return base
    
    def _create_rules(self) -> List[AlertRule]:
        """Créer les règles d'alerte"""
        rules = []
        
        # Règle: Taux d'erreur élevé
        if self.config["rules"]["high_error_rate"]["enabled"]:
            threshold = self.config["rules"]["high_error_rate"]["threshold"]
            rule = AlertRule(
                name="high_error_rate",
                condition=lambda m: m.get("error_rate", 0) > threshold,
                level=AlertLevel.ERROR,
                title="Taux d'erreur élevé",
                message_template="Taux d'erreur: {error_rate:.1%} (seuil: " + f"{threshold:.1%})"
            )
            rule.cooldown_minutes = self.config["rules"]["high_error_rate"]["cooldown_minutes"]
            rules.append(rule)
        
        # Règle: Réponse API lente
        if self.config["rules"]["slow_api_response"]["enabled"]:
            threshold = self.config["rules"]["slow_api_response"]["threshold"]
            rule = AlertRule(
                name="slow_api_response",
                condition=lambda m: m.get("average_api_duration", 0) > threshold,
                level=AlertLevel.WARNING,
                title="Réponse API lente",
                message_template="Latence moyenne: {average_api_duration:.2f}s (seuil: " + f"{threshold}s)"
            )
            rule.cooldown_minutes = self.config["rules"]["slow_api_response"]["cooldown_minutes"]
            rules.append(rule)
        
        # Règle: Faible taux de cache hit
        if self.config["rules"]["low_cache_hit_rate"]["enabled"]:
            threshold = self.config["rules"]["low_cache_hit_rate"]["threshold"]
            rule = AlertRule(
                name="low_cache_hit_rate",
                condition=lambda m: m.get("cache_hit_rate", 1) < threshold,
                level=AlertLevel.WARNING,
                title="Faible taux de cache hit",
                message_template="Taux de cache hit: {cache_hit_rate:.1%} (seuil: " + f"{threshold:.1%})"
            )
            rule.cooldown_minutes = self.config["rules"]["low_cache_hit_rate"]["cooldown_minutes"]
            rules.append(rule)
        
        # Règle: Utilisation mémoire élevée
        if self.config["rules"]["high_memory_usage"]["enabled"]:
            threshold = self.config["rules"]["high_memory_usage"]["threshold"]
            rule = AlertRule(
                name="high_memory_usage",
                condition=lambda m: m.get("memory_mb", 0) > threshold,
                level=AlertLevel.WARNING,
                title="Utilisation mémoire élevée",
                message_template="Utilisation mémoire: {memory_mb:.1f}MB (seuil: " + f"{threshold}MB)"
            )
            rule.cooldown_minutes = self.config["rules"]["high_memory_usage"]["cooldown_minutes"]
            rules.append(rule)
        
        # Règle: Échec d'upload
        if self.config["rules"]["upload_failure"]["enabled"]:
            threshold = self.config["rules"]["upload_failure"]["threshold"]
            rule = AlertRule(
                name="upload_failure",
                condition=lambda m: m.get("upload_failure_rate", 0) > threshold,
                level=AlertLevel.ERROR,
                title="Échecs d'upload fréquents",
                message_template="Taux d'échec upload: {upload_failure_rate:.1%} (seuil: " + f"{threshold:.1%})"
            )
            rule.cooldown_minutes = self.config["rules"]["upload_failure"]["cooldown_minutes"]
            rules.append(rule)
        
        return rules
    
    def _create_channels(self) -> List[NotificationChannel]:
        """Créer les canaux de notification"""
        channels = []
        
        # Canal Discord
        if self.config["channels"]["discord"]["enabled"]:
            webhook_url = self.config["channels"]["discord"]["webhook_url"]
            if webhook_url:
                channels.append(DiscordNotificationChannel(webhook_url))
        
        # Canal Email
        if self.config["channels"]["email"]["enabled"]:
            smtp_config = self.config["channels"]["email"]
            channels.append(EmailNotificationChannel(smtp_config))
        
        return channels
    
    async def check_metrics(self, metrics: Dict[str, Any]) -> List[Alert]:
        """Vérifier les métriques et générer les alertes"""
        if not self.config["enabled"]:
            return []
        
        alerts = []
        
        for rule in self.rules:
            if rule.should_trigger(metrics):
                alert = rule.create_alert(metrics)
                alerts.append(alert)
                
                # Ajouter à l'historique
                self.alert_history.append(alert)
                if len(self.alert_history) > self.max_history:
                    self.alert_history.pop(0)
        
        # Envoyer les alertes
        for alert in alerts:
            await self._send_alert(alert)
        
        return alerts
    
    async def _send_alert(self, alert: Alert):
        """Envoyer une alerte via tous les canaux"""
        for channel in self.channels:
            try:
                await channel.send(alert)
            except Exception as e:
                logger.error(f"Erreur envoi alerte via {type(channel).__name__}: {e}")
    
    def get_alert_history(self, hours: int = 24) -> List[Alert]:
        """Récupérer l'historique des alertes"""
        cutoff = datetime.now() - timedelta(hours=hours)
        return [alert for alert in self.alert_history if alert.timestamp > cutoff]
    
    def get_alert_stats(self) -> Dict[str, Any]:
        """Obtenir les statistiques d'alertes"""
        if not self.alert_history:
            return {"total": 0, "by_level": {}, "by_category": {}}
        
        by_level = {}
        by_category = {}
        
        for alert in self.alert_history:
            level = alert.level.value
            category = alert.category
            
            by_level[level] = by_level.get(level, 0) + 1
            by_category[category] = by_category.get(category, 0) + 1
        
        return {
            "total": len(self.alert_history),
            "by_level": by_level,
            "by_category": by_category,
            "last_alert": self.alert_history[-1].timestamp.isoformat() if self.alert_history else None
        }

# Exemple d'utilisation
async def example_usage():
    """Exemple d'utilisation du système d'alertes"""
    alert_manager = AlertManager()
    
    # Métriques d'exemple
    metrics = {
        "error_rate": 0.08,  # 8% d'erreurs
        "average_api_duration": 6.2,  # 6.2 secondes
        "cache_hit_rate": 0.65,  # 65% de cache hit
        "memory_mb": 520,  # 520MB de mémoire
        "upload_failure_rate": 0.15  # 15% d'échecs d'upload
    }
    
    # Vérifier et envoyer les alertes
    alerts = await alert_manager.check_metrics(metrics)
    
    print(f"Alertes générées: {len(alerts)}")
    for alert in alerts:
        print(f"- {alert.level.value.upper()}: {alert.title}")

if __name__ == "__main__":
    asyncio.run(example_usage())
