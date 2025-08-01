"""
📱 Discord Comment Notifier V2 - Design Minimaliste et Moderne
==============================================================

Nouvelle approche pour les notifications de commentaires Discord :
- Design épuré et minimaliste
- Informations essentielles uniquement  
- Code couleur intuitif
- Format compact et moderne

Version: 4.2.0
Date: Août 2025
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime
import requests

logger = logging.getLogger(__name__)

class ModernCommentNotifier:
    """Notificateur Discord moderne pour les commentaires Frame.io"""
    
    def __init__(self, webhook_url: str, bot_name: str = "PostFlow", share_manager=None):
        self.webhook_url = webhook_url
        self.bot_name = bot_name
        # Avatar URL valide pour Discord (ou None pour utiliser l'avatar par défaut)
        self.avatar_url = "https://cdn.discordapp.com/embed/avatars/0.png"
        self.share_manager = share_manager  # Gestionnaire Frame.io shares
    
    def send_comment_notification(self, 
                                shot_name: str,
                                commenter: str, 
                                comment_text: str,
                                review_status: str = "NEED_REVIEW",
                                frameio_link: Optional[str] = None,
                                timecode: Optional[str] = None,
                                file_id: Optional[str] = None) -> bool:
        """
        Envoie une notification de commentaire avec design minimaliste
        
        Args:
            shot_name: Nom du plan (ex: "UNDLM_00146")
            commenter: Nom du commentateur
            comment_text: Texte du commentaire
            review_status: Statut automatiquement détecté
            frameio_link: Lien Frame.io (sera remplacé par share link si possible)
            timecode: Timecode optionnel
            file_id: ID du fichier Frame.io pour créer un share link
        """
        try:
            # Déterminer l'émoji et couleur selon le statut
            status_config = self._get_status_config(review_status)
            
            # Nettoyer et formater le nom du commentateur
            clean_commenter = self._format_commenter_name(commenter)
            
            # Créer un lien de partage si possible
            share_link = self._get_or_create_share_link(file_id, shot_name)
            final_link = share_link or frameio_link
            
            # Format minimaliste : une seule ligne principale
            main_message = f"{status_config['emoji']} **{shot_name}** · {clean_commenter}"
            
            # Embed ultra-compact
            embed = {
                "description": f"💬 {comment_text[:150]}{'...' if len(comment_text) > 150 else ''}",
                "color": status_config['color']
            }
            
            # Ajouter footer discret avec infos secondaires
            footer_parts = []
            if timecode:
                footer_parts.append(f"⏱️ {timecode}")
            if final_link:
                if share_link:
                    footer_parts.append("🔗 Partage Frame.io")  # Indiquer que c'est un lien de partage
                else:
                    footer_parts.append("📺 Frame.io")  # Lien classique
            
            if footer_parts:
                embed["footer"] = {
                    "text": " • ".join(footer_parts)
                }
            
            # Timestamp moderne
            embed["timestamp"] = datetime.now().isoformat()
            
            return self._send_to_discord(main_message, embed, final_link)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification commentaire moderne: {e}")
            return False
    
    def send_batch_comments_summary(self, comments_data: Dict[str, Any]) -> bool:
        """
        Notification groupée pour plusieurs commentaires (design compact)
        """
        try:
            shot_name = comments_data.get('shot_name', 'Plan inconnu')
            comments_count = comments_data.get('count', 0)
            latest_status = comments_data.get('latest_status', 'NEED_REVIEW')
            
            status_config = self._get_status_config(latest_status)
            
            main_message = f"{status_config['emoji']} **{shot_name}** · {comments_count} nouveaux commentaires"
            
            embed = {
                "description": f"📊 {comments_count} commentaires reçus",
                "color": status_config['color'],
                "footer": {
                    "text": f"Statut: {latest_status} • Frame.io"
                },
                "timestamp": datetime.now().isoformat()
            }
            
            return self._send_to_discord(main_message, embed)
            
        except Exception as e:
            logger.error(f"❌ Erreur notification groupée: {e}")
            return False
    
    def _get_status_config(self, status: str) -> Dict[str, Any]:
        """Configuration moderne des statuts avec émojis et couleurs"""
        configs = {
            'APPROVED': {
                'emoji': '✅',
                'color': 0x00D26A,  # Vert Discord moderne
                'label': 'Approuvé'
            },
            'NEED_REWORK': {
                'emoji': '🔄',
                'color': 0xFAA61A,  # Orange Discord moderne  
                'label': 'À réviser'
            },
            'REJECTED': {
                'emoji': '❌',
                'color': 0xED4245,  # Rouge Discord moderne
                'label': 'Rejeté'
            },
            'NEED_REVIEW': {
                'emoji': '⏳',
                'color': 0x5865F2,  # Bleu Discord moderne (blurple)
                'label': 'En attente'
            }
        }
        return configs.get(status, configs['NEED_REVIEW'])
    
    def _format_commenter_name(self, commenter: str) -> str:
        """Formate et nettoie le nom du commentateur pour un affichage optimal"""
        
        # Debug logging
        logger.debug(f"🔍 Formatage nom d'origine: '{commenter}' (type: {type(commenter)})")
        
        if not commenter or commenter.strip() == "":
            logger.warning("⚠️ Nom commentateur vide, utilisation fallback 'Utilisateur'")
            return "Utilisateur"
        
        # Nettoyer le nom (supprimer espaces supplémentaires)
        clean_name = commenter.strip()
        
        # Cas spéciaux Frame.io
        if clean_name in ['Frame.io User', 'Inconnu', 'Unknown', 'None']:
            logger.warning(f"⚠️ Nom générique détecté: '{clean_name}', utilisation fallback")
            return "Utilisateur"
        
        # Si c'est un email, extraire juste le nom avant @
        if "@" in clean_name:
            clean_name = clean_name.split("@")[0]
            # Remplacer les points par des espaces pour les emails
            clean_name = clean_name.replace(".", " ")
        
        # Vérifier si le nom est vide après nettoyage
        if not clean_name or clean_name.strip() == "":
            logger.warning("⚠️ Nom vide après nettoyage, utilisation fallback")
            return "Utilisateur"
        
        # Limiter la longueur pour éviter les noms trop longs dans Discord
        if len(clean_name) > 25:
            clean_name = clean_name[:22] + "..."
        
        # Capitaliser intelligemment en préservant les caractères spéciaux
        # Séparer sur les espaces et tirets
        parts = []
        for part in clean_name.split():
            # Traiter chaque partie en préservant les tirets et apostrophes
            subparts = []
            for subpart in part.replace("-", " - ").replace("'", " ' ").split():
                if subpart in ["-", "'"]:
                    subparts.append(subpart)
                elif len(subpart) > 0:
                    subparts.append(subpart.capitalize())
            parts.append("".join(subparts))
        
        formatted_name = " ".join(parts)
        
        # Debug du résultat
        logger.debug(f"✅ Nom formaté: '{commenter}' → '{formatted_name}'")
        
        return formatted_name
    
    def _get_or_create_share_link(self, file_id: Optional[str], shot_name: str) -> Optional[str]:
        """
        Récupère ou crée un lien de partage Frame.io pour le fichier
        
        Args:
            file_id: ID du fichier Frame.io
            shot_name: Nom du shot pour nommer le partage
            
        Returns:
            URL du lien de partage ou None si impossible
        """
        if not file_id or not self.share_manager:
            logger.debug("🔗 Pas de file_id ou share_manager disponible")
            return None
        
        try:
            # Créer un lien de partage pour ce fichier
            share_url = self.share_manager.create_share_for_shot(
                file_id=file_id,
                shot_name=shot_name,
                expires_in_days=30  # Lien valide 30 jours
            )
            
            if share_url:
                logger.info(f"🔗 Lien de partage créé pour {shot_name}: {share_url[:50]}...")
                return share_url
            else:
                logger.warning(f"⚠️ Impossible de créer un lien de partage pour {shot_name}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Erreur création lien de partage pour {shot_name}: {e}")
            return None
    
    def _send_to_discord(self, message: str, embed: Dict[str, Any], 
                        action_url: Optional[str] = None) -> bool:
        """Envoi vers Discord avec payload optimisé"""
        try:
            payload = {
                "content": message,
                "username": self.bot_name,
                "embeds": [embed]
            }
            
            # Ajouter bouton d'action si lien Frame.io disponible
            if action_url:
                embed["url"] = action_url
            
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
            logger.info(f"📱 Notification moderne envoyée: {message[:50]}...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Échec envoi Discord: {e}")
            return False


# =============================================================================
# COMPARAISON : ANCIEN VS NOUVEAU FORMAT
# =============================================================================

def demo_comparison():
    """Démonstration de la différence entre ancien et nouveau format"""
    
    print("📱 COMPARAISON DES FORMATS DISCORD")
    print("=" * 60)
    
    # Données d'exemple
    shot_name = "UNDLM_00146"
    commenter = "Antoine Réalisateur"
    comment_text = "Super boulot sur cette séquence ! Juste un petit ajustement sur la colorimétrie des ombres vers 00:12. Le mouvement de caméra est parfait."
    review_status = "NEED_REWORK"
    
    print("\n🟥 ANCIEN FORMAT (Verbeux):")
    print("-" * 30)
    old_format = f"""
