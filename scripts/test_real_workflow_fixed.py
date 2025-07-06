#!/usr/bin/env python3
"""
Test complet du workflow PostFlow avec un vrai fichier
De LucidLink à Frame.io avec notifications Discord
"""

import os
import sys
import json
import time
import shutil
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.integrations.review_workflow import ReviewWorkflowManager
from src.integrations.discord import DiscordNotifier, DiscordConfig
from src.integrations.frameio import FrameIOClient
from src.integrations.lucidlink import LucidLinkIntegration

def create_test_file():
    """Créer un fichier de test pour simuler un export LucidLink"""
    print("🎬 Création du fichier de test")
    print("-" * 30)
    
    # Créer dans le répertoire temp
    temp_dir = Path(__file__).parent.parent / "temp"
    temp_dir.mkdir(exist_ok=True)
    
    test_file = temp_dir / "UNDLM_00001_v999_test.mov"
    
    try:
        # Créer un fichier vidéo de test avec FFmpeg si disponible
        import subprocess
        
        print("🎥 Tentative création vidéo de test avec FFmpeg...")
        subprocess.run([
            'ffmpeg', '-f', 'lavfi', '-i', 'color=blue:size=64x64:duration=3',
            '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '30',
            '-t', '3', '-y', str(test_file)
        ], check=True, capture_output=True)
        
        print(f"✅ Fichier vidéo créé: {test_file}")
        print(f"   • Taille: {test_file.stat().st_size} bytes")
        return test_file
        
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️  FFmpeg non disponible, création fichier texte simulé")
        
        # Créer un fichier texte plus gros pour simuler
        with open(test_file, 'w') as f:
            f.write("# PostFlow Test File - Real Upload Test\n")
            f.write(f"# Created at: {datetime.now().isoformat()}\n")
            f.write("# This simulates a video export from LucidLink\n")
            f.write("# File: UNDLM_00001_v999_test.mov\n")
            f.write("# Scene: REVEIL HOPITAL - JOUR\n")
            f.write("# Version: v999\n")
            f.write("# Test: Real Frame.io Upload\n")
            f.write("\n")
            
            # Ajouter du contenu pour simuler un vrai fichier
            for i in range(100):
                f.write(f"# Frame {i:03d}: Test content line for PostFlow workflow\n")
                f.write(f"# Timestamp: {datetime.now().timestamp()}\n")
                f.write(f"# Data: {'X' * 50}\n")
                f.write("\n")
        
        print(f"✅ Fichier texte créé: {test_file}")
        print(f"   • Taille: {test_file.stat().st_size} bytes")
        return test_file

