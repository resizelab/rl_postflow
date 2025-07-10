"""
Discord Template Factory
Système centralisé pour créer des templates Discord avec timestamp Paris automatique
"""

import pytz
from datetime import datetime
from typing import Dict, List, Optional, Any

# Fuseau horaire Paris
PARIS_TZ = pytz.timezone('Europe/Paris')

def get_paris_time():
    """Retourne l'heure actuelle en fuseau horaire Paris"""
    return datetime.now(PARIS_TZ)

class DiscordTemplateFactory:
    """Factory pour créer des templates Discord standardisés avec timestamp Paris."""
    
    @staticmethod
    def create_base_embed(title: str, description: str, color: int, 
                         fields: List[Dict] = None) -> Dict[str, Any]:
        """
        Crée un embed de base avec timestamp Paris automatique.
        
        Args:
            title: Titre de l'embed
            description: Description de l'embed
            color: Couleur (hex)
            fields: Liste des champs
            
        Returns:
            Dict: Template d'embed avec timestamp Paris
        """
        embed = {
            "title": title,
            "description": description,
            "color": color,
            "fields": fields or [],
            "timestamp": get_paris_time().isoformat(),
            "footer": {
                "text": "RL PostFlow Pipeline"
            }
        }
        return embed
    
    @staticmethod
    def create_success_embed(title: str, description: str, 
                           fields: List[Dict] = None) -> Dict[str, Any]:
        """Crée un embed de succès (vert)."""
        return DiscordTemplateFactory.create_base_embed(
            title, description, 0x00ff00, fields
        )
    
    @staticmethod
    def create_error_embed(title: str, description: str, 
                         fields: List[Dict] = None) -> Dict[str, Any]:
        """Crée un embed d'erreur (rouge)."""
        return DiscordTemplateFactory.create_base_embed(
            title, description, 0xff0000, fields
        )
    
    @staticmethod
    def create_info_embed(title: str, description: str, 
                        fields: List[Dict] = None) -> Dict[str, Any]:
        """Crée un embed d'information (bleu)."""
        return DiscordTemplateFactory.create_base_embed(
            title, description, 0x0099ff, fields
        )
    
    @staticmethod
    def create_warning_embed(title: str, description: str, 
                           fields: List[Dict] = None) -> Dict[str, Any]:
        """Crée un embed d'avertissement (orange)."""
        return DiscordTemplateFactory.create_base_embed(
            title, description, 0xff9900, fields
        )
    
    @staticmethod
    def create_progress_embed(title: str, description: str, 
                            fields: List[Dict] = None) -> Dict[str, Any]:
        """Crée un embed de progression (jaune)."""
        return DiscordTemplateFactory.create_base_embed(
            title, description, 0xffff00, fields
        )
    
    # Templates spécifiques prêts à l'emploi
    
    @staticmethod
    def create_file_processed_embed(filename: str, frameio_link: str = None,
                                  thumbnail_url: str = None) -> Dict[str, Any]:
        """Template pour fichier traité."""
        fields = [
            {"name": "📁 Fichier", "value": filename, "inline": True}
        ]
        
        if frameio_link:
            fields.append({
                "name": "🔗 Frame.io", 
                "value": f"[Voir sur Frame.io]({frameio_link})", 
                "inline": True
            })
        
        embed = DiscordTemplateFactory.create_success_embed(
            "🎬 Fichier traité avec succès",
            f"**{filename}** a été traité et est prêt",
            fields
        )
        
        if thumbnail_url:
            embed["image"] = {"url": thumbnail_url}
            embed["fields"].append({
                "name": "🖼️ Aperçu",
                "value": f"[Thumbnail]({thumbnail_url})",
                "inline": True
            })
        
        return embed
    
    @staticmethod
    def create_pipeline_report_embed(stats: Dict[str, Any]) -> Dict[str, Any]:
        """Template pour rapport de pipeline."""
        fields = [
            {
                "name": "📊 Total",
                "value": f"{stats.get('total_shots', 0)} plans",
                "inline": True
            },
            {
                "name": "✅ Terminés",
                "value": f"{stats.get('completed_shots', 0)} plans",
                "inline": True
            },
            {
                "name": "❌ Échoués",
                "value": f"{stats.get('failed_shots', 0)} plans",
                "inline": True
            },
            {
                "name": "⏳ En attente",
                "value": f"{stats.get('pending_shots', 0)} plans",
                "inline": True
            },
            {
                "name": "🎯 Taux de succès",
                "value": f"{stats.get('upload_success_rate', 0):.1f}%",
                "inline": True
            }
        ]
        
        return DiscordTemplateFactory.create_warning_embed(
            "📊 Rapport de Pipeline RL PostFlow",
            "📈 **Statistiques**:",
            fields
        )
    
    @staticmethod 
    def create_shot_upload_embed(shot_nomenclature: str, scene_name: str,
                               version: str, frameio_link: str) -> Dict[str, Any]:
        """Template pour upload de plan terminé."""
        fields = [
            {"name": "🎬 Plan", "value": shot_nomenclature, "inline": True},
            {"name": "🎞️ Séquence", "value": scene_name, "inline": True},
            {"name": "📄 Version", "value": version, "inline": True},
            {"name": "🔗 Review Link", "value": f"[Voir sur Frame.io]({frameio_link})", "inline": False}
        ]
        
        return DiscordTemplateFactory.create_success_embed(
            "Shot Upload Complete",
            f"Le plan {shot_nomenclature} est prêt pour review",
            fields
        )
    
    @staticmethod
    def create_daily_report_embed(unique_scenes: int, source_files: int,
                                duplicates: int, gaps: int, completion_rate: float,
                                errors: int = 0) -> Dict[str, Any]:
        """Template pour rapport quotidien."""
        fields = [
            {"name": "🎬 Scènes Uniques", "value": str(unique_scenes), "inline": True},
            {"name": "📁 Fichiers Sources", "value": str(source_files), "inline": True},
            {"name": "🔄 Doublons Détectés", "value": str(duplicates), "inline": True},
            {"name": "⚠️ Trous Nomenclature", "value": str(gaps), "inline": True},
            {"name": "📊 Taux de Completion", "value": f"{completion_rate:.1f}%", "inline": True}
        ]
        
        if errors > 0:
            fields.append({
                "name": "🚨 Attention",
                "value": f"{errors} plans en erreur nécessitent une attention",
                "inline": False
            })
        
        return DiscordTemplateFactory.create_base_embed(
            "📋 Rapport Quotidien de Production",
            "Statistiques détaillées du pipeline PostFlow",
            0x9932cc,  # Violet
            fields
        )
