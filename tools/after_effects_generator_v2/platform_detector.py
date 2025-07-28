#!/usr/bin/env python3
"""
Détecteur de Plateforme et Configuration des Chemins
Détecte automatiquement si on est sur Mac ou PC et configure les chemins appropriés
"""

import sys
import os
import platform
from pathlib import Path
from typing import Dict, Tuple, Optional

class PlatformPathManager:
    """Gestionnaire de chemins multi-plateforme pour RL PostFlow."""
    
    def __init__(self):
        self.platform = platform.system()
        self.is_windows = self.platform == "Windows"
        self.is_mac = self.platform == "Darwin"
        self.paths = self._detect_paths()
        
    def _detect_paths(self) -> Dict[str, str]:
        """Détecte automatiquement les chemins selon la plateforme."""
        
        if self.is_windows:
            return self._get_windows_paths()
        elif self.is_mac:
            return self._get_mac_paths()
        else:
            raise RuntimeError(f"Plateforme non supportée : {self.platform}")
    
    def _get_windows_paths(self) -> Dict[str, str]:
        """Retourne les chemins Windows."""
        
        # Chemins de base possibles sur Windows
        possible_bases = [
            "E:/Volumes/resizelab",
            "D:/Volumes/resizelab", 
            "F:/Volumes/resizelab",
            "Z:/resizelab",  # Lecteur réseau mappé
            "//resizelab",   # UNC direct
        ]
        
        base_path = None
        for base in possible_bases:
            test_path = Path(base)
            if test_path.exists():
                base_path = base
                break
        
        if not base_path:
            # Demander à l'utilisateur
            print("🔍 DÉTECTION AUTOMATIQUE ÉCHOUÉE")
            print("Chemins testés :")
            for base in possible_bases:
                print(f"   ❌ {base}")
            print()
            base_path = input("📁 Entrez le chemin de base vers 'resizelab' : ").strip()
            
            if not Path(base_path).exists():
                raise FileNotFoundError(f"Chemin non trouvé : {base_path}")
        
        # Construire les chemins complets
        return {
            "base": base_path,
            "from_edit": f"{base_path}/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS",
            "from_grading": f"{base_path}/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS", 
            "sequences": f"{base_path}/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES",
            "template": f"{base_path}/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX",
            "config": Path(__file__).parent.parent.parent / "config" / "after_effects_mapping_gsheets.json"
        }
    
    def _get_mac_paths(self) -> Dict[str, str]:
        """Retourne les chemins Mac avec le chemin correct confirmé."""
        
        # Chemin confirmé sur Mac
        base_path = "/Volumes/resizelab"
        
        # Vérifier que le volume LucidLink est monté
        if not Path(base_path).exists():
            print("❌ VOLUME LUCIDLINK NON MONTÉ")
            print(f"   Chemin attendu : {base_path}")
            print()
            print("💡 SOLUTIONS :")
            print("   1. Vérifiez que LucidLink est lancé")
            print("   2. Vérifiez la connexion Internet")
            print("   3. Relancez LucidLink si nécessaire")
            print("   4. Attendez que la synchronisation soit complète")
            print()
            
            # Offrir une alternative manuelle
            alt_path = input("📁 Si le volume est monté ailleurs, entrez le chemin complet (ou ENTER pour annuler) : ").strip()
            if alt_path and Path(alt_path).exists():
                base_path = alt_path
            else:
                raise FileNotFoundError(f"Volume LucidLink non accessible : {base_path}")
        
        # Vérifier que la structure o2b-undllm existe
        o2b_path = Path(base_path) / "o2b-undllm"
        if not o2b_path.exists():
            print(f"❌ STRUCTURE O2B NON TROUVÉE")
            print(f"   Volume monté : {base_path} ✅")
            print(f"   Dossier o2b-undllm attendu : {o2b_path} ❌")
            print()
            print("� Vérifiez que la synchronisation LucidLink est complète")
            raise FileNotFoundError(f"Structure o2b-undllm non trouvée : {o2b_path}")
        
        print(f"✅ Chemin Mac détecté et validé : {base_path}")
        
        return {
            "base": base_path,
            "from_edit": f"{base_path}/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS",
            "from_grading": f"{base_path}/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS",
            "sequences": f"{base_path}/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES", 
            "template": f"{base_path}/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX",
            "config": Path(__file__).parent.parent.parent / "config" / "after_effects_mapping_gsheets.json"
        }
    
    def validate_paths(self) -> Tuple[bool, Dict[str, bool]]:
        """Valide que tous les chemins existent."""
        
        results = {}
        
        # Vérifier chemins critiques
        critical_paths = ["from_edit", "sequences", "template", "config"]
        
        for key in critical_paths:
            path = Path(self.paths[key])
            results[key] = path.exists()
        
        # Vérifier chemin grading (optionnel)
        grading_path = Path(self.paths["from_grading"])
        results["from_grading"] = grading_path.exists()
        
        # Tous les chemins critiques doivent exister
        all_critical_ok = all(results[key] for key in critical_paths)
        
        return all_critical_ok, results
    
    def get_template_structure(self) -> Optional[Dict]:
        """Analyse la structure actuelle du template."""
        
        template_path = Path(self.paths["template"])
        if not template_path.exists():
            return None
        
        # Analyser la structure EB
        eb_path = template_path / "_EB" / "UNDLM_00XXX"
        
        if not eb_path.exists():
            return None
        
        structure = {
            "base_folders": [],
            "key_folders": [],
            "others_folders": [],
            "out_folders": []
        }
        
        # Dossiers de base
        for folder in eb_path.iterdir():
            if folder.is_dir():
                structure["base_folders"].append(folder.name)
        
        # Analyser 2_KEY/_Others
        key_others_path = eb_path / "2_KEY" / "_Others"
        if key_others_path.exists():
            for folder in key_others_path.iterdir():
                if folder.is_dir() and not folder.name.startswith('.'):
                    structure["others_folders"].append(folder.name)
        
        # Analyser 2_KEY direct
        key_path = eb_path / "2_KEY"
        if key_path.exists():
            for folder in key_path.iterdir():
                if folder.is_dir() and not folder.name.startswith('_') and not folder.name.startswith('.'):
                    structure["key_folders"].append(folder.name)
        
        # Analyser 3_OUT/_Others
        out_others_path = eb_path / "3_OUT" / "_Others"
        if out_others_path.exists():
            for folder in out_others_path.iterdir():
                if folder.is_dir() and not folder.name.startswith('.'):
                    structure["out_folders"].append(folder.name)
        
        return structure
    
    def print_platform_info(self):
        """Affiche les informations de plateforme."""
        
        print(f"🖥️  PLATEFORME DÉTECTÉE")
        print("=" * 25)
        print(f"   Système : {self.platform}")
        print(f"   Windows : {'✅' if self.is_windows else '❌'}")
        print(f"   Mac : {'✅' if self.is_mac else '❌'}")
        print()
        
        print(f"📁 CHEMINS CONFIGURÉS")
        print("-" * 20)
        for key, path in self.paths.items():
            if key != "config":  # Config est un Path object
                status = "✅" if Path(path).exists() else "❌"
                print(f"   {key:<12} : {status} {path}")
        
        # Config séparément
        config_status = "✅" if self.paths["config"].exists() else "❌"
        print(f"   {'config':<12} : {config_status} {self.paths['config']}")
        
        print()
        
        # Valider
        all_ok, results = self.validate_paths()
        
        if all_ok:
            print("✅ Tous les chemins critiques sont OK")
        else:
            print("⚠️  Certains chemins sont manquants :")
            for key, ok in results.items():
                if not ok:
                    print(f"   ❌ {key}: {self.paths[key]}")
        
        return all_ok

def main():
    """Fonction principale de test."""
    
    print("🔍 DÉTECTEUR DE PLATEFORME RL POSTFLOW")
    print("=" * 45)
    print()
    
    try:
        manager = PlatformPathManager()
        paths_ok = manager.print_platform_info()
        
        # Analyser template si disponible
        if paths_ok:
            print("\n🗂️  ANALYSE STRUCTURE TEMPLATE")
            print("-" * 30)
            
            structure = manager.get_template_structure()
            if structure:
                print("✅ Template analysé avec succès")
                print(f"   Base folders : {structure['base_folders']}")
                print(f"   Key folders : {structure['key_folders']}")
                print(f"   Others folders : {len(structure['others_folders'])} catégories")
                print(f"   Catégories : {', '.join(structure['others_folders'])}")
            else:
                print("❌ Impossible d'analyser le template")
        
        print(f"\n🚀 PRÊT POUR DÉPLOIEMENT : {'✅' if paths_ok else '❌'}")
        
        return 0 if paths_ok else 1
        
    except Exception as e:
        print(f"❌ Erreur : {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