def test_frameio_real_upload(test_file):
    """Test d'upload réel sur Frame.io"""
    print("\n📤 Test Frame.io Upload RÉEL")
    print("-" * 30)
    
    try:
        # Load configuration
        frameio_config_path = Path(__file__).parent.parent / "config" / "frameio_config.json"
        with open(frameio_config_path, 'r') as f:
            frameio_config = json.load(f)
        
        # Initialize Frame.io client
        frameio_client = FrameIOClient(frameio_config)
        
        # Get project info
        project_id = frameio_config.get('project_id')
        if not project_id:
            print("❌ Project ID not configured")
            return False
        
        project = frameio_client.get_project_info(project_id)
        print(f"✅ Project Frame.io: {project.get('name', 'Unknown') if project else 'Unknown'}")
        
        # Show file details
        print(f"📊 Détails du fichier:")
        print(f"   • Nom: {test_file.name}")
        print(f"   • Chemin: {test_file}")
        print(f"   • Taille: {test_file.stat().st_size} bytes")
        print(f"   • Existe: {test_file.exists()}")
        
        # Perform real upload
        print(f"🚀 Upload en cours vers Frame.io...")
        
        # First, try to create a folder for PostFlow tests
        print("📁 Création du dossier PostFlow_Tests...")
        folder_result = frameio_client.create_folder(
            "PostFlow_Tests",
            parent_id=project_id
        )
        
        parent_folder_id = project_id  # Default to project root
        if folder_result and folder_result.get('success'):
            parent_folder_id = folder_result.get('folder_id')
            print(f"✅ Dossier créé: {parent_folder_id}")
        else:
            print(f"⚠️  Utilisation de la racine du projet")
        
        # Upload the file
        upload_result = frameio_client.upload_file(
            str(test_file),
            project_id=project_id,
            parent_id=parent_folder_id,  # Use the created folder or project root
            metadata={
                "nomenclature": "UNDLM_00001",
                "scene": "REVEIL HOPITAL - JOUR",
                "version": "v999",
                "test": True,
                "workflow": "PostFlow_Real_Test"
            }
        )
        
        if upload_result and upload_result.get('success'):
            asset_id = upload_result.get('asset_id')
            frameio_url = f"https://frame.io/presentations/{project_id}/assets/{asset_id}"
            
            print(f"✅ Upload réussi !")
            print(f"   • Asset ID: {asset_id}")
            print(f"   • URL Frame.io: {frameio_url}")
            
            # Send success notification
            send_frameio_success_notification(test_file, frameio_url, asset_id)
            
            return frameio_url
            
        else:
            print(f"❌ Upload échoué")
            print(f"   • Résultat: {upload_result}")
            
            # Try to get more details about the error
            if upload_result and 'error' in upload_result:
                print(f"   • Erreur: {upload_result['error']}")
                
            return False
        
    except Exception as e:
        print(f"❌ Erreur Frame.io: {e}")
        print(f"   Type: {type(e).__name__}")
        print(f"   Détails: {str(e)}")
        
        # Try to get more debug info
        import traceback
        print(f"   Trace: {traceback.format_exc()}")
        
        return False

def send_frameio_success_notification(test_file, frameio_url, asset_id):
    """Envoyer notification de succès Frame.io"""
    try:
        # Load configuration
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Initialize Discord
        discord_config = config.get('discord', {})
        discord_config_obj = DiscordConfig(
            webhook_url=discord_config['webhook_url'],
            bot_name=discord_config.get('username', 'PostFlow BOT'),
            avatar_url=discord_config.get('avatar_url', '')
        )
        discord = DiscordNotifier(discord_config_obj)
        
        # Send success notification
        embed = {
            "title": "🎉 UPLOAD FRAME.IO RÉUSSI !",
            "description": f"Le fichier **{test_file.name}** a été uploadé avec succès sur Frame.io",
            "color": 0x00ff00,
            "fields": [
                {"name": "📁 Fichier", "value": test_file.name, "inline": True},
                {"name": "🎭 Scène", "value": "REVEIL HOPITAL - JOUR", "inline": True},
                {"name": "🔢 Version", "value": "v999", "inline": True},
                {"name": "📊 Taille", "value": f"{test_file.stat().st_size} bytes", "inline": True},
                {"name": "🆔 Asset ID", "value": asset_id, "inline": True},
                {"name": "🕒 Uploadé à", "value": datetime.now().strftime("%H:%M:%S"), "inline": True},
                {"name": "🔗 Voir sur Frame.io", "value": f"[Cliquez ici]({frameio_url})", "inline": False},
                {"name": "🎯 Status", "value": "✅ Disponible pour review", "inline": True}
            ],
            "footer": {"text": "PostFlow - Upload Frame.io Réussi"}
        }
        
        discord.send_message("🎉 **UPLOAD FRAME.IO RÉUSSI** - UNDLM_00001", embed)
        print("✅ Notification de succès envoyée")
        
    except Exception as e:
        print(f"❌ Erreur notification: {e}")

