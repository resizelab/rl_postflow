#!/usr/bin/env python3
"""
Test du workflow complet PostFlow
Simule le cycle de vie complet d'un plan depuis l'export jusqu'à la validation finale
"""

import os
import sys
import json
import time
import asyncio
import logging
from datetime import datetime
from pathlib import Path

# Configuration du projet
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
from src.integrations.sheets.status import SheetsStatusTracker
from src.integrations.sheets.users import SheetsUserManager
from src.integrations.sheets.mapper import get_column_index, map_row_to_dict

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PostFlowWorkflowTester:
    """Testeur du workflow complet PostFlow."""
    
    def __init__(self):
        """Initialiser le testeur."""
        self.config = self._load_config()
        self.shots_tracker = None
        self.user_manager = None
        self._init_components()
        
        # Simulation des chemins
        self.watch_directory = "/Volumes/LucidLink/UNDLM_EXPORTS"
        self.frameio_project_id = "your_frameio_project_id"
        
    def _load_config(self):
        """Charger la configuration."""
        config_path = project_root / 'config' / 'integrations.json'
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _init_components(self):
        """Initialiser les composants PostFlow."""
        try:
            # Google Sheets
            gs_config = GoogleSheetsConfig(
                credentials_file=self.config['google_sheets']['service_account_file'],
                spreadsheet_id=self.config['google_sheets']['spreadsheet_id'],
                worksheet_shots_tracks='SHOTS_TRACK',
                worksheet_users='USERS_INFOS'
            )
            
            auth_client = GoogleSheetsAuth(gs_config)
            auth_client.connect()
            
            self.shots_tracker = SheetsStatusTracker(auth_client)
            self.user_manager = SheetsUserManager(auth_client)
            
            logger.info("✅ Composants PostFlow initialisés")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation: {e}")
            raise
    
    async def test_complete_workflow(self, shot_id: str = "001"):
        """
        Tester le workflow complet pour un plan.
        
        Args:
            shot_id: ID du plan à tester (ex: "001")
        """
        logger.info(f"🚀 DÉMARRAGE WORKFLOW COMPLET - PLAN {shot_id}")
        logger.info("=" * 70)
        
        try:
            # Étape 1: Utilisateur fait un export
            await self._step_1_user_export(shot_id)
            
            # Étape 2: Watch détecte le fichier
            await self._step_2_file_detection(shot_id)
            
            # Étape 3: Génération thumbnail
            await self._step_3_generate_thumbnail(shot_id)
            
            # Étape 4: Upload Frame.io
            await self._step_4_frameio_upload(shot_id)
            
            # Étape 5: Notification Discord
            await self._step_5_discord_notification(shot_id)
            
            # Étape 6: Mise à jour Google Sheets
            await self._step_6_update_sheets(shot_id)
            
            # Étape 7: Workflow validation
            await self._step_7_validation_workflow(shot_id)
            
            logger.info(f"🎉 WORKFLOW COMPLET TERMINÉ - PLAN {shot_id}")
            
        except Exception as e:
            logger.error(f"❌ Erreur workflow: {e}")
            raise
    
    async def _step_1_user_export(self, shot_id: str):
        """Étape 1: Utilisateur fait un export."""
        logger.info(f"\n📤 ÉTAPE 1: Export utilisateur - Plan {shot_id}")
        
        # Récupérer les infos du plan
        shot_data = await self._get_shot_data(shot_id)
        if not shot_data:
            logger.warning(f"Plan {shot_id} non trouvé dans Google Sheets")
            return
        
        # Simuler l'export
        export_path = f"{self.watch_directory}/UNDLM_{shot_id:0>5}_v001.mov"
        logger.info(f"   📁 Fichier simulé: {export_path}")
        logger.info(f"   👤 Exporté par: {shot_data.get('attribution', 'N/A')}")
        logger.info(f"   🎬 Séquence: {shot_data.get('sequence_name', 'N/A')}")
        
        return export_path
    
    async def _step_2_file_detection(self, shot_id: str):
        """Étape 2: Watch détecte le fichier."""
        logger.info(f"\n👁️ ÉTAPE 2: Détection fichier - Plan {shot_id}")
        
        # Simuler la détection du watcher
        export_path = f"{self.watch_directory}/UNDLM_{shot_id:0>5}_v001.mov"
        
        logger.info(f"   🔍 Watcher détecte: {os.path.basename(export_path)}")
        logger.info(f"   📝 Extraction métadonnées...")
        
        # Métadonnées simulées
        metadata = {
            'shot_id': shot_id,
            'version': 'v001',
            'timestamp': datetime.now().isoformat(),
            'file_size': '245MB',
            'duration': '00:00:04:12',
            'resolution': '1920x1080'
        }
        
        logger.info(f"   ✅ Métadonnées: {metadata}")
        return metadata
    
    async def _step_3_generate_thumbnail(self, shot_id: str):
        """Étape 3: Génération thumbnail."""
        logger.info(f"\n🖼️ ÉTAPE 3: Génération thumbnail - Plan {shot_id}")
        
        # Simuler la génération de thumbnail
        source_path = f"{self.watch_directory}/UNDLM_{shot_id:0>5}_v001.mov"
        thumbnail_path = f"/tmp/thumbnail_UNDLM_{shot_id:0>5}.jpg"
        
        logger.info(f"   🎞️ Source: {os.path.basename(source_path)}")
        logger.info(f"   📸 Extraction première frame...")
        
        # Simuler l'upload sur Google Drive
        drive_url = f"https://drive.google.com/file/d/1abc123def456_{shot_id}/view"
        
        logger.info(f"   ☁️ Upload Google Drive réussi")
        logger.info(f"   🔗 URL thumbnail: {drive_url}")
        
        # Optionnel: Mise à jour Google Sheets avec thumbnail
        await self._update_shot_thumbnail(shot_id, drive_url)
        
        return drive_url
    
    async def _step_4_frameio_upload(self, shot_id: str):
        """Étape 4: Upload Frame.io."""
        logger.info(f"\n🎬 ÉTAPE 4: Upload Frame.io - Plan {shot_id}")
        
        source_path = f"{self.watch_directory}/UNDLM_{shot_id:0>5}_v001.mov"
        
        logger.info(f"   📤 Upload vers Frame.io...")
        logger.info(f"   📁 Fichier: {os.path.basename(source_path)}")
        
        # Simuler l'upload Frame.io
        frameio_url = f"https://app.frame.io/presentations/abc123-def456-{shot_id}"
        
        logger.info(f"   ✅ Upload Frame.io réussi")
        logger.info(f"   🔗 Lien Frame.io: {frameio_url}")
        
        return frameio_url
    
    async def _step_5_discord_notification(self, shot_id: str):
        """Étape 5: Notification Discord."""
        logger.info(f"\n💬 ÉTAPE 5: Notification Discord - Plan {shot_id}")
        
        # Récupérer l'utilisateur attribué
        shot_data = await self._get_shot_data(shot_id)
        attribution = shot_data.get('attribution', '')
        
        if attribution:
            user_data = await self._get_user_by_name(attribution)
            discord_id = user_data.get('discord_id') if user_data else None
            
            frameio_url = f"https://app.frame.io/presentations/abc123-def456-{shot_id}"
            
            message = f"""
🎬 **Plan {shot_id} prêt pour review !**

📁 **Séquence:** {shot_data.get('sequence_name', 'N/A')}
🎯 **Plan:** UNDLM_{shot_id:0>5}
👤 **Attribué à:** {attribution}
🔗 **Frame.io:** {frameio_url}

⏰ Uploadé à {datetime.now().strftime('%H:%M')}
            """
            
            if discord_id:
                logger.info(f"   📨 Notification à <@{discord_id}>")
            else:
                logger.info(f"   📨 Notification générale (Discord ID non trouvé)")
                
            logger.info(f"   💬 Message: {message.strip()}")
            
            # Si Discord est configuré, envoyer vraiment
            # if self.discord_notifier:
            #     try:
            #         await self.discord_notifier.send_shot_notification(
            #             shot_id, message, discord_id
            #         )
            #     except Exception as e:
            #         logger.warning(f"   ⚠️ Discord non envoyé: {e}")
        else:
            logger.warning(f"   ⚠️ Aucune attribution trouvée pour le plan {shot_id}")
    
    async def _step_6_update_sheets(self, shot_id: str):
        """Étape 6: Mise à jour Google Sheets."""
        logger.info(f"\n📊 ÉTAPE 6: Mise à jour Google Sheets - Plan {shot_id}")
        
        frameio_url = f"https://app.frame.io/presentations/abc123-def456-{shot_id}"
        
        # Mises à jour à faire
        updates = {
            'status': 'En Review',
            'version': 'v001',
            'frame_io_link': frameio_url,
            'updated_date': datetime.now().strftime('%Y-%m-%d %H:%M')
        }
        
        logger.info(f"   📝 Mises à jour:")
        for field, value in updates.items():
            logger.info(f"      {field}: {value}")
        
        # Simuler la mise à jour (implémentation réelle nécessaire)
        logger.info(f"   ✅ Google Sheets mis à jour")
        
        return updates
    
    async def _step_7_validation_workflow(self, shot_id: str):
        """Étape 7: Workflow de validation."""
        logger.info(f"\n✅ ÉTAPE 7: Workflow validation - Plan {shot_id}")
        
        # Simuler les étapes de validation
        validations = [
            {'step': 'PROD_APPROVAL', 'role': 'Production', 'status': 'En attente'},
            {'step': 'DIRECTOR_APPROVAL', 'role': 'Réalisation', 'status': 'En attente'},
            {'step': 'QUALITY_CHECK', 'role': 'Supervision', 'status': 'En attente'}
        ]
        
        logger.info(f"   📋 Étapes de validation:")
        for val in validations:
            logger.info(f"      {val['step']}: {val['status']} ({val['role']})")
        
        # Simuler webhook Frame.io pour changement de statut
        logger.info(f"\n🔗 Simulation webhook Frame.io:")
        logger.info(f"   📨 Changement statut détecté: 'En cours' → 'Approuvé'")
        logger.info(f"   🔄 Déclenchement notification Discord...")
        logger.info(f"   📊 Mise à jour Google Sheets...")
        
        return validations
    
    async def _get_shot_data(self, shot_id: str) -> dict:
        """Récupérer les données d'un plan."""
        try:
            shots = self.shots_tracker.get_all_shots()
            for shot in shots:
                if shot.get('shot_name') == shot_id:
                    return shot
            return {}
        except Exception as e:
            logger.error(f"Erreur récupération plan: {e}")
            return {}
    
    async def _get_user_by_name(self, name: str) -> dict:
        """Récupérer un utilisateur par nom."""
        try:
            users = self.user_manager.get_all_users()
            for user in users:
                if name.lower() in user.full_name.lower():
                    return {
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'discord_id': user.discord_id,
                        'department': getattr(user, 'department', None)
                    }
            return {}
        except Exception as e:
            logger.error(f"Erreur récupération utilisateur: {e}")
            return {}
    
    async def _update_shot_thumbnail(self, shot_id: str, thumbnail_url: str):
        """Mettre à jour la thumbnail du plan."""
        logger.info(f"   📊 Mise à jour thumbnail dans Google Sheets")
        # Implémentation réelle nécessaire
        pass

async def main():
    """Fonction principale."""
    print("🚀 TEST WORKFLOW POSTFLOW COMPLET")
    print("=" * 50)
    
    try:
        tester = PostFlowWorkflowTester()
        
        # Test avec le plan 001
        await tester.test_complete_workflow("001")
        
        print("\n" + "=" * 50)
        print("🎉 TEST WORKFLOW TERMINÉ AVEC SUCCÈS !")
        
    except Exception as e:
        print(f"❌ Erreur test workflow: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())
