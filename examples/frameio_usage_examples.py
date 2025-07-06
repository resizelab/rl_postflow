#!/usr/bin/env python3
"""
Exemple d'utilisation de Frame.io v4 dans le pipeline PostFlow
"""

import asyncio
import os
from pathlib import Path
import sys

# Ajouter src au path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from integrations.frameio.auth import FrameIOAuth
from integrations.frameio.structure import FrameIOStructureManager
from integrations.frameio.upload import FrameIOUploadManager, UploadMetadata


async def upload_shot_example():
    """
    Exemple d'upload d'un shot dans Frame.io selon la nomenclature PostFlow
    """
    print("🎬 Exemple d'upload Frame.io v4 - PostFlow")
    print("=" * 50)
    
    # Configuration
    shot_id = "UNDLM_00412"
    scene_name = "SCÈNE_RÉCUPÉRATION_SURVIVANTS"
    version = "v2"
    file_path = f"/exports/{shot_id}_{version}.mov"
    
    try:
        # 1. Authentification
        print("🔐 Authentification Adobe IMS...")
        auth = FrameIOAuth()
        
        # 2. Gestionnaires
        structure_manager = FrameIOStructureManager(auth)
        upload_manager = FrameIOUploadManager(auth)
        
        # 3. Trouver/créer le dossier de scène
        print(f"📂 Recherche du dossier pour la scène: {scene_name}")
        
        project_id = os.getenv('FRAMEIO_DEFAULT_PROJECT_ID')
        if not project_id:
            projects = await structure_manager.get_projects()
            if projects:
                project_id = projects[0].id
                print(f"✅ Utilisation du projet: {projects[0].name}")
            else:
                raise Exception("Aucun projet trouvé")
        
        # Créer ou trouver le dossier de scène
        scene_folder = await structure_manager.find_or_create_scene_folder(
            scene_name, project_id
        )
        
        # 4. Préparer les métadonnées d'upload
        metadata = UploadMetadata(
            shot_id=shot_id,
            scene_name=scene_name,
            version=version,
            file_path=file_path,
            nomenclature=f"{shot_id}_{version}",
            description=f"Shot {shot_id} - {scene_name} - Version {version}",
            tags=[shot_id, scene_name, version, "postflow"]
        )
        
        # 5. Upload du fichier
        print(f"📤 Upload du fichier: {shot_id}_{version}.mov")
        
        # Simuler le fichier s'il n'existe pas
        if not Path(file_path).exists():
            print(f"⚠️  Fichier {file_path} non trouvé, création d'un fichier de test...")
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            with open(file_path, 'wb') as f:
                f.write(b"Mock video file for testing PostFlow upload")
        
        # Upload réel
        upload_result = await upload_manager.upload_file(
            metadata=metadata,
            folder_id=scene_folder.id,
            project_id=project_id
        )
        
        if upload_result.status == "success":
            print(f"✅ Upload réussi!")
            print(f"   File ID: {upload_result.file_id}")
            print(f"   Nom: {upload_result.name}")
            print(f"   Taille: {upload_result.size} bytes")
            print(f"   URL: {upload_result.url}")
        else:
            print(f"❌ Upload échoué: {upload_result.error}")
        
        # 6. Nettoyage
        await auth.close()
        
        return upload_result
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None


async def batch_upload_example():
    """
    Exemple d'upload en batch pour plusieurs shots
    """
    print("\n🔄 Exemple d'upload en batch")
    print("=" * 30)
    
    shots = [
        ("UNDLM_00413", "SCÈNE_MAYDAY_NUIT", "v1"),
        ("UNDLM_00414", "SCÈNE_MAYDAY_NUIT", "v1"),
        ("UNDLM_00415", "SCÈNE_CROSS_INTERIEUR", "v2"),
    ]
    
    results = []
    
    try:
        auth = FrameIOAuth()
        upload_manager = FrameIOUploadManager(auth)
        
        for shot_id, scene_name, version in shots:
            print(f"📤 Upload de {shot_id}_{version}...")
            
            # Créer métadonnées
            metadata = UploadMetadata(
                shot_id=shot_id,
                scene_name=scene_name,
                version=version,
                file_path=f"/exports/{shot_id}_{version}.mov",
                nomenclature=f"{shot_id}_{version}"
            )
            
            # Upload avec gestion d'erreur
            try:
                result = await upload_manager.upload_file_batch([metadata])
                results.extend(result)
                print(f"   ✅ {shot_id}_{version} uploadé")
            except Exception as e:
                print(f"   ❌ {shot_id}_{version} échoué: {e}")
        
        await auth.close()
        
        print(f"\n📊 Résumé: {len([r for r in results if r.status == 'success'])}/{len(shots)} uploads réussis")
        
    except Exception as e:
        print(f"❌ Erreur batch: {e}")


async def main():
    """
    Exemples d'utilisation Frame.io v4 pour PostFlow
    """
    print("🎬 FRAME.IO V4 - EXEMPLES POSTFLOW")
    print("=" * 50)
    print()
    print("💡 Usage typique:")
    print("   uploader.upload_file('UNDLM_00412', '/exports/UNDLM_00412_v2.mov', 'SCÈNE XYZ')")
    print()
    
    # Vérifier la configuration
    required_vars = [
        'FRAMEIO_CLIENT_ID',
        'FRAMEIO_CLIENT_SECRET', 
        'FRAMEIO_ORG_ID',
        'FRAMEIO_TECHNICAL_ACCOUNT_ID',
        'FRAMEIO_PRIVATE_KEY_PATH',
        'FRAMEIO_ACCOUNT_ID',
        'FRAMEIO_WORKSPACE_ID'
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        print(f"❌ Variables manquantes: {', '.join(missing)}")
        print("💡 Configurez avec: python scripts/configure_frameio.py")
        return
    
    # Exemples
    print("1️⃣ Upload simple d'un shot")
    await upload_shot_example()
    
    print("\n2️⃣ Upload en batch")
    await batch_upload_example()
    
    print("\n🎉 Exemples terminés!")


if __name__ == "__main__":
    asyncio.run(main())
