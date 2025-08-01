"""
🔗 Frame.io Share Links Manager
===============================

Gestion des liens de partage Frame.io pour permettre l'accès
aux fichiers sans compte Frame.io connecté.

Utilise l'API Frame.io Shares pour créer des liens publics
sécurisés avec contrôle d'accès.

Version: 4.2.0
Date: Août 2025
"""

import logging
import requests
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class FrameIOShareManager:
    """Gestionnaire des liens de partage Frame.io avec cache par asset"""
    
    def __init__(self, api_token: str, account_id: str, project_id: str = None):
        """
        Initialise le gestionnaire de partage
        
        Args:
            api_token: Token API Frame.io
            account_id: ID du compte Frame.io
            project_id: ID du projet Frame.io (optionnel, peut être récupéré automatiquement)
        """
        self.api_token = api_token
        self.account_id = account_id
        self.project_id = project_id
        self.base_url = "https://api.frame.io/v4"  # Utiliser v4 au lieu de v2
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
        # Cache des liens de partage par asset_id pour éviter la duplication
        self._share_cache = {}
        
    def create_share_link(self, 
                         file_id: str, 
                         asset_name: str = None,
                         expires_in_days: int = 30,
                         password_protected: bool = False,
                         download_enabled: bool = False) -> Optional[Dict[str, Any]]:
        """
        Crée un lien de partage pour un fichier Frame.io
        
        Args:
            file_id: ID du fichier Frame.io
            asset_name: Nom de l'asset (optionnel)
            expires_in_days: Nombre de jours avant expiration (défaut: 30)
            password_protected: Protéger par mot de passe
            download_enabled: Autoriser le téléchargement
            
        Returns:
            Dict contenant les informations du lien de partage ou None si erreur
        """
        try:
            # Calculer la date d'expiration
            expires_at = datetime.now() + timedelta(days=expires_in_days)
            
            # Préparer les données de la requête pour l'API v4
            share_data = {
                "asset_id": file_id,
                "name": asset_name or f"Share for {file_id}",
                "expires_at": expires_at.isoformat() + "Z",
                "download_enabled": download_enabled,
                "password_protected": password_protected
            }
            
            logger.info(f"🔗 Création lien de partage pour file_id: {file_id}")
            logger.debug(f"📋 Données partage: {json.dumps(share_data, indent=2)}")
            
            # Construire l'URL avec project_id
            project_id = self.project_id or self._get_project_id_from_file(file_id)
            if not project_id:
                logger.error(f"❌ Impossible de déterminer le project_id pour {file_id}")
                return None
            
            endpoint_url = f"{self.base_url}/accounts/{self.account_id}/projects/{project_id}/shares"
            
            # Effectuer la requête API
            response = requests.post(
                endpoint_url,
                headers=self.headers,
                json=share_data,
                timeout=30
            )
            
            if response.status_code == 201:
                share_info = response.json()
                logger.info(f"✅ Lien de partage créé: {share_info.get('short_url', 'URL non disponible')}")
                return share_info
            else:
                logger.error(f"❌ Erreur création partage: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Exception création lien de partage: {e}")
            return None
    
    def get_share_info(self, share_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations d'un lien de partage existant
        
        Args:
            share_id: ID du lien de partage
            
        Returns:
            Dict avec les informations du partage ou None si erreur
        """
        try:
            response = requests.get(
                f"{self.base_url}/shares/{share_id}",
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"❌ Erreur récupération partage: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Exception récupération lien de partage: {e}")
            return None
    
    def list_shares(self, asset_id: str = None) -> List[Dict[str, Any]]:
        """
        Liste les liens de partage existants
        
        Args:
            asset_id: Filtrer par ID d'asset (optionnel)
            
        Returns:
            Liste des liens de partage
        """
        try:
            params = {}
            if asset_id:
                params['asset_id'] = asset_id
                
            response = requests.get(
                f"{self.base_url}/shares",
                headers=self.headers,
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"❌ Erreur liste partages: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Exception liste partages: {e}")
            return []
    
    def delete_share(self, share_id: str) -> bool:
        """
        Supprime un lien de partage
        
        Args:
            share_id: ID du lien de partage à supprimer
            
        Returns:
            True si suppression réussie
        """
        try:
            response = requests.delete(
                f"{self.base_url}/shares/{share_id}",
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 204:
                logger.info(f"✅ Lien de partage supprimé: {share_id}")
                return True
            else:
                logger.error(f"❌ Erreur suppression partage: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Exception suppression lien de partage: {e}")
            return False
    
    def create_share_for_shot(self, 
                             file_id: str, 
                             shot_name: str,
                             expires_in_days: int = 30) -> Optional[str]:
        """
        Crée un lien de partage optimisé pour les shots de post-production
        Utilise un cache pour éviter de créer plusieurs liens pour le même asset
        
        Args:
            file_id: ID du fichier Frame.io
            shot_name: Nom du shot (ex: UNDLM_00146)
            expires_in_days: Durée de validité en jours
            
        Returns:
            URL du lien de partage ou None si erreur
        """
        try:
            # Vérifier si on a déjà un lien de partage pour cet asset
            if file_id in self._share_cache:
                cached_share = self._share_cache[file_id]
                
                # Vérifier si le lien n'a pas expiré
                cached_expires = cached_share.get('expires_at')
                if cached_expires:
                    from datetime import datetime
                    try:
                        expires_dt = datetime.fromisoformat(cached_expires.replace('Z', '+00:00'))
                        if datetime.now().replace(tzinfo=expires_dt.tzinfo) < expires_dt:
                            cached_url = cached_share.get('url')
                            if cached_url:
                                logger.info(f"🔗 Utilisation du lien de partage existant pour {shot_name}: {cached_url[:50]}...")
                                return cached_url
                    except Exception as e:
                        logger.debug(f"Erreur vérification expiration cache: {e}")
                
                # Le lien a expiré, on le supprime du cache
                logger.info(f"🔄 Lien de partage expiré pour {shot_name}, création d'un nouveau")
                del self._share_cache[file_id]
            
            # Créer un nouveau lien de partage
            share_info = self.create_share_link(
                file_id=file_id,
                asset_name=f"Review {shot_name}",
                expires_in_days=expires_in_days,
                password_protected=False,  # Pas de mot de passe pour faciliter l'accès
                download_enabled=False     # Pas de téléchargement, juste review
            )
            
            if share_info:
                # Priorité au short_url s'il existe, sinon public_url
                share_url = share_info.get('short_url') or share_info.get('public_url')
                
                if share_url:
                    # Mettre en cache pour les prochains commentaires sur ce même asset
                    self._share_cache[file_id] = {
                        'url': share_url,
                        'expires_at': share_info.get('expires_at'),
                        'share_id': share_info.get('id'),
                        'created_for_shot': shot_name
                    }
                    
                    logger.info(f"🎬 Lien de partage créé et mis en cache pour {shot_name}: {share_url}")
                    return share_url
                else:
                    logger.error(f"❌ Aucune URL de partage dans la réponse pour {shot_name}")
                    return None
            else:
                logger.error(f"❌ Échec création lien de partage pour {shot_name}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Exception création lien de partage pour {shot_name}: {e}")
            return None
    
    def get_cached_share_info(self, file_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère les informations du lien de partage en cache pour un asset
        
        Args:
            file_id: ID du fichier Frame.io
            
        Returns:
            Informations du partage en cache ou None
        """
        return self._share_cache.get(file_id)
    
    def clear_cache(self):
        """Vide le cache des liens de partage"""
        cache_size = len(self._share_cache)
        self._share_cache.clear()
        logger.info(f"🗑️ Cache des liens de partage vidé ({cache_size} entrées supprimées)")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """
        Récupère des statistiques sur le cache des liens de partage
        
        Returns:
            Statistiques du cache
        """
        total_shares = len(self._share_cache)
        
        # Compter les liens expirés
        from datetime import datetime
        expired_count = 0
        
        for share_info in self._share_cache.values():
            cached_expires = share_info.get('expires_at')
            if cached_expires:
                try:
                    expires_dt = datetime.fromisoformat(cached_expires.replace('Z', '+00:00'))
                    if datetime.now().replace(tzinfo=expires_dt.tzinfo) >= expires_dt:
                        expired_count += 1
                except:
                    expired_count += 1
        
        return {
            'total_cached_shares': total_shares,
            'expired_shares': expired_count,
            'active_shares': total_shares - expired_count,
            'cache_efficiency': f"{((total_shares - expired_count) / max(total_shares, 1) * 100):.1f}%"
        }
    
    def _get_project_id_from_file(self, file_id: str) -> Optional[str]:
        """
        Récupère le project_id d'un fichier Frame.io
        
        Args:
            file_id: ID du fichier Frame.io
            
        Returns:
            str: project_id ou None si erreur
        """
        try:
            # Utiliser l'API v4 pour récupérer les détails du fichier
            response = requests.get(
                f"{self.base_url}/accounts/{self.account_id}/files/{file_id}",
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                file_data = response.json()
                project_id = file_data.get('project', {}).get('id')
                if project_id:
                    logger.debug(f"🎯 Project ID trouvé pour {file_id}: {project_id}")
                    return project_id
                else:
                    logger.warning(f"⚠️ Project ID manquant dans la réponse pour {file_id}")
            else:
                logger.error(f"❌ Erreur récupération fichier {file_id}: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Exception récupération project_id pour {file_id}: {e}")
            
        return None


def create_share_manager_from_config(config: Dict[str, Any]) -> Optional[FrameIOShareManager]:
    """
    Crée un gestionnaire de partage depuis la configuration
    
    Args:
        config: Configuration Frame.io
        
    Returns:
        Instance de FrameIOShareManager ou None si config manquante
    """
    try:
        import os
        
        # Utiliser les tokens depuis les variables d'environnement (comme les autres composants)
        api_token = os.getenv('FRAMEIO_TOKEN')
        account_id = os.getenv('FRAMEIO_ACCOUNT_ID')
        project_id = os.getenv('FRAMEIO_DEFAULT_PROJECT_ID')
        
        # Fallback sur la configuration si les vars d'env ne sont pas disponibles
        if not api_token or not account_id:
            frameio_config = config.get('frameio', {})
            api_token = api_token or frameio_config.get('api_token')
            account_id = account_id or frameio_config.get('account_id')
            project_id = project_id or frameio_config.get('default_project_id')
        
        if not api_token or not account_id:
            logger.error("❌ Configuration Frame.io manquante (api_token ou account_id)")
            logger.error(f"🔍 Debug - FRAMEIO_TOKEN présent: {'✅' if api_token else '❌'}")
            logger.error(f"🔍 Debug - FRAMEIO_ACCOUNT_ID présent: {'✅' if account_id else '❌'}")
            return None
        
        logger.info(f"🔑 Création ShareManager - Account: {account_id}, Project: {project_id}")
        return FrameIOShareManager(api_token, account_id, project_id)
        
    except Exception as e:
        logger.error(f"❌ Erreur création gestionnaire de partage: {e}")
        return None


# =============================================================================
# EXEMPLES D'UTILISATION
# =============================================================================

def demo_share_creation():
    """Démonstration de création de liens de partage"""
    
    print("🔗 DEMO: CRÉATION DE LIENS DE PARTAGE FRAME.IO")
    print("=" * 60)
    
    # Configuration fictive pour la démo
    demo_config = {
        'frameio': {
            'api_token': 'demo_token_here',
            'account_id': 'demo_account_id'
        }
    }
    
    # Créer le gestionnaire (ne fonctionnera pas sans vraie config)
    share_manager = create_share_manager_from_config(demo_config)
    
    if share_manager:
        print("✅ Gestionnaire de partage initialisé")
        
        # Exemple de création de lien
        file_id = "demo_file_id_12345"
        shot_name = "UNDLM_00146"
        
        print(f"\n🎬 Création lien de partage pour {shot_name}")
        print(f"   File ID: {file_id}")
        
        # Cette partie nécessiterait un vrai token API
        print("   [DEMO] Lien créé: https://frameio.page/short-link-12345")
        print("   [DEMO] Expire dans: 30 jours")
        print("   [DEMO] Accès public: Oui")
        print("   [DEMO] Téléchargement: Non")
        
    else:
        print("❌ Impossible d'initialiser le gestionnaire (configuration manquante)")

if __name__ == "__main__":
    demo_share_creation()
