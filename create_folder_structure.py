"""
Script pour créer la structure de dossiers UNDLM PostFlow sur le serveur LucidLink
Volume: o2b-undllm
Chemin: /Volumes/resizelab/o2b-undllm
"""

import os
from pathlib import Path
from datetime import datetime
import json


class UNDLMFolderStructureCreator:
    """Créateur de structure de dossiers pour UNDLM PostFlow"""
    
    def __init__(self, base_path: str = "/Volumes/resizelab/o2b-undllm"):
        self.base_path = Path(base_path)
        self.creation_log = []
        
    def create_structure(self):
        """Créer la structure complète de dossiers"""
        print("🚀 Création de la structure UNDLM PostFlow")
        print("=" * 60)
        print(f"📍 Chemin de base: {self.base_path}")
        print()
        
        # Vérifier que le volume est monté
        if not self.base_path.exists():
            print(f"❌ ERREUR: Le volume n'est pas monté à {self.base_path}")
            print("   Vérifiez que LucidLink est connecté et que le volume o2b-undllm est accessible")
            return False
        
        # Structure de dossiers selon l'arborescence
        folders_to_create = [
            # 1_REF_FILES
            "1_REF_FILES",
            "1_REF_FILES/1_BRIEFS_AND_REPORTS",
            "1_REF_FILES/2_FONTS",
            "1_REF_FILES/3_LUTS",
            "1_REF_FILES/4_REF",
            "1_REF_FILES/4_REF/STYLE_GUIDES",
            "1_REF_FILES/4_REF/CHARACTER_SHEETS",
            
            # 2_IN
            "2_IN",
            "2_IN/_FROM_GRADING",
            "2_IN/_FROM_GRADING/UNDLM_SOURCES",
            
            # 3_PROJECTS
            "3_PROJECTS",
            "3_PROJECTS/1_EDIT",
            "3_PROJECTS/1_EDIT/_BACKUP",
            "3_PROJECTS/1_EDIT/zz_ASSIST",
            "3_PROJECTS/2_VFX",
            "3_PROJECTS/2_VFX/_BACKUP",
            "3_PROJECTS/2_VFX/_TEMPLATES",
            "3_PROJECTS/2_VFX/MASTER",
            "3_PROJECTS/2_VFX/SEQUENCES",
            "3_PROJECTS/3_GRADING",
            
            # 4_OUT
            "4_OUT",
            "4_OUT/1_FROM_EDIT",
            "4_OUT/1_FROM_EDIT/1_WIP",
            "4_OUT/1_FROM_EDIT/2_DEF",
            "4_OUT/2_FROM_VFX",
            "4_OUT/2_FROM_VFX/BY_SHOT",
            "4_OUT/2_FROM_VFX/BY_SCENE",
            "4_OUT/2_FROM_VFX/ALL",
            "4_OUT/3_MIX",
            "4_OUT/3_MIX/FOR_MIX",
            "4_OUT/3_MIX/FROM_MIX",
            
            # 5_DELIVERABLES
            "5_DELIVERABLES",
            "5_DELIVERABLES/MASTER",
            "5_DELIVERABLES/MASTER/PRORES",
            "5_DELIVERABLES/MASTER/PAD"
        ]
        
        # Créer les dossiers
        success_count = 0
        error_count = 0
        
        for folder_path in folders_to_create:
            full_path = self.base_path / folder_path
            try:
                full_path.mkdir(parents=True, exist_ok=True)
                print(f"✅ {folder_path}")
                self.creation_log.append({
                    'path': str(full_path),
                    'status': 'created',
                    'timestamp': datetime.now().isoformat()
                })
                success_count += 1
            except Exception as e:
                print(f"❌ {folder_path} - Erreur: {e}")
                self.creation_log.append({
                    'path': str(full_path),
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                })
                error_count += 1
        
        print()
        print("📊 Résumé de création:")
        print(f"  ✅ Dossiers créés: {success_count}")
        print(f"  ❌ Erreurs: {error_count}")
        print(f"  📁 Total: {len(folders_to_create)}")
        
        # Créer quelques dossiers de scènes exemples
        self.create_scene_folders()
        
        # Créer les fichiers de configuration
        self.create_config_files()
        
        # Sauvegarder le log de création
        self.save_creation_log()
        
        return error_count == 0
    
    def create_scene_folders(self):
        """Créer des dossiers pour les principales scènes (PROVISOIRES)"""
        print("\n🎬 Création des dossiers de scènes (numérotation provisoire):")
        
        scenes = [
            "SC01_REVEIL_HOPITAL_JOUR",
            "SC02_COULOIR_HOPITAL_JOUR", 
            "SC03_CHAMBRE_PATIENT_NUIT",
            "SC04_FLASHBACK_1_NUIT_AMERICAINE",
            "SC05_EXTERIEUR_HOPITAL_SOIR"
        ]
        
        sequences_base = self.base_path / "3_PROJECTS" / "2_VFX" / "SEQUENCES"
        output_scenes_base = self.base_path / "4_OUT" / "2_FROM_VFX" / "BY_SCENE"
        
        for scene in scenes:
            try:
                # Dossier de séquence After Effects (organisé par scène)
                sequence_path = sequences_base / scene
                sequence_path.mkdir(parents=True, exist_ok=True)
                
                # Dossier output par scène
                scene_output_path = output_scenes_base / scene
                scene_output_path.mkdir(parents=True, exist_ok=True)
                
                print(f"  ✅ {scene} (PROVISOIRE)")
                
            except Exception as e:
                print(f"  ❌ {scene} - Erreur: {e}")
    
    def create_config_files(self):
        """Créer les fichiers de configuration pour le projet"""
        print("\n⚙️ Création des fichiers de configuration:")
        
        # Configuration LucidLink pour le pipeline
        lucidlink_config = {
            "project_name": "UNDLM Documentary",
            "volume_path": str(self.base_path),
            "volume_name": "o2b-undllm",
            "server_path": "/Volumes/resizelab/o2b-undllm",
            "created_date": datetime.now().isoformat(),
            "folder_structure_version": "1.1",
            "notes": "Clips individuels par plan seulement, pas de séquences en source. Numérotation des séquences et plans provisoire.",
            "paths": {
                "sources": "2_IN/_FROM_GRADING/UNDLM_SOURCES",
                "vfx_projects": "3_PROJECTS/2_VFX",
                "vfx_sequences": "3_PROJECTS/2_VFX/SEQUENCES",
                "vfx_templates": "3_PROJECTS/2_VFX/_TEMPLATES",
                "vfx_master": "3_PROJECTS/2_VFX/MASTER",
                "outputs_by_shot": "4_OUT/2_FROM_VFX/BY_SHOT",
                "outputs_by_scene": "4_OUT/2_FROM_VFX/BY_SCENE",
                "outputs_all": "4_OUT/2_FROM_VFX/ALL",
                "deliverables_pad": "5_DELIVERABLES/MASTER/PAD",
                "deliverables_prores": "5_DELIVERABLES/MASTER/PRORES"
            }
        }
        
        # Sauvegarder la config dans le dossier REF
        config_path = self.base_path / "1_REF_FILES" / "1_BRIEFS_AND_REPORTS" / "lucidlink_config.json"
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(lucidlink_config, f, indent=2, ensure_ascii=False)
            print(f"  ✅ Configuration LucidLink: {config_path}")
        except Exception as e:
            print(f"  ❌ Erreur config LucidLink: {e}")
        
        # README pour la structure
        readme_content = f"""# UNDLM PostFlow - Structure de dossiers

## Informations générales
- **Projet**: UNDLM Documentary
- **Volume**: o2b-undllm  
- **Chemin**: {self.base_path}
- **Créé le**: {datetime.now().strftime('%d/%m/%Y à %H:%M')}

## Structure des dossiers

### 1_REF_FILES
Fichiers de référence pour la production
- 1_BRIEFS_AND_REPORTS: Briefs et rapports de production
- 2_FONTS: Polices utilisées
- 3_LUTS: Tables de correspondance couleur
- 4_REF: Références visuelles et guides

### 2_IN
Fichiers sources entrants
- _FROM_GRADING: Sources issues de l'étalonnage
  - UNDLM_SOURCES: Tous les fichiers sources avec nomenclature UNDLM_XXXXX (clips individuels par plan)

### 3_PROJECTS
Projets de travail
- 1_EDIT: Projets de montage Premiere Pro
- 2_VFX: Projets After Effects
  - SEQUENCES: Projets par scène/graphiste (AAMMJJ_NOM_SCENE.aep)
  - _TEMPLATES: Templates de base (UNDLM_SHOT_TEMPLATE.aep)
  - MASTER: Projet master avec toutes les séquences
- 3_GRADING: Projets d'étalonnage

### 4_OUT
Fichiers de sortie
- 1_FROM_EDIT: Exports du montage
- 2_FROM_VFX: Exports VFX
  - BY_SHOT: Par plan individuel (UNDLM_XXXXX_vXXX.mov)
  - BY_SCENE: Par scène complète
  - ALL: Film complet
- 3_MIX: Fichiers pour/depuis le mixage

### 5_DELIVERABLES
Livrables finaux
- MASTER/PAD: Format PAD
- MASTER/PRORES: Format ProRes

## Convention de nommage

### Fichiers sources
- UNDLM_XXXXX (ex: UNDLM_00001)

### Projets After Effects
- Date + Scène: AAMMJJ_NOM_SCENE.aep
- Exemple: 250705_SC01_REVEIL_HOPITAL_JOUR.aep

### Compositions AE
- Plan principal: UNDLM_XXXXX_NOM_SCENE_COMP
- Éléments: UNDLM_XXXXX_CHARACTERS, _ACCESSORIES, _ENVIRONMENT, _EFFECTS
- Final: UNDLM_XXXXX_FINAL

### Versions
- Format: vXXX (v001, v002, v010, etc.)
- Pas de "wip" dans les noms de fichiers

## Workflow
1. Sources dans 2_IN/_FROM_GRADING/UNDLM_SOURCES/ (clips individuels par plan)
2. Projets AE dans 3_PROJECTS/2_VFX/SEQUENCES/ (organisés par scène)
3. Projet master dans 3_PROJECTS/2_VFX/MASTER/
4. Exports dans 4_OUT/2_FROM_VFX/BY_SHOT/UNDLM_XXXXX/
5. Livrables dans 5_DELIVERABLES/MASTER/

⚠️ Les statuts de validation se font via Google Sheets et Frame.io, pas dans l'arborescence.
"""
        
        readme_path = self.base_path / "1_REF_FILES" / "1_BRIEFS_AND_REPORTS" / "README_STRUCTURE.md"
        try:
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(readme_content)
            print(f"  ✅ README structure: {readme_path}")
        except Exception as e:
            print(f"  ❌ Erreur README: {e}")
    
    def save_creation_log(self):
        """Sauvegarder le log de création"""
        log_data = {
            "creation_date": datetime.now().isoformat(),
            "base_path": str(self.base_path),
            "total_folders": len(self.creation_log),
            "successful": len([l for l in self.creation_log if l['status'] == 'created']),
            "errors": len([l for l in self.creation_log if l['status'] == 'error']),
            "log": self.creation_log
        }
        
        log_path = self.base_path / "1_REF_FILES" / "1_BRIEFS_AND_REPORTS" / "folder_creation_log.json"
        try:
            with open(log_path, 'w', encoding='utf-8') as f:
                json.dump(log_data, f, indent=2, ensure_ascii=False)
            print(f"\n📝 Log de création sauvegardé: {log_path}")
        except Exception as e:
            print(f"\n❌ Erreur sauvegarde log: {e}")
    
    def verify_structure(self):
        """Vérifier que la structure a été créée correctement"""
        print("\n🔍 Vérification de la structure:")
        
        key_folders = [
            "1_REF_FILES",
            "2_IN/_FROM_GRADING/UNDLM_SOURCES",
            "3_PROJECTS/2_VFX/SEQUENCES",
            "3_PROJECTS/2_VFX/_TEMPLATES", 
            "4_OUT/2_FROM_VFX/BY_SHOT",
            "5_DELIVERABLES/MASTER/PAD"
        ]
        
        all_good = True
        for folder in key_folders:
            path = self.base_path / folder
            if path.exists():
                print(f"  ✅ {folder}")
            else:
                print(f"  ❌ {folder} - MANQUANT")
                all_good = False
        
        if all_good:
            print("\n🎉 Structure créée avec succès !")
        else:
            print("\n⚠️ Problèmes détectés dans la structure")
        
        return all_good


def main():
    """Script principal"""
    print("🎬 UNDLM PostFlow - Création de structure LucidLink")
    print("=" * 60)
    
    # Chemin du volume LucidLink
    volume_path = "/Volumes/resizelab/o2b-undllm"
    
    # Créer l'instance
    creator = UNDLMFolderStructureCreator(volume_path)
    
    # Créer la structure
    success = creator.create_structure()
    
    # Vérifier la structure
    creator.verify_structure()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ SUCCÈS: Structure UNDLM PostFlow créée sur o2b-undllm")
        print(f"📍 Chemin: {volume_path}")
        print("\n📋 Prochaines étapes:")
        print("1. Configurer le pipeline Python avec le nouveau chemin")
        print("2. Attendre les sources pour les placer dans 2_IN/_FROM_GRADING/UNDLM_SOURCES/")
        print("3. Créer les templates After Effects dans 3_PROJECTS/2_VFX/_TEMPLATES/")
        print("4. Tester le workflow complet")
    else:
        print("❌ ÉCHEC: Erreurs lors de la création de la structure")
        print("Vérifiez les permissions et la connexion LucidLink")


if __name__ == "__main__":
    main()
