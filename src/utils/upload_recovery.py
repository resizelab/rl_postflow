#!/usr/bin/env python3
"""
Upload Recovery Utility
Gère les uploads Frame.io incomplets et permet leur retraitement automatique
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

class UploadRecoveryManager:
    """Gestionnaire de récupération des uploads incomplets"""
    
    def __init__(self, tracking_file_path: str):
        self.tracking_file_path = Path(tracking_file_path)
        
    def load_tracking_data(self) -> Dict:
        """Charge les données de tracking"""
        try:
            with open(self.tracking_file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Erreur lors du chargement du tracking: {e}")
            return {}
    
    def save_tracking_data(self, data: Dict) -> bool:
        """Sauvegarde les données de tracking"""
        try:
            # Backup avant modification
            backup_path = self.tracking_file_path.with_suffix('.json.backup')
            if self.tracking_file_path.exists():
                import shutil
                shutil.copy2(self.tracking_file_path, backup_path)
            
            # Mise à jour du timestamp
            data['last_updated'] = datetime.now().isoformat()
            
            with open(self.tracking_file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Tracking sauvegardé avec backup: {backup_path}")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde: {e}")
            return False
    
    def identify_incomplete_uploads(self) -> List[Tuple[str, Dict]]:
        """Identifie les uploads incomplets sur Frame.io"""
        data = self.load_tracking_data()
        incomplete_uploads = []
        
        for upload_id, upload_data in data.get('uploads', {}).items():
            frameio_data = upload_data.get('frameio_data', {})
            
            # Critères d'upload incomplet :
            # 1. file_id est null mais status COMPLETED
            # 2. upload_status PENDING depuis trop longtemps
            # 3. frameio_link présent mais file_id manquant
            
            is_incomplete = False
            reason = ""
            
            # Cas 1: file_id null avec status COMPLETED
            if (upload_data.get('status') == '🎉 COMPLETED' and 
                frameio_data.get('file_id') is None):
                is_incomplete = True
                reason = "file_id null malgré status COMPLETED"
            
            # Cas 2: upload_status PENDING depuis plus de 30 minutes
            elif frameio_data.get('upload_status') == 'PENDING':
                created_at = upload_data.get('created_at')
                if created_at:
                    try:
                        created_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        time_diff = datetime.now() - created_time.replace(tzinfo=None)
                        if time_diff.total_seconds() > 1800:  # 30 minutes
                            is_incomplete = True
                            reason = f"upload_status PENDING depuis {time_diff}"
                    except:
                        pass
            
            # Cas 3: frameio_link présent mais file_id manquant
            elif (upload_data.get('frameio_link') and 
                  not frameio_data.get('file_id')):
                is_incomplete = True
                reason = "frameio_link présent mais file_id manquant"
            
            if is_incomplete:
                upload_data['_recovery_reason'] = reason
                incomplete_uploads.append((upload_id, upload_data))
        
        logger.info(f"Trouvé {len(incomplete_uploads)} uploads incomplets")
        return incomplete_uploads
    
    def remove_incomplete_uploads(self, upload_ids: List[str] = None, 
                                auto_identify: bool = True) -> int:
        """
        Supprime les uploads incomplets du tracking pour permettre leur retraitement
        
        Args:
            upload_ids: Liste des IDs d'upload à supprimer (optionnel)
            auto_identify: Si True, identifie automatiquement les uploads incomplets
            
        Returns:
            Nombre d'uploads supprimés
        """
        data = self.load_tracking_data()
        
        if auto_identify and not upload_ids:
            incomplete_uploads = self.identify_incomplete_uploads()
            upload_ids = [upload_id for upload_id, _ in incomplete_uploads]
        
        if not upload_ids:
            logger.info("Aucun upload incomplet à supprimer")
            return 0
        
        removed_count = 0
        uploads = data.get('uploads', {})
        
        for upload_id in upload_ids:
            if upload_id in uploads:
                upload_info = uploads[upload_id]
                filename = upload_info.get('filename', 'Unknown')
                shot_id = upload_info.get('shot_id', 'Unknown')
                
                logger.info(f"Suppression upload incomplet: {shot_id} ({filename})")
                del uploads[upload_id]
                removed_count += 1
        
        if removed_count > 0:
            if self.save_tracking_data(data):
                logger.info(f"✅ {removed_count} uploads incomplets supprimés du tracking")
            else:
                logger.error("❌ Erreur lors de la sauvegarde")
                return 0
        
        return removed_count
    
    def mark_for_retry(self, upload_ids: List[str] = None, 
                      auto_identify: bool = True) -> int:
        """
        Marque les uploads incomplets pour retry (change le status)
        
        Args:
            upload_ids: Liste des IDs d'upload à marquer (optionnel)
            auto_identify: Si True, identifie automatiquement les uploads incomplets
            
        Returns:
            Nombre d'uploads marqués pour retry
        """
        data = self.load_tracking_data()
        
        if auto_identify and not upload_ids:
            incomplete_uploads = self.identify_incomplete_uploads()
            upload_ids = [upload_id for upload_id, _ in incomplete_uploads]
        
        if not upload_ids:
            logger.info("Aucun upload incomplet à marquer pour retry")
            return 0
        
        marked_count = 0
        uploads = data.get('uploads', {})
        
        for upload_id in upload_ids:
            if upload_id in uploads:
                upload_info = uploads[upload_id]
                filename = upload_info.get('filename', 'Unknown')
                shot_id = upload_info.get('shot_id', 'Unknown')
                
                # Reset du status et des données Frame.io
                upload_info['status'] = '⏳ RETRY_PENDING'
                upload_info['frameio_data'] = {
                    "file_id": None,
                    "upload_status": "PENDING",
                    "review_link": None,
                    "share_link": None,
                    "processing_status": None
                }
                upload_info['last_updated'] = datetime.now().isoformat()
                upload_info['retry_marked_at'] = datetime.now().isoformat()
                
                logger.info(f"Marqué pour retry: {shot_id} ({filename})")
                marked_count += 1
        
        if marked_count > 0:
            if self.save_tracking_data(data):
                logger.info(f"✅ {marked_count} uploads marqués pour retry")
            else:
                logger.error("❌ Erreur lors de la sauvegarde")
                return 0
        
        return marked_count
    
    def generate_recovery_report(self) -> Dict:
        """Génère un rapport détaillé des uploads incomplets"""
        incomplete_uploads = self.identify_incomplete_uploads()
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_incomplete': len(incomplete_uploads),
            'incomplete_uploads': []
        }
        
        for upload_id, upload_data in incomplete_uploads:
            upload_report = {
                'upload_id': upload_id,
                'filename': upload_data.get('filename'),
                'shot_id': upload_data.get('shot_id'),
                'status': upload_data.get('status'),
                'created_at': upload_data.get('created_at'),
                'frameio_data': upload_data.get('frameio_data'),
                'recovery_reason': upload_data.get('_recovery_reason'),
                'frameio_link': upload_data.get('frameio_link')
            }
            report['incomplete_uploads'].append(upload_report)
        
        return report
    
    def auto_recovery(self, strategy: str = "remove") -> Dict:
        """
        Récupération automatique des uploads incomplets
        
        Args:
            strategy: "remove" pour supprimer, "retry" pour marquer pour retry
            
        Returns:
            Résultats de la récupération
        """
        logger.info(f"🔄 Début de la récupération automatique (stratégie: {strategy})")
        
        # Génération du rapport avant action
        report = self.generate_recovery_report()
        
        if report['total_incomplete'] == 0:
            logger.info("✅ Aucun upload incomplet détecté")
            return {
                'success': True,
                'action': 'none',
                'count': 0,
                'report': report
            }
        
        # Application de la stratégie
        if strategy == "remove":
            count = self.remove_incomplete_uploads(auto_identify=True)
            action = "removed"
        elif strategy == "retry":
            count = self.mark_for_retry(auto_identify=True)
            action = "marked_for_retry"
        else:
            logger.error(f"Stratégie inconnue: {strategy}")
            return {
                'success': False,
                'error': f"Stratégie inconnue: {strategy}",
                'report': report
            }
        
        logger.info(f"✅ Récupération automatique terminée: {count} uploads {action}")
        
        return {
            'success': True,
            'action': action,
            'count': count,
            'report': report
        }


def main():
    """Point d'entrée pour utilisation en CLI"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Utilitaire de récupération des uploads incomplets")
    parser.add_argument("--tracking-file", 
                       default="data/uploads_tracking.json",
                       help="Chemin vers le fichier de tracking")
    parser.add_argument("--action", 
                       choices=["identify", "remove", "retry", "report", "auto"],
                       default="identify",
                       help="Action à effectuer")
    parser.add_argument("--strategy",
                       choices=["remove", "retry"],
                       default="remove",
                       help="Stratégie pour l'auto-récupération")
    
    args = parser.parse_args()
    
    # Configuration du logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    manager = UploadRecoveryManager(args.tracking_file)
    
    if args.action == "identify":
        incomplete = manager.identify_incomplete_uploads()
        print(f"🔍 Uploads incomplets détectés: {len(incomplete)}")
        for upload_id, data in incomplete:
            print(f"  - {data.get('shot_id')} ({data.get('filename')}) : {data.get('_recovery_reason')}")
    
    elif args.action == "remove":
        count = manager.remove_incomplete_uploads()
        print(f"🗑️ {count} uploads supprimés du tracking")
    
    elif args.action == "retry":
        count = manager.mark_for_retry()
        print(f"🔄 {count} uploads marqués pour retry")
    
    elif args.action == "report":
        report = manager.generate_recovery_report()
        print(json.dumps(report, indent=2, ensure_ascii=False))
    
    elif args.action == "auto":
        result = manager.auto_recovery(strategy=args.strategy)
        print(f"🤖 Récupération auto: {result['count']} uploads {result['action']}")


if __name__ == "__main__":
    main()
