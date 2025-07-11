#!/usr/bin/env python3
"""
Script de Déploiement After Effects Templates
Déploie automatiquement la structure SQXX vers toutes les séquences
"""

import json
import shutil
import os
from pathlib import Path
import argparse
import time
import logging
from typing import Dict, List, Optional

# Configuration
TEMPLATE_SOURCE = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX")
SEQUENCES_DEST = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
CONFIG_FILE = Path(__file__).parent.parent / "config" / "after_effects_mapping.json"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('after_effects_deployment.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AfterEffectsDeployer:
    """Déployeur automatique de templates After Effects."""
    
    def __init__(self):
        self.config = self.load_config()
        self.stats = {
            'sequences_created': 0,
            'plans_created': 0,
            'files_copied': 0,
            'errors': 0,
            'start_time': None,
            'end_time': None
        }
        
    def load_config(self) -> Dict:
        """Charge la configuration depuis le fichier JSON."""
        if not CONFIG_FILE.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {CONFIG_FILE}")
            
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def validate_paths(self) -> bool:
        """Valide l'existence des chemins source et destination."""
        if not TEMPLATE_SOURCE.exists():
            logger.error(f"❌ Template source non trouvé : {TEMPLATE_SOURCE}")
            return False
            
        if not SEQUENCES_DEST.exists():
            logger.error(f"❌ Dossier destination non trouvé : {SEQUENCES_DEST}")
            return False
            
        logger.info(f"✅ Chemins validés")
        logger.info(f"   Source : {TEMPLATE_SOURCE}")
        logger.info(f"   Destination : {SEQUENCES_DEST}")
        return True
    
    def rename_patterns(self, content: str, sequence_id: str, plan_num: Optional[int] = None) -> str:
        """Renomme les patterns dans les fichiers et dossiers."""
        # SQXX → SQ01, SQ02, etc.
        content = content.replace("SQXX", sequence_id)
        
        if plan_num is not None:
            # 00XXX → 00001, 00002, etc.
            content = content.replace("00XXX", f"{plan_num:05d}")
            # XXX → 001, 002, etc. (pour compatibility)
            content = content.replace("XXX", f"{plan_num:03d}")
            
        return content
    
    def copy_and_rename_file(self, src_file: Path, dest_file: Path, 
                           sequence_id: str, plan_num: Optional[int] = None) -> bool:
        """Copie et renomme un fichier en appliquant les patterns."""
        try:
            # Créer le dossier parent si nécessaire
            dest_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Copier le fichier
            shutil.copy2(src_file, dest_file)
            
            # Si c'est un fichier texte/script, renommer le contenu
            text_extensions = {'.aep', '.psd', '.jsx', '.txt', '.md', '.json'}
            if dest_file.suffix.lower() in text_extensions:
                try:
                    # Lire et renommer le contenu pour certains types
                    if dest_file.suffix.lower() in {'.txt', '.md', '.json'}:
                        content = dest_file.read_text(encoding='utf-8')
                        new_content = self.rename_patterns(content, sequence_id, plan_num)
                        dest_file.write_text(new_content, encoding='utf-8')
                except Exception as e:
                    logger.warning(f"⚠️  Renommage contenu échoué pour {dest_file}: {e}")
            
            self.stats['files_copied'] += 1
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur copie {src_file} → {dest_file}: {e}")
            self.stats['errors'] += 1
            return False
    
    def copy_directory_structure(self, src_dir: Path, dest_dir: Path, 
                                sequence_id: str, plan_num: Optional[int] = None) -> bool:
        """Copie récursivement une structure de dossiers en renommant."""
        try:
            for src_item in src_dir.rglob('*'):
                if src_item.name.startswith('.'):
                    continue  # Ignorer les fichiers cachés
                    
                # Calculer le chemin relatif
                rel_path = src_item.relative_to(src_dir)
                
                # Renommer le chemin
                new_rel_path = self.rename_patterns(str(rel_path), sequence_id, plan_num)
                dest_item = dest_dir / new_rel_path
                
                if src_item.is_file():
                    if not self.copy_and_rename_file(src_item, dest_item, sequence_id, plan_num):
                        return False
                elif src_item.is_dir():
                    dest_item.mkdir(parents=True, exist_ok=True)
                    
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur copie structure {src_dir} → {dest_dir}: {e}")
            self.stats['errors'] += 1
            return False
    
    def create_sequence(self, sequence_id: str, sequence_info: Dict) -> bool:
        """Crée une séquence complète avec tous ses plans."""
        logger.info(f"\\n🎬 Création séquence {sequence_id}: {sequence_info['name']}")
        
        # Créer le dossier de séquence
        sequence_dir = SEQUENCES_DEST / sequence_id
        if sequence_dir.exists():
            logger.warning(f"⚠️  Séquence {sequence_id} existe déjà, suppression...")
            shutil.rmtree(sequence_dir)
        
        sequence_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Copier la structure _AE
        logger.info(f"   📁 Création dossier _AE...")
        ae_src = TEMPLATE_SOURCE / "_AE"
        ae_dest = sequence_dir / "_AE"
        if not self.copy_directory_structure(ae_src, ae_dest, sequence_id):
            return False
        
        # 2. Créer la structure _EB avec tous les plans
        logger.info(f"   📁 Création dossier _EB avec {sequence_info['plan_count']} plans...")
        eb_dest = sequence_dir / "_EB"
        eb_dest.mkdir(parents=True, exist_ok=True)
        
        # Template plan source
        plan_template = TEMPLATE_SOURCE / "_EB" / "UNDLM_00XXX"
        
        # Créer chaque plan de la séquence
        for plan_num in sequence_info['plans']:
            plan_name = f"UNDLM_{plan_num:05d}"
            plan_dest = eb_dest / plan_name
            
            logger.info(f"      📋 Plan {plan_num:03d} → {plan_name}")
            
            if not self.copy_directory_structure(plan_template, plan_dest, sequence_id, plan_num):
                logger.error(f"❌ Échec création plan {plan_name}")
                return False
                
            self.stats['plans_created'] += 1
        
        # 3. Créer la structure _PS (vide)
        logger.info(f"   📁 Création dossier _PS...")
        ps_dest = sequence_dir / "_PS"
        ps_dest.mkdir(parents=True, exist_ok=True)
        
        self.stats['sequences_created'] += 1
        logger.info(f"✅ Séquence {sequence_id} créée avec succès")
        return True
    
    def deploy_sequence(self, sequence_id: str) -> bool:
        """Déploie une séquence spécifique."""
        if sequence_id not in self.config['sequences']:
            logger.error(f"❌ Séquence {sequence_id} non trouvée dans la configuration")
            return False
            
        sequence_info = self.config['sequences'][sequence_id]
        return self.create_sequence(sequence_id, sequence_info)
    
    def deploy_all_sequences(self) -> bool:
        """Déploie toutes les séquences."""
        logger.info(f"🚀 DÉPLOIEMENT DE TOUTES LES SÉQUENCES")
        logger.info(f"   Total séquences : {len(self.config['sequences'])}")
        logger.info(f"   Total plans : {self.config['metadata']['total_plans']}")
        
        success_count = 0
        
        for sequence_id, sequence_info in self.config['sequences'].items():
            if self.deploy_sequence(sequence_id):
                success_count += 1
            else:
                logger.error(f"❌ Échec déploiement {sequence_id}")
        
        logger.info(f"\\n📊 RÉSUMÉ DÉPLOIEMENT")
        logger.info(f"   ✅ Séquences réussies : {success_count}/{len(self.config['sequences'])}")
        logger.info(f"   📋 Plans créés : {self.stats['plans_created']}")
        logger.info(f"   📄 Fichiers copiés : {self.stats['files_copied']}")
        logger.info(f"   ❌ Erreurs : {self.stats['errors']}")
        
        return success_count == len(self.config['sequences'])
    
    def validate_deployment(self) -> bool:
        """Valide le déploiement en vérifiant la structure créée."""
        logger.info(f"\\n🔍 VALIDATION DU DÉPLOIEMENT")
        
        validation_errors = 0
        
        for sequence_id, sequence_info in self.config['sequences'].items():
            sequence_dir = SEQUENCES_DEST / sequence_id
            
            # Vérifier existence séquence
            if not sequence_dir.exists():
                logger.error(f"❌ Séquence manquante : {sequence_id}")
                validation_errors += 1
                continue
            
            # Vérifier structure _AE, _EB, _PS
            for folder in ['_AE', '_EB', '_PS']:
                folder_path = sequence_dir / folder
                if not folder_path.exists():
                    logger.error(f"❌ Dossier manquant : {sequence_id}/{folder}")
                    validation_errors += 1
            
            # Vérifier fichier AE
            ae_file = sequence_dir / "_AE" / f"{sequence_id}_01.aep"
            if not ae_file.exists():
                logger.error(f"❌ Fichier AE manquant : {ae_file}")
                validation_errors += 1
            
            # Vérifier plans EB
            eb_dir = sequence_dir / "_EB"
            for plan_num in sequence_info['plans']:
                plan_name = f"UNDLM_{plan_num:05d}"
                plan_dir = eb_dir / plan_name
                
                if not plan_dir.exists():
                    logger.error(f"❌ Plan manquant : {sequence_id}/{plan_name}")
                    validation_errors += 1
                    continue
                
                # Vérifier structure plan
                for subfolder in ['1_VIDEO-REF', '2_KEY', '3_OUT']:
                    subfolder_path = plan_dir / subfolder
                    if not subfolder_path.exists():
                        logger.error(f"❌ Sous-dossier manquant : {plan_name}/{subfolder}")
                        validation_errors += 1
                
                # Vérifier fichier PSD
                psd_file = plan_dir / f"EB_{plan_name}.psd"
                if not psd_file.exists():
                    logger.error(f"❌ Fichier PSD manquant : {psd_file}")
                    validation_errors += 1
        
        if validation_errors == 0:
            logger.info(f"✅ VALIDATION RÉUSSIE - Aucune erreur détectée")
            return True
        else:
            logger.error(f"❌ VALIDATION ÉCHOUÉE - {validation_errors} erreurs détectées")
            return False
    
    def run(self, sequence_id: Optional[str] = None, test_mode: bool = False) -> bool:
        """Exécute le déploiement."""
        self.stats['start_time'] = time.time()
        
        logger.info(f"🎬 AFTER EFFECTS TEMPLATE DEPLOYER")
        logger.info(f"=" * 50)
        
        if test_mode:
            logger.info(f"🧪 MODE TEST ACTIVÉ")
        
        # Validation des chemins
        if not self.validate_paths():
            return False
        
        # Déploiement
        success = False
        if sequence_id:
            logger.info(f"🎯 Déploiement séquence unique : {sequence_id}")
            success = self.deploy_sequence(sequence_id)
        else:
            success = self.deploy_all_sequences()
        
        # Validation finale
        if success and not test_mode:
            self.validate_deployment()
        
        self.stats['end_time'] = time.time()
        duration = self.stats['end_time'] - self.stats['start_time']
        
        logger.info(f"\\n⏱️  DURÉE TOTALE : {duration:.1f} secondes")
        
        return success

def main():
    """Fonction principale avec arguments ligne de commande."""
    parser = argparse.ArgumentParser(description='Déploiement After Effects Templates')
    parser.add_argument('--sequence', '-s', help='Déployer une séquence spécifique (ex: SQ01)')
    parser.add_argument('--test', '-t', action='store_true', help='Mode test (pas de validation finale)')
    parser.add_argument('--all', '-a', action='store_true', help='Déployer toutes les séquences')
    parser.add_argument('--validate', '-v', action='store_true', help='Valider seulement (pas de déploiement)')
    
    args = parser.parse_args()
    
    try:
        deployer = AfterEffectsDeployer()
        
        if args.validate:
            # Mode validation seulement
            success = deployer.validate_deployment()
        elif args.sequence:
            # Déploiement séquence unique
            success = deployer.run(sequence_id=args.sequence, test_mode=args.test)
        elif args.all:
            # Déploiement complet
            success = deployer.run(test_mode=args.test)
        else:
            # Mode interactif
            print("🎬 After Effects Template Deployer")
            print("Choisissez une option :")
            print("1. Déployer toutes les séquences")
            print("2. Déployer une séquence spécifique")
            print("3. Valider le déploiement existant")
            
            choice = input("Votre choix (1-3) : ").strip()
            
            if choice == "1":
                success = deployer.run()
            elif choice == "2":
                seq_id = input("ID de la séquence (ex: SQ01) : ").strip().upper()
                success = deployer.run(sequence_id=seq_id)
            elif choice == "3":
                success = deployer.validate_deployment()
            else:
                print("❌ Choix invalide")
                return 1
        
        return 0 if success else 1
        
    except Exception as e:
        logger.error(f"❌ Erreur fatale : {e}")
        return 1

if __name__ == "__main__":
    exit(main())
