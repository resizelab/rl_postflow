#!/usr/bin/env python3
"""
After Effects Auto-Generator v2 pour RL PostFlow
Génère automatiquement les projets AE en respectant la structure du template
Basé sur l'analyse du template AE SQXX_01.aep
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import subprocess
import tempfile

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

class AfterEffectsGeneratorV2:
    """Générateur automatique de projets After Effects v2 - Compatible template AE."""
    
    def __init__(self):
        self.from_edit_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS")
        self.from_grading_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS")
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.template_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX")
        self.config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
    def load_sequence_data(self) -> Dict:
        """Charge les données de mapping des séquences depuis Google Sheets JSON."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            gsheets_data = json.load(f)
        
        # Adapter le format Google Sheets vers le format attendu par le générateur
        adapted_data = {}
        
        for seq_id, seq_info in gsheets_data['sequences'].items():
            plans = []
            
            # Récupérer les données des plans depuis la section "plans"
            for plan_num in seq_info['plans']:
                # Trouver le plan correspondant dans la section "plans"
                plan_key = f"UNDLM_{plan_num:05d}"
                if plan_key in gsheets_data['plans']:
                    plan_data = gsheets_data['plans'][plan_key]
                    plans.append({
                        'plan_num': plan_num,
                        'name': plan_data['shot_name'],
                        'duration': plan_data['duration_seconds'],
                        'status': plan_data['status'],
                        'timecode_in': plan_data['edit_tc_in'],
                        'timecode_out': plan_data['edit_tc_out']
                    })
            
            adapted_data[seq_id] = {
                'name': seq_info['name'],
                'order': seq_info['order'],
                'plans': plans
            }
        
        return adapted_data
    
    def check_graded_plans_availability(self, plans: List[Dict]) -> List[int]:
        """Vérifie quels plans étalonnés sont disponibles."""
        available_graded = []
        
        if not self.from_grading_path.exists():
            print(f"⚠️  Dossier grading non trouvé : {self.from_grading_path}")
            return available_graded
        
        for plan in plans:
            plan_num = plan['plan_num']
            graded_file = self.from_grading_path / f"UNDLM_{plan_num:05d}.mov"
            
            if graded_file.exists():
                available_graded.append(plan_num)
                print(f"✅ Plan étalonné trouvé : UNDLM_{plan_num:05d}")
            else:
                print(f"📝 Plan montage seulement : UNDLM_{plan_num:05d}")
        
        return available_graded
    
    def generate_folder_structure(self) -> str:
        """Génère la structure de dossiers conforme au template AE."""
        return """
// ==========================================
// 1. CRÉATION DE LA STRUCTURE DE DOSSIERS
// ==========================================

// Dossier principal _MASTER
var masterMainFolder = project.items.addFolder("_MASTER");

// Sous-dossiers de _MASTER
var masterCompSeqFolder = project.items.addFolder("MASTER_COMP_SEQ");
masterCompSeqFolder.parentFolder = masterMainFolder;

var masterCompsShotsFolder = project.items.addFolder("MASTER_COMPS_SHOTS");
masterCompsShotsFolder.parentFolder = masterMainFolder;

// Autres dossiers principaux
var inFolder = project.items.addFolder("_IN");
var workFolder = project.items.addFolder("_WORK");

// Sous-dossiers de _IN
var diversFolder = project.items.addFolder("Divers");
diversFolder.parentFolder = inFolder;

var ebFolder = project.items.addFolder("EB");
ebFolder.parentFolder = inFolder;

var fromEditFolder = project.items.addFolder("FROM_EDIT");
fromEditFolder.parentFolder = inFolder;

var fromGradingFolder = project.items.addFolder("FROM_GRADING");
fromGradingFolder.parentFolder = inFolder;

var psFolder = project.items.addFolder("PS");
psFolder.parentFolder = inFolder;

var refColorsFolder = project.items.addFolder("Ref_Colors");
refColorsFolder.parentFolder = inFolder;

// Sous-dossiers de _WORK
var workCompFolder = project.items.addFolder("WORK_COMP");
workCompFolder.parentFolder = workFolder;

var workLayersFolder = project.items.addFolder("WORK_LAYERS");
workLayersFolder.parentFolder = workFolder;

// Structure de dossiers prête pour l'animation
"""

    def generate_import_footage(self, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère l'import des fichiers sources (UHD vers comps 1440p)."""
        imports = []
        
        imports.append("""
// ==========================================
// 2. IMPORT DES FICHIERS SOURCES
// ==========================================

// Arrays pour stocker les footages
var editSources = {};
var gradingSources = {};
""")
        
        # Import des plans EDIT
        for plan in plans:
            plan_num = plan['plan_num']
            plan_file = self.from_edit_path / f"UNDLM_{plan_num:05d}.mov"
            
            import_script = f"""
// Import plan EDIT {plan_num:05d}
var editFile{plan_num} = new File("{plan_file}");
if (editFile{plan_num}.exists) {{
    var editFootage{plan_num} = project.importFile(new ImportOptions(editFile{plan_num}));
    editFootage{plan_num}.parentFolder = fromEditFolder;
    editFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
    editSources[{plan_num}] = editFootage{plan_num};
}} else {{
    alert("ERREUR: Plan EDIT manquant - UNDLM_{plan_num:05d}.mov");
}}"""
            imports.append(import_script)
        
        # Import des plans GRADED (si disponibles)
        for plan in plans:
            plan_num = plan['plan_num']
            if plan_num in available_graded:
                plan_file = self.from_grading_path / f"UNDLM_{plan_num:05d}.mov"
                
                import_script = f"""
// Import plan GRADED {plan_num:05d}
var gradedFile{plan_num} = new File("{plan_file}");
if (gradedFile{plan_num}.exists) {{
    var gradedFootage{plan_num} = project.importFile(new ImportOptions(gradedFile{plan_num}));
    gradedFootage{plan_num}.parentFolder = fromGradingFolder;
    gradedFootage{plan_num}.name = "UNDLM_{plan_num:05d}";
    gradingSources[{plan_num}] = gradedFootage{plan_num};
}}"""
                imports.append(import_script)
        
        return "\n".join(imports)
    
    def generate_plan_compositions(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère les compositions de plans individuels avec sources UHD -> 1440p."""
        compositions = []
        
        compositions.append("""
// ==========================================
// 3. CRÉATION DES COMPOSITIONS DE PLANS
// ==========================================

// Array pour stocker les compositions de plans
var planCompositions = {};

// Créer une composition de solid réutilisable dans WORK_LAYERS
var bgSolidComp = project.items.addComp("BG_SOLID_BLACK", 2560, 1440, 1.0, 10.0, 25);
bgSolidComp.parentFolder = workLayersFolder;
var bgSolidLayer = bgSolidComp.layers.addSolid([0.05, 0.05, 0.05], "BG_SOLID", 2560, 1440, 1.0);
""")
        
        for plan in plans:
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            has_graded = plan_num in available_graded
            
            # Créer la composition du plan
            comp_script = f"""
// Composition pour plan {plan_num:05d}
var planComp{plan_num} = project.items.addComp(
    "{sequence_id}_UNDLM_{plan_num:05d}_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p  
    1.0,            // Pixel aspect ratio
    {duration},     // Durée du plan depuis CSV
    25              // 25 fps
);
planComp{plan_num}.parentFolder = masterCompsShotsFolder;

// Réutiliser le solid de fond existant (AE 2025)
var bgLayer{plan_num} = planComp{plan_num}.layers.add(bgSolidComp);
bgLayer{plan_num}.name = "BG_SOLID";
bgLayer{plan_num}.moveToEnd();

// Ajouter layer EDIT (toujours présent)
if (editSources[{plan_num}]) {{
    var editLayer{plan_num} = planComp{plan_num}.layers.add(editSources[{plan_num}]);
    editLayer{plan_num}.name = "UNDLM_{plan_num:05d}_edit";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    // Facteur de mise à l'échelle: 2560/3840 = 66.67%
    editLayer{plan_num}.property("Transform").property("Scale").setValue([66.67, 66.67]);
    
    // Centrer la source dans la comp
    editLayer{plan_num}.property("Transform").property("Position").setValue([1280, 720]);
}}"""
            
            # Ajouter layer GRADED si disponible
            if has_graded:
                comp_script += f"""

// Ajouter layer GRADED (si disponible)
if (gradingSources[{plan_num}]) {{
    var gradedLayer{plan_num} = planComp{plan_num}.layers.add(gradingSources[{plan_num}]);
    gradedLayer{plan_num}.name = "UNDLM_{plan_num:05d}_graded";
    
    // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
    gradedLayer{plan_num}.property("Transform").property("Scale").setValue([66.67, 66.67]);
    gradedLayer{plan_num}.property("Transform").property("Position").setValue([1280, 720]);
    
    // Désactiver le layer EDIT pour privilégier GRADED
    editLayer{plan_num}.enabled = false;
}}"""
            
            comp_script += f"""

planCompositions[{plan_num}] = planComp{plan_num};
"""
            
            compositions.append(comp_script)
        
        return "\n".join(compositions)
    
    def generate_master_composition(self, sequence_id: str, plans: List[Dict]) -> str:
        """Génère la composition master de la séquence."""
        total_duration = sum(plan.get('duration', 5.0) for plan in plans)
        
        master_script = f"""
// ==========================================
// 4. CRÉATION DE LA COMPOSITION MASTER
// ==========================================

// Composition master de la séquence
var masterComp = project.items.addComp(
    "{sequence_id}_UNDLM_v001",
    2560,           // Largeur 1440p
    1440,           // Hauteur 1440p
    1.0,            // Pixel aspect ratio
    {total_duration}, // Durée totale
    25              // 25 fps
);
masterComp.parentFolder = masterCompSeqFolder;

// Assembly des plans dans la timeline
var currentTime = 0;
"""
        
        current_time = 0
        for i, plan in enumerate(plans):
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            
            assembly_script = f"""
// Ajouter plan {plan_num:05d} à la timeline master
if (planCompositions[{plan_num}]) {{
    var masterLayer{plan_num} = masterComp.layers.add(planCompositions[{plan_num}]);
    masterLayer{plan_num}.startTime = {current_time};
    masterLayer{plan_num}.name = "UNDLM_{plan_num:05d}";
    masterLayer{plan_num}.label = {(i % 16) + 1}; // Couleurs alternées
}}
"""
            master_script += assembly_script
            current_time += duration
        
        # Ajouter le TC en dernier (après tous les plans)
        master_script += """
// Ajouter l'adjustment layer TC en top de la composition master
var tcAdjustment = masterComp.layers.addSolid([1.0, 1.0, 1.0], "TC", 2560, 1440, 1.0);
tcAdjustment.adjustmentLayer = true;
tcAdjustment.moveToBeginning();

// Ajouter l'effet Timecode sur l'adjustment layer
try {
    var timecodeEffect = tcAdjustment.property("Effects").addProperty("ADBE Timecode");
    if (timecodeEffect) {
        // Configuration du timecode (prend automatiquement le TC de la séquence)
        timecodeEffect.property("Display Format").setValue(0); // 25fps
        timecodeEffect.property("Time Units").setValue(0); // Frames
    }
} catch (e) {
    // Si l'effet Timecode n'est pas disponible, on continue sans erreur
    $.writeln("Effet Timecode non disponible, ajout manuel requis");
}
"""
        
        return master_script
    
    def generate_ae_script_v2(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère le script ExtendScript complet v2 compatible template."""
        
        output_path = self.sequences_path / sequence_id / "_AE"
        
        script = f"""
// ==========================================
// RL PostFlow v4.1.1 - Générateur After Effects v2
// Séquence {sequence_id} avec {len(plans)} plans
// Compatible avec template AE SQXX_01.aep
// Sources UHD (3840x2160) -> Comps 1440p (2560x1440)
// ==========================================

// Créer nouveau projet
app.newProject();
var project = app.project;

// Paramètres du projet
project.workAreaStart = 0;
project.feetFramesFilmType = FeetFramesFilmType.MM16;

{self.generate_folder_structure()}

{self.generate_import_footage(plans, available_graded)}

{self.generate_plan_compositions(sequence_id, plans, available_graded)}

{self.generate_master_composition(sequence_id, plans)}

// ==========================================
// 5. SAUVEGARDE ET FINALISATION
// ==========================================

// Sauvegarder le projet
var saveFile = new File("{output_path}/{sequence_id}_01.aep");
project.save(saveFile);

// Statistiques finales
var gradedCount = {len(available_graded)};
var totalCount = {len(plans)};
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence {sequence_id} créée avec succès!\\n\\n" + 
      "📊 Statistiques:\\n" +
      "• Plans total: " + totalCount + "\\n" + 
      "• Plans étalonnés: " + gradedCount + "\\n" +
      "• Plans montage seul: " + editOnlyCount + "\\n" +
      "• Durée séquence: " + Math.round({sum(plan.get('duration', 5.0) for plan in plans)} * 100) / 100 + "s\\n\\n" +
      "💾 Sauvegardé: {sequence_id}_01.aep\\n\\n" +
      "✅ Structure conforme au template AE\\n" +
      "✅ Sources UHD mises à l'échelle en 1440p\\n" +
      "✅ Import Edit + Graded selon disponibilité");

// Log pour Python
$.writeln("AE_GENERATION_V2_SUCCESS:{sequence_id}:" + totalCount + ":" + gradedCount);
"""
        
        return script
    
    def generate_for_sequence(self, sequence_id: str, dry_run: bool = False) -> bool:
        """Génère le projet AE pour une séquence donnée avec la nouvelle structure."""
        try:
            sequence_data = self.load_sequence_data()
            
            if sequence_id not in sequence_data:
                print(f"❌ Séquence {sequence_id} non trouvée dans le mapping")
                return False
            
            seq_info = sequence_data[sequence_id]
            plans = seq_info['plans']
            
            print(f"\n🎬 Génération AE v2 pour {sequence_id} (Nouveau Template)")
            print(f"   📝 {len(plans)} plans à traiter")
            
            if not dry_run:
                # 1. Créer la structure EB complète
                print("📁 Création de la structure EB...")
                if not self.create_eb_structure_for_plans(sequence_id, plans):
                    print("❌ Échec création structure EB")
                    return False
                
                # 2. Créer le dossier _PS
                ps_dir = self.sequences_path / sequence_id / "_PS"
                ps_dir.mkdir(parents=True, exist_ok=True)
                print("📁 Dossier _PS créé")
            
            # 3. Vérifier disponibilité des plans étalonnés
            available_graded = self.check_graded_plans_availability(plans)
            
            # 4. Générer le script ExtendScript
            ae_script = self.generate_ae_script_v2(sequence_id, plans, available_graded)
            
            # 5. Créer le dossier de sortie AE
            output_dir = self.sequences_path / sequence_id / "_AE"
            if not dry_run:
                output_dir.mkdir(parents=True, exist_ok=True)
            
            # 6. Sauvegarder le script
            script_file = output_dir / f"{sequence_id}_generation_script_v2.jsx"
            
            if not dry_run:
                with open(script_file, 'w', encoding='utf-8') as f:
                    f.write(ae_script)
                print(f"✅ Script généré : {script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait généré : {script_file}")
            
            # 7. Copier également dans le dossier ae_scripts local
            local_script_dir = Path(__file__).parent.parent / "ae_scripts"
            local_script_file = local_script_dir / f"RL_PostFlow_{sequence_id}_GENERATION_V2.jsx"
            
            if not dry_run:
                local_script_dir.mkdir(exist_ok=True)
                with open(local_script_file, 'w', encoding='utf-8') as f:
                    f.write(ae_script)
                print(f"✅ Script copié localement : {local_script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait copié : {local_script_file}")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la génération : {e}")
            return False
    
    def generate_validation_sequences(self, dry_run: bool = False) -> bool:
        """Génère les projets AE pour les 3 premières séquences (validation)."""
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        success_count = 0
        
        for seq_id in validation_sequences:
            if self.generate_for_sequence(seq_id, dry_run):
                success_count += 1
        
        print(f"\n📊 Génération terminée : {success_count}/{len(validation_sequences)} séquences")
        return success_count == len(validation_sequences)
    
    def create_eb_structure_for_plans(self, sequence_id: str, plans: List[Dict]) -> bool:
        """Crée la structure EB pour tous les plans d'une séquence basée sur le template."""
        try:
            sequence_dir = self.sequences_path / sequence_id
            eb_dir = sequence_dir / "_EB"
            
            # Créer le dossier _EB principal
            eb_dir.mkdir(parents=True, exist_ok=True)
            
            for plan in plans:
                plan_num = plan['plan_num']
                plan_dir = eb_dir / f"UNDLM_{plan_num:05d}"
                
                # Créer la structure pour chaque plan
                (plan_dir / "1_VIDEO-REF").mkdir(parents=True, exist_ok=True)
                
                # Créer la structure 2_KEY avec la nouvelle arborescence
                key_dir = plan_dir / "2_KEY"
                key_dir.mkdir(exist_ok=True)
                
                # Créer les dossiers de la nouvelle structure 2_KEY
                (key_dir / "HAIR").mkdir(exist_ok=True)
                (key_dir / "SKIN").mkdir(exist_ok=True)
                
                # Créer la structure _Others avec tous ses sous-dossiers
                others_dir = key_dir / "_Others"
                others_dir.mkdir(exist_ok=True)
                
                others_subdirs = [
                    "Cloth_1", "Cloth_2", "Decor_1", "Decor_2", 
                    "LifeJacket", "Lips", "Pupil", "Shadow", "Silhouettes"
                ]
                
                for subdir in others_subdirs:
                    (others_dir / subdir).mkdir(exist_ok=True)
                
                # Créer la structure 3_OUT (identique à 2_KEY)
                out_dir = plan_dir / "3_OUT"
                out_dir.mkdir(exist_ok=True)
                
                # 3_OUT a la même structure que 2_KEY
                (out_dir / "HAIR").mkdir(exist_ok=True)
                (out_dir / "SKIN").mkdir(exist_ok=True)
                
                # Créer la structure _Others dans 3_OUT aussi
                out_others_dir = out_dir / "_Others"
                out_others_dir.mkdir(exist_ok=True)
                
                for subdir in others_subdirs:
                    (out_others_dir / subdir).mkdir(exist_ok=True)
                
                # Copier le fichier PSD template s'il existe
                template_psd = self.template_path / "_EB" / "UNDLM_00XXX" / "EB_UNDLM_00XXX.psd"
                target_psd = plan_dir / f"EB_UNDLM_{plan_num:05d}.psd"
                
                if template_psd.exists():
                    import shutil
                    try:
                        shutil.copy2(template_psd, target_psd)
                    except Exception as e:
                        print(f"⚠️  Impossible de copier le PSD pour {plan_num:05d}: {e}")
                
                print(f"✅ Structure EB créée pour UNDLM_{plan_num:05d}")
            
            print(f"🎬 Structure EB complète créée pour {sequence_id} ({len(plans)} plans)")
            return True
            
        except Exception as e:
            print(f"❌ Erreur création structure EB : {e}")
            return False

    def generate_all_sequences(self, dry_run: bool = False) -> bool:
        """Génère toutes les séquences disponibles."""
        try:
            sequence_data = self.load_sequence_data()
            sequences = list(sequence_data.keys())
            sequences.sort()  # Trier par ordre alphabétique
            
            success_count = 0
            total_sequences = len(sequences)
            
            print(f"🎬 Génération de toutes les séquences ({total_sequences} au total)")
            
            for i, seq_id in enumerate(sequences, 1):
                print(f"\n📍 [{i}/{total_sequences}] Traitement de {seq_id}")
                if self.generate_for_sequence(seq_id, dry_run):
                    success_count += 1
                else:
                    print(f"❌ Échec pour {seq_id}")
            
            print(f"\n📊 Génération terminée : {success_count}/{total_sequences} séquences réussies")
            return success_count == total_sequences
            
        except Exception as e:
            print(f"❌ Erreur génération massive : {e}")
            return False

def main():
    """Point d'entrée principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Générateur After Effects v2 pour RL PostFlow')
    parser.add_argument('--sequence', '-s', help='Séquence à générer (ex: SQ01)')
    parser.add_argument('--validation', '-v', action='store_true', help='Générer les 3 premières séquences pour validation')
    parser.add_argument('--all', '-a', action='store_true', help='Générer toutes les séquences disponibles')
    parser.add_argument('--dry-run', '-d', action='store_true', help='Mode simulation (pas de génération réelle)')
    
    args = parser.parse_args()
    
    generator = AfterEffectsGeneratorV2()
    
    if args.validation:
        print("🎯 Mode validation : génération des 3 premières séquences")
        success = generator.generate_validation_sequences(args.dry_run)
        sys.exit(0 if success else 1)
    elif args.all:
        print("🚀 Mode complet : génération de toutes les séquences")
        success = generator.generate_all_sequences(args.dry_run)
        sys.exit(0 if success else 1)
    elif args.sequence:
        success = generator.generate_for_sequence(args.sequence, args.dry_run)
        sys.exit(0 if success else 1)
    else:
        print("❌ Spécifiez --sequence, --validation ou --all")
        print("   --validation : génère SQ01, SQ02, SQ03")
        print("   --all : génère toutes les séquences")
        print("   --sequence SQ01 : génère une séquence spécifique")
        sys.exit(1)

if __name__ == "__main__":
    main()