def test_discord_detection(test_file):
    """Test notification Discord de détection"""
    print("\n📢 Test Discord Detection")
    print("-" * 30)
    
    try:
        # Load configuration
        config_path = Path(__file__).parent.parent / "config" / "integrations.json"
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Initialize Discord
        discord_config = config.get('discord', {})
        discord_config_obj = DiscordConfig(
            webhook_url=discord_config['webhook_url'],
            bot_name=discord_config.get('username', 'PostFlow BOT'),
            avatar_url=discord_config.get('avatar_url', '')
        )
        discord = DiscordNotifier(discord_config_obj)
        
        # Send detection notification
        embed = {
            "title": "🔍 FICHIER DÉTECTÉ - TEST UPLOAD RÉEL",
            "description": f"**UNDLM_00001** v999 détecté - Upload Frame.io en cours",
            "color": 0x0099ff,
            "fields": [
                {"name": "📁 Fichier", "value": test_file.name, "inline": True},
                {"name": "🎭 Scène", "value": "REVEIL HOPITAL - JOUR", "inline": True},
                {"name": "🔢 Version", "value": "v999", "inline": True},
                {"name": "📊 Taille", "value": f"{test_file.stat().st_size} bytes", "inline": True},
                {"name": "🕒 Détecté à", "value": datetime.now().strftime("%H:%M:%S"), "inline": True},
                {"name": "🎯 Status", "value": "⏳ Upload en cours...", "inline": True}
            ],
            "footer": {"text": "PostFlow - Test Upload Réel"}
        }
        
        discord.send_message("🔍 **FICHIER DÉTECTÉ** - Test Upload Réel", embed)
        print("✅ Notification de détection envoyée")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur Discord: {e}")
        return False

def main():
    """Test complet avec upload réel"""
    print("🎬 " + "=" * 60)
    print("   TEST UPLOAD RÉEL FRAME.IO")
    print("   PostFlow Workflow Complet")
    print("=" * 62)
    
    start_time = time.time()
    
    # Étape 1: Créer fichier de test
    print("\n📋 Étape 1: Création du fichier de test")
    test_file = create_test_file()
    if not test_file:
        print("❌ Impossible de créer le fichier de test")
        return
    
    # Étape 2: Notification Discord de détection
    print("\n📋 Étape 2: Notification Discord de détection")
    if not test_discord_detection(test_file):
        print("❌ Notification Discord échouée")
        return
    
    # Délai pour voir la notification
    print("\n⏱️  Attente 3 secondes...")
    time.sleep(3)
    
    # Étape 3: Upload réel sur Frame.io
    print("\n📋 Étape 3: Upload réel Frame.io")
    frameio_url = test_frameio_real_upload(test_file)
    
    if frameio_url:
        print(f"\n🎉 SUCCÈS ! Le fichier est maintenant visible sur Frame.io")
        print(f"🔗 URL: {frameio_url}")
        
        # Étape 4: Attendre un peu puis nettoyer
        print("\n⏱️  Attente 5 secondes pour que le fichier soit traité...")
        time.sleep(5)
        
        # Nettoyage
        print("\n📋 Nettoyage")
        try:
            if test_file.exists():
                test_file.unlink()
                print(f"✅ Fichier de test supprimé: {test_file}")
        except Exception as e:
            print(f"⚠️  Erreur nettoyage: {e}")
        
        # Résumé final
        end_time = time.time()
        duration = end_time - start_time
        
        print("\n" + "=" * 62)
        print("🎉 UPLOAD RÉEL RÉUSSI !")
        print("=" * 62)
        print(f"⏱️  Durée totale: {duration:.1f} secondes")
        print(f"🔗 Fichier visible sur: {frameio_url}")
        print("📱 Vérifiez Discord pour les notifications")
        print("🌐 Vérifiez Frame.io pour voir le fichier")
        
    else:
        print(f"\n❌ L'upload a échoué - le fichier n'est pas visible sur Frame.io")
        print("🔧 Vérifiez:")
        print("   • Les permissions du token API Frame.io")
        print("   • La configuration du projet")
        print("   • Les logs d'erreur ci-dessus")

if __name__ == "__main__":
    main()
