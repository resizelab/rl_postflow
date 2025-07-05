#!/usr/bin/env python3
"""
Script pour nettoyer l'ancienne structure de dossiers sur le serveur LucidLink
avant de créer la nouvelle structure mise à jour.
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime

def load_config():
    """Charge la configuration du pipeline"""
    config_path = Path(__file__).parent / "pipeline_config.json"
    with open(config_path, 'r') as f:
        return json.load(f)

def cleanup_old_structure(base_path: Path, dry_run: bool = False):
    """
    Nettoie l'ancienne structure de dossiers
    
    Args:
        base_path: Chemin de base du serveur LucidLink
        dry_run: Si True, affiche ce qui serait supprimé sans le faire
    """
    print(f"🧹 Nettoyage de l'ancienne structure dans: {base_path}")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if dry_run:
        print("⚠️  MODE DRY RUN - Aucune suppression réelle")
    
    # Vérifier que le chemin existe
    if not base_path.exists():
        print(f"❌ Le chemin {base_path} n'existe pas")
        return False
    
    # Créer une sauvegarde de l'ancienne structure dans le dossier du projet
    project_path = Path(__file__).parent
    backup_path = project_path / "backups" / f"backup_undlm_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    if not dry_run:
        print(f"💾 Création d'une sauvegarde dans: {backup_path}")
        try:
            backup_path.parent.mkdir(exist_ok=True)
            shutil.copytree(base_path, backup_path)
            print("✅ Sauvegarde créée avec succès")
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde: {e}")
            print("⚠️  Continuons sans sauvegarde (à vos risques et périls)")
            choice = input("Continuer sans sauvegarde? (y/n): ").lower()
            if choice != 'y':
                return False
    
    # Dossiers à nettoyer/supprimer
    folders_to_remove = [
        # Anciens dossiers qui ont changé de nom ou de structure
        base_path / "3_PROJECTS" / "2_VFX" / "TEMPLATES",  # Renommé en _TEMPLATES
        base_path / "2_IN" / "_FROM_GRADING" / "BY_SCENE",  # Plus de séquences en source
        base_path / "2_IN" / "_FROM_GRADING" / "SEQUENCES",  # Plus de séquences en source
    ]
    
    # Fichiers spécifiques à supprimer
    files_to_remove = [
        # Anciens fichiers de configuration qui pourraient être obsolètes
        base_path / "structure_config.json",
        base_path / "old_README.md",
    ]
    
    # Suppression des dossiers
    for folder in folders_to_remove:
        if folder.exists():
            if dry_run:
                print(f"🗑️  Supprimerait le dossier: {folder}")
            else:
                try:
                    shutil.rmtree(folder)
                    print(f"✅ Dossier supprimé: {folder}")
                except Exception as e:
                    print(f"❌ Erreur lors de la suppression de {folder}: {e}")
        else:
            print(f"ℹ️  Dossier non trouvé (normal): {folder}")
    
    # Suppression des fichiers
    for file in files_to_remove:
        if file.exists():
            if dry_run:
                print(f"🗑️  Supprimerait le fichier: {file}")
            else:
                try:
                    file.unlink()
                    print(f"✅ Fichier supprimé: {file}")
                except Exception as e:
                    print(f"❌ Erreur lors de la suppression de {file}: {e}")
        else:
            print(f"ℹ️  Fichier non trouvé (normal): {file}")
    
    # Nettoyage des dossiers vides
    empty_folders = []
    for root, dirs, files in os.walk(base_path):
        for d in dirs:
            folder_path = Path(root) / d
            try:
                if not any(folder_path.iterdir()):
                    empty_folders.append(folder_path)
            except:
                pass
    
    for folder in empty_folders:
        if dry_run:
            print(f"🗑️  Supprimerait le dossier vide: {folder}")
        else:
            try:
                folder.rmdir()
                print(f"✅ Dossier vide supprimé: {folder}")
            except Exception as e:
                print(f"❌ Erreur lors de la suppression du dossier vide {folder}: {e}")
    
    if not dry_run:
        # Créer un fichier de log du nettoyage
        log_file = base_path / "cleanup_log.txt"
        with open(log_file, 'w') as f:
            f.write(f"Nettoyage effectué le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Sauvegarde créée dans: {backup_path}\n")
            f.write("Dossiers supprimés:\n")
            for folder in folders_to_remove:
                f.write(f"  - {folder}\n")
            f.write("Fichiers supprimés:\n")
            for file in files_to_remove:
                f.write(f"  - {file}\n")
        
        print(f"📝 Log du nettoyage sauvegardé dans: {log_file}")
    
    return True

def main():
    """Fonction principale"""
    print("🚀 UNDLM PostFlow - Nettoyage de l'ancienne structure")
    print("=" * 60)
    
    # Charger la configuration
    try:
        config = load_config()
        base_path = Path(config['lucidlink']['base_path'])
    except Exception as e:
        print(f"❌ Erreur lors du chargement de la configuration: {e}")
        return
    
    # Demander confirmation
    print(f"📁 Chemin cible: {base_path}")
    print("\n⚠️  ATTENTION: Cette opération va:")
    print("   1. Créer une sauvegarde de la structure actuelle")
    print("   2. Supprimer les anciens dossiers obsolètes")
    print("   3. Nettoyer les dossiers vides")
    
    choice = input("\n🤔 Voulez-vous d'abord voir ce qui serait supprimé? (y/n): ").lower()
    if choice == 'y':
        cleanup_old_structure(base_path, dry_run=True)
        print("\n" + "=" * 60)
    
    choice = input("🚨 Confirmer le nettoyage réel? (y/n): ").lower()
    if choice != 'y':
        print("❌ Nettoyage annulé")
        return
    
    # Effectuer le nettoyage
    success = cleanup_old_structure(base_path, dry_run=False)
    
    if success:
        print("\n✅ Nettoyage terminé avec succès!")
        print("💡 Vous pouvez maintenant exécuter create_folder_structure.py pour créer la nouvelle structure")
    else:
        print("\n❌ Erreur lors du nettoyage")

if __name__ == "__main__":
    main()
