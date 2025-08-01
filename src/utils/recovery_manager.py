"""
Recovery Manager - Gestion automatique des uploads incomplets
============================================================

Ce module gère automatiquement les cas d'edge où des uploads Frame.io
sont incomplets (file_id null) et nécessitent un retraitement.

Fonctionnalités:
- Détection automatique des uploads incomplets au démarrage
- Nettoyage intelligent du cache mémoire
- Retraitement automatique sans redémarrage système
- Génération de liens Frame.io courts pour Google Sheets
"""

import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import re

logger = logging.getLogger(__name__)

class UploadRecoveryManager:
    """Gestionnaire de récupération pour les uploads incomplets"""
    
    def __init__(self, tracker_file: str):
        self.tracker_file = tracker_file
        self.uploads_data = {}
        self.incomplete_uploads = []
        
    def load_tracking_data(self) -> Dict:
        """Charge les données de tracking depuis le fichier JSON"""
        try:
            with open(self.tracker_file, 'r', encoding='utf-8') as f:
                self.uploads_data = json.load(f)
            return self.uploads_data
        except Exception as e:
            logger.error(f"❌ Erreur chargement tracking: {e}")
            return {}
    
    def detect_incomplete_uploads(self) -> List[Dict]:
        """
        Détecte les uploads avec file_id null ou manquant
        
        Returns:
            Liste des uploads incomplets avec leurs métadonnées
        """
        incomplete = []
        
        if not self.uploads_data:
            self.load_tracking_data()
        
        for upload_id, upload_data in self.uploads_data.get('uploads', {}).items():
            frameio_data = upload_data.get('frameio_data', {})
            file_id = frameio_data.get('file_id')
            
            # Détection des cas problématiques
            if (not file_id or 
                file_id == "null" or 
                file_id == "" or
                upload_data.get('status') == '🔄 UPLOADING'):
                
                incomplete.append({
                    'upload_id': upload_id,
                    'shot_id': upload_data.get('shot_id'),
                    'filename': upload_data.get('filename'),
                    'file_path': upload_data.get('file_path'),
                    'reason': self._get_failure_reason(upload_data)
                })
                
        self.incomplete_uploads = incomplete
        return incomplete
    
    def _get_failure_reason(self, upload_data: Dict) -> str:
        """Détermine la raison de l'échec de l'upload"""
        frameio_data = upload_data.get('frameio_data', {})
        file_id = frameio_data.get('file_id')
        
        if not file_id or file_id == "null":
            return "file_id_missing"
        elif upload_data.get('status') == '🔄 UPLOADING':
            return "upload_stuck"
        else:
            return "unknown"
    
    def cleanup_incomplete_uploads(self) -> int:
        """
        Supprime les entrées d'uploads incomplets du tracking
        
        Returns:
            Nombre d'entrées supprimées
        """
        if not self.incomplete_uploads:
            self.detect_incomplete_uploads()
        
        removed_count = 0
        uploads = self.uploads_data.get('uploads', {})
        
        for incomplete in self.incomplete_uploads:
            upload_id = incomplete['upload_id']
            if upload_id in uploads:
                del uploads[upload_id]
                removed_count += 1
                logger.info(f"🗑️ Upload incomplet supprimé: {incomplete['shot_id']} ({upload_id})")
        
        # Sauvegarde les modifications
        if removed_count > 0:
            self._save_tracking_data()
            logger.info(f"✅ {removed_count} uploads incomplets nettoyés")
        
        return removed_count
    
    def _save_tracking_data(self):
        """Sauvegarde les données de tracking modifiées"""
        self.uploads_data['last_updated'] = datetime.now().isoformat()
        
        try:
            with open(self.tracker_file, 'w', encoding='utf-8') as f:
                json.dump(self.uploads_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde tracking: {e}")
    
    def get_recovery_report(self) -> Dict:
        """
        Génère un rapport de récupération
        
        Returns:
            Rapport détaillé des uploads incomplets et actions prises
        """
        if not self.incomplete_uploads:
            self.detect_incomplete_uploads()
        
        return {
            'total_uploads': len(self.uploads_data.get('uploads', {})),
            'incomplete_count': len(self.incomplete_uploads),
            'incomplete_files': [
                {
                    'shot_id': item['shot_id'],
                    'filename': item['filename'],
                    'reason': item['reason']
                }
                for item in self.incomplete_uploads
            ],
            'recovery_needed': len(self.incomplete_uploads) > 0,
            'timestamp': datetime.now().isoformat()
        }


class FrameioLinkShortener:
    """Générateur de liens Frame.io courts pour Google Sheets"""
    
    # Pattern pour extraire les IDs des URLs Frame.io
    FRAMEIO_URL_PATTERN = re.compile(
        r'https://next\.frame\.io/project/([a-f0-9-]+)/view/([a-f0-9-]+)'
    )
    
    @staticmethod
    def shorten_frameio_link(frameio_url: str, shot_id: str, version: str = "v001") -> str:
        """
        Génère un lien Frame.io court pour Google Sheets
        
        Args:
            frameio_url: URL complète Frame.io
            shot_id: ID du shot (ex: UNDLM_00150)
            version: Version du fichier (ex: v001)
        
        Returns:
            Lien court formaté (ex: REVIEW_UNDLM_00150_V001)
        """
        if not frameio_url or not shot_id:
            return "REVIEW_ERROR"
        
        # Nettoie le shot_id (enlève préfixes si nécessaire)
        clean_shot_id = shot_id.replace('SQ07_', '').replace('UNDLM_', '')
        
        # Formate la version
        version_clean = version.upper().replace('V', '_V')
        
        # Génère le lien court
        short_link = f"REVIEW_{clean_shot_id}_{version_clean}"
        
        return short_link
    
    @staticmethod
    def create_hyperlink_formula(frameio_url: str, shot_id: str, version: str = "v001") -> str:
        """
        Crée une formule HYPERLINK Google Sheets avec texte court
        
        Args:
            frameio_url: URL complète Frame.io
            shot_id: ID du shot
            version: Version du fichier
        
        Returns:
            Formule HYPERLINK pour Google Sheets
        """
        short_text = FrameioLinkShortener.shorten_frameio_link(frameio_url, shot_id, version)
        
        # Échappe les guillemets dans l'URL
        escaped_url = frameio_url.replace('"', '""')
        
        return f'=HYPERLINK("{escaped_url}","{short_text}")'
    
    @staticmethod
    def extract_file_id(frameio_url: str) -> Optional[str]:
        """
        Extrait le file_id d'une URL Frame.io
        
        Args:
            frameio_url: URL complète Frame.io
        
        Returns:
            File ID ou None si non trouvé
        """
        match = FrameioLinkShortener.FRAMEIO_URL_PATTERN.match(frameio_url)
        if match:
            return match.group(2)  # Le file_id est le deuxième groupe
        return None


class AutoRecoveryService:
    """Service de récupération automatique intégré au pipeline"""
    
    def __init__(self, tracker_file: str, upload_queue=None):
        self.recovery_manager = UploadRecoveryManager(tracker_file)
        self.link_shortener = FrameioLinkShortener()
        self.upload_queue = upload_queue
        
    def run_startup_recovery(self) -> Dict:
        """
        Lance la récupération automatique au démarrage
        
        Returns:
            Rapport de récupération avec actions prises
        """
        logger.info("🔍 === RÉCUPÉRATION AUTOMATIQUE AU DÉMARRAGE ===")
        
        # Détecte les uploads incomplets
        incomplete_uploads = self.recovery_manager.detect_incomplete_uploads()
        
        if not incomplete_uploads:
            logger.info("✅ Aucun upload incomplet détecté")
            return {'status': 'clean', 'actions': []}
        
        logger.warning(f"⚠️ {len(incomplete_uploads)} uploads incomplets détectés:")
        for upload in incomplete_uploads:
            logger.warning(f"   📄 {upload['shot_id']} - {upload['reason']}")
        
        # Nettoie les entrées problématiques
        removed_count = self.recovery_manager.cleanup_incomplete_uploads()
        
        # Ajoute les fichiers à la queue pour retraitement
        requeued_files = []
        if self.upload_queue:
            for upload in incomplete_uploads:
                file_path = upload['file_path']
                if file_path:
                    # Ajoute à la queue avec priorité haute
                    self.upload_queue.add_file(file_path, priority='HIGH')
                    requeued_files.append(upload['filename'])
                    logger.info(f"🔄 Fichier ajouté à la queue: {upload['filename']}")
        
        report = {
            'status': 'recovered',
            'incomplete_found': len(incomplete_uploads),
            'entries_cleaned': removed_count,
            'files_requeued': len(requeued_files),
            'actions': [
                f"Détecté {len(incomplete_uploads)} uploads incomplets",
                f"Nettoyé {removed_count} entrées du tracking",
                f"Ajouté {len(requeued_files)} fichiers à la queue"
            ],
            'files_recovered': requeued_files
        }
        
        logger.info("✅ Récupération automatique terminée")
        return report
    
    def generate_short_links_report(self) -> Dict:
        """
        Génère un rapport avec les liens Frame.io courts
        pour mise à jour Google Sheets
        """
        self.recovery_manager.load_tracking_data()
        uploads = self.recovery_manager.uploads_data.get('uploads', {})
        
        short_links = {}
        for upload_id, upload_data in uploads.items():
            frameio_url = upload_data.get('frameio_link')
            shot_id = upload_data.get('shot_id')
            version = upload_data.get('version', 'v001')
            
            if frameio_url and shot_id:
                short_link = self.link_shortener.shorten_frameio_link(
                    frameio_url, shot_id, version
                )
                hyperlink_formula = self.link_shortener.create_hyperlink_formula(
                    frameio_url, shot_id, version
                )
                
                short_links[shot_id] = {
                    'original_url': frameio_url,
                    'short_text': short_link,
                    'hyperlink_formula': hyperlink_formula,
                    'filename': upload_data.get('filename')
                }
        
        return {
            'total_links': len(short_links),
            'links': short_links,
            'timestamp': datetime.now().isoformat()
        }


# Fonctions utilitaires pour intégration facile
def run_auto_recovery(tracker_file: str, upload_queue=None) -> Dict:
    """
    Fonction utilitaire pour lancer la récupération automatique
    
    Usage:
        from src.utils.recovery_manager import run_auto_recovery
        
        report = run_auto_recovery('data/uploads_tracking.json', upload_queue)
        if report['status'] == 'recovered':
            print(f"Récupéré {report['files_requeued']} fichiers")
    """
    service = AutoRecoveryService(tracker_file, upload_queue)
    return service.run_startup_recovery()


def generate_short_frameio_links(tracker_file: str) -> Dict:
    """
    Fonction utilitaire pour générer les liens Frame.io courts
    
    Usage:
        from src.utils.recovery_manager import generate_short_frameio_links
        
        links_report = generate_short_frameio_links('data/uploads_tracking.json')
        for shot_id, link_data in links_report['links'].items():
            print(f"{shot_id}: {link_data['short_text']}")
    """
    service = AutoRecoveryService(tracker_file)
    return service.generate_short_links_report()


if __name__ == "__main__":
    # Test du module
    import os
    
    tracker_file = "data/uploads_tracking.json"
    if os.path.exists(tracker_file):
        print("🔍 Test de récupération automatique...")
        
        # Test de détection
        manager = UploadRecoveryManager(tracker_file)
        incomplete = manager.detect_incomplete_uploads()
        
        print(f"📊 Uploads incomplets détectés: {len(incomplete)}")
        for upload in incomplete:
            print(f"   • {upload['shot_id']} - {upload['reason']}")
        
        # Test de génération de liens courts
        shortener = FrameioLinkShortener()
        service = AutoRecoveryService(tracker_file)
        links_report = service.generate_short_links_report()
        
        print(f"\n🔗 Liens courts générés: {links_report['total_links']}")
        for shot_id, link_data in list(links_report['links'].items())[:3]:
            print(f"   • {shot_id}: {link_data['short_text']}")
    else:
        print(f"❌ Fichier de tracking non trouvé: {tracker_file}")