💬 **Nouveau commentaire de review**

📋 Shot UNDLM_00146 - Version 1
👤 Commentaire de Antoine Réalisateur

**Commentaire:**
{comment_text}

**Timecode:** 00:12
**Frame.io:** [📺 Voir sur Frame.io](https://app.frame.io/...)
**Statut détecté:** NEED_REWORK - Modifications requises
**Timestamp:** Frame.io Review • Antoine Réalisateur
"""
    print(old_format)
    
    print("\n🟢 NOUVEAU FORMAT (Minimaliste):")
    print("-" * 30)
    new_format = f"""
🔄 **{shot_name}** · {commenter}

💬 {comment_text[:80]}...

⏱️ 00:12 • 📺 Frame.io
"""
    print(new_format)
    
    print("\n📊 ANALYSE:")
    print("- Réduction de ~70% du texte")
    print("- Information essentielle préservée") 
    print("- Design plus moderne et épuré")
    print("- Lecture plus rapide")
    print("- Couleurs Discord natives")


# =============================================================================
# TEMPLATES PRÊTS À L'EMPLOI
# =============================================================================

MODERN_TEMPLATES = {
    'single_comment': {
        'message': "{emoji} **{shot_name}** · {commenter}",
        'embed': {
            'description': "💬 {comment_text}",
            'color': "{status_color}",
            'footer': {'text': "{timecode} • 📺 Frame.io"},
            'timestamp': "{timestamp}"
        }
    },
    
    'batch_comments': {
        'message': "{emoji} **{shot_name}** · {count} commentaires",
        'embed': {
            'description': "📊 {count} nouveaux commentaires",
            'color': "{status_color}",
            'footer': {'text': "Statut: {status} • Frame.io"}
        }
    },
    
    'status_change': {
        'message': "{emoji} **{shot_name}** → {new_status}",
        'embed': {
            'description': "🔄 Statut mis à jour automatiquement",
            'color': "{status_color}",
            'footer': {'text': "IA PostFlow"}
        }
    }
}


if __name__ == "__main__":
    # Démonstration
    demo_comparison()
