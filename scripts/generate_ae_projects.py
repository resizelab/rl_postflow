#!/usr/bin/env python3
"""
After Effects Auto-Generator pour RL PostFlow
Génère automatiquement les projets AE avec support Edit + Grading
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

class AfterEffectsGenerator:
    """Générateur automatique de projets After Effects."""
    
    def __init__(self):
        self.from_edit_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_EDIT/BY_SHOTS")
        self.from_grading_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS")
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
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
    
    def generate_edit_import_statements(self, plans: List[Dict]) -> str:
        """Génère les imports des plans FROM_EDIT."""
        imports = []
        for plan in plans:
            plan_num = plan['plan_num']
            plan_file = self.from_edit_path / f"UNDLM_{plan_num:05d}.mov"
            
            import_script = f"""
// Import plan EDIT {plan_num:03d}
var editFile{plan_num} = new File("{plan_file}");
if (editFile{plan_num}.exists) {{
    var editFootage{plan_num} = project.importFile(new ImportOptions(editFile{plan_num}));
    editFootage{plan_num}.parentFolder = fromEditFolder;
    editFootage{plan_num}.name = "UNDLM_{plan_num:05d}_edit";
    editSources[{plan_num}] = editFootage{plan_num};
}} else {{
    alert("ERREUR: Plan EDIT manquant - {plan_file}");
}}"""
            imports.append(import_script)
        return "\n".join(imports)
    
    def generate_grading_import_statements(self, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère les imports des plans FROM_GRADING."""
        imports = []
        for plan in plans:
            plan_num = plan['plan_num']
            if plan_num in available_graded:
                plan_file = self.from_grading_path / f"UNDLM_{plan_num:05d}.mov"
                
                import_script = f"""
// Import plan GRADED {plan_num:03d}
var gradedFile{plan_num} = new File("{plan_file}");
if (gradedFile{plan_num}.exists) {{
    var gradedFootage{plan_num} = project.importFile(new ImportOptions(gradedFile{plan_num}));
    gradedFootage{plan_num}.parentFolder = fromGradingFolder;
    gradedFootage{plan_num}.name = "UNDLM_{plan_num:05d}_graded";
    gradingSources[{plan_num}] = gradedFootage{plan_num};
}}"""
                imports.append(import_script)
        return "\n".join(imports)
    
    def generate_plan_precomps_with_switch(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère les précompositions avec système de switch."""
        precomps = []
        
        for plan in plans:
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            has_graded = plan_num in available_graded
            
            graded_section = ""
            if has_graded:
                graded_section = f"""
// Ajouter layer GRADED (si disponible)
if (typeof gradedFootage{plan_num} !== 'undefined') {{
    var gradedLayer{plan_num} = precomp{plan_num}.layers.add(gradedFootage{plan_num});
    gradedLayer{plan_num}.name = "GRADED_Source";
    gradedLayer{plan_num}.enabled = true;
    
    // Graded par défaut si disponible
    editLayer{plan_num}.enabled = false;
}}"""
            
            switch_section = ""
            if has_graded:
                switch_section = f"""
// Expression pour switch automatique Edit/Graded
var switchExpression = \"\"\"
var switchValue = thisComp.layer("SWITCH_CONTROL").effect("Edit_Graded_Switch")("Slider");
if (switchValue > 0.5) {{
    // Mode Graded
    thisLayer.enabled = (thisLayer.name == "GRADED_Source");
}} else {{
    // Mode Edit  
    thisLayer.enabled = (thisLayer.name == "EDIT_Source");
}}
\"\"\";

editLayer{plan_num}.enabled.expression = switchExpression;
gradedLayer{plan_num}.enabled.expression = switchExpression;"""
            
            precomp_script = f"""
// Précomposition plan {plan_num:03d} avec switch Edit/Graded
var precomp{plan_num} = project.items.addComp(
    "{sequence_id}_UNDLM_{plan_num:05d}_v001",
    1440,           // 1440p
    1080,
    1.0,
    {duration},
    25
);

// Ajouter layer EDIT (toujours présent)
if (typeof editFootage{plan_num} !== 'undefined') {{
    var editLayer{plan_num} = precomp{plan_num}.layers.add(editFootage{plan_num});
    editLayer{plan_num}.name = "EDIT_Source";
    editLayer{plan_num}.enabled = true;
}}

{graded_section}

// Ajouter un calque de contrôle pour switch
var switchControl{plan_num} = precomp{plan_num}.layers.addNull();
switchControl{plan_num}.name = "SWITCH_CONTROL";
switchControl{plan_num}.label = 1; // Rouge pour le contrôle

// Ajouter effet slider control
var sliderEffect{plan_num} = switchControl{plan_num}.property("Effects").addProperty("ADBE Slider Control");
sliderEffect{plan_num}.name = "Edit_Graded_Switch";
sliderEffect{plan_num}.property("Slider").setValue({1 if has_graded else 0}); // 0=Edit, 1=Graded

{switch_section}

precomp{plan_num}.parentFolder = precompsFolder;
planPrecomps.push(precomp{plan_num});"""
            
            precomps.append(precomp_script)
        
        return "\n".join(precomps)
    
    def generate_sequence_assembly(self, plans: List[Dict]) -> str:
        """Génère l'assembly dans la composition séquence."""
        assembly = []
        current_time = 0
        
        for i, plan in enumerate(plans):
            plan_num = plan['plan_num']
            duration = plan.get('duration', 5.0)
            
            assembly_script = f"""
// Ajouter plan {plan_num:03d} à la séquence principale
var seqLayer{plan_num} = seqComp.layers.add(precomp{plan_num});
seqLayer{plan_num}.startTime = {current_time};
seqLayer{plan_num}.name = "Plan_{plan_num:03d}_UNDLM_{plan_num:05d}";
seqLayer{plan_num}.label = {(i % 16) + 1}; // Couleurs alternées"""
            
            assembly.append(assembly_script)
            current_time += duration
        
        return "\n".join(assembly)
    
    def calculate_sequence_duration(self, plans: List[Dict]) -> float:
        """Calcule la durée totale de la séquence."""
        return sum(plan.get('duration', 5.0) for plan in plans)
    
    def generate_ae_script(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère le script ExtendScript complet."""
        
        output_path = self.sequences_path / sequence_id / "_AE"
        
        script = f"""
// ==========================================
// RL PostFlow - Générateur After Effects
// Séquence {sequence_id} avec {len(plans)} plans
// Plans étalonnés : {len(available_graded)}/{len(plans)}
// ==========================================

// 1. Créer nouveau projet
app.newProject();
var project = app.project;

// 2. Paramètres projet
project.workAreaStart = 0;
project.feetFramesFilmType = FeetFramesFilmType.MM16;

// 3. Créer structure de dossiers
var fromEditFolder = project.items.addFolder("FROM_EDIT");
var fromGradingFolder = project.items.addFolder("FROM_GRADING");
var precompsFolder = project.items.addFolder("Precomps");

// 4. Initialiser arrays
var editSources = [];
var gradingSources = [];
var planPrecomps = [];

{self.generate_edit_import_statements(plans)}

{self.generate_grading_import_statements(plans, available_graded)}

{self.generate_plan_precomps_with_switch(sequence_id, plans, available_graded)}

// 8. Créer la composition séquence principale
var seqComp = project.items.addComp(
    "{sequence_id}_UNDLM_v001",
    1440,           // Largeur 1440p
    1080,           // Hauteur
    1.0,            // Pixel aspect ratio
    {self.calculate_sequence_duration(plans)}, // Durée totale
    25              // 25 fps
);

{self.generate_sequence_assembly(plans)}

// 10. Organiser et optimiser
seqComp.parentFolder = project.rootFolder;

// 11. Sauvegarder le projet
var saveFile = new File("{output_path}/{sequence_id}_01.aep");
project.save(saveFile);

// 12. Log de confirmation
var gradedCount = {len(available_graded)};
var totalCount = {len(plans)};
var editOnlyCount = totalCount - gradedCount;

alert("🎬 Séquence {sequence_id} créée avec succès!\\n\\n" + 
      "📊 Statistiques:\\n" +
      "• Plans total: " + totalCount + "\\n" + 
      "• Plans étalonnés: " + gradedCount + "\\n" +
      "• Plans montage seul: " + editOnlyCount + "\\n" +
      "• Durée séquence: " + Math.round(seqComp.duration * 100) / 100 + "s\\n\\n" +
      "💾 Sauvegardé: {sequence_id}_01.aep\\n\\n" +
      "🎛️  Utilisez les contrôles SWITCH_CONTROL\\n" +
      "pour basculer entre Edit et Graded");

// 13. Retour information pour Python
$.writeln("AE_GENERATION_SUCCESS:{sequence_id}:" + totalCount + ":" + gradedCount);
"""
        return script
    
    def execute_ae_script(self, script_content: str, sequence_id: str) -> bool:
        """Exécute le script ExtendScript dans After Effects."""
        
        # Créer fichier script temporaire
        with tempfile.NamedTemporaryFile(mode='w', suffix='.jsx', delete=False) as f:
            f.write(script_content)
            script_path = f.name
        
        try:
            # Trouver After Effects
            ae_paths = [
                "/Applications/Adobe After Effects 2024/aerender",
                "/Applications/Adobe After Effects 2023/aerender",
                "/Applications/Adobe After Effects CC 2019/aerender"
            ]
            
            ae_executable = None
            for path in ae_paths:
                if os.path.exists(path):
                    ae_executable = path
                    break
            
            if not ae_executable:
                print("❌ After Effects non trouvé. Exécutez manuellement le script :")
                print(f"📄 Script généré : {script_path}")
                return False
            
            # Exécuter le script
            print(f"🚀 Exécution du script AE pour {sequence_id}...")
            
            cmd = [ae_executable, "-script", script_path]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Script AE exécuté avec succès pour {sequence_id}")
                # Nettoyer le fichier temporaire
                os.unlink(script_path)
                return True
            else:
                print(f"❌ Erreur exécution script AE : {result.stderr}")
                print(f"📄 Script conservé : {script_path}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur lors de l'exécution : {e}")
            print(f"📄 Script conservé : {script_path}")
            return False
    
    def generate_sequence(self, sequence_id: str, dry_run: bool = False) -> bool:
        """Génère une séquence After Effects complète."""
        
        print(f"🎬 Génération séquence {sequence_id}")
        print("=" * 50)
        
        # 1. Charger les données adaptées
        data = self.load_sequence_data()
        
        if sequence_id not in data:
            print(f"❌ Séquence {sequence_id} non trouvée")
            available_sequences = list(data.keys())
            print(f"📋 Séquences disponibles : {', '.join(available_sequences[:10])}")
            return False
        
        sequence_info = data[sequence_id]
        plans = sequence_info['plans']
        
        print(f"📋 Séquence : {sequence_info['name']}")
        print(f"📊 Plans : {len(plans)}")
        
        # 3. Vérifier disponibilité des plans étalonnés
        available_graded = self.check_graded_plans_availability(plans)
        print(f"🎨 Plans étalonnés disponibles : {len(available_graded)}/{len(plans)}")
        
        # 4. Créer le dossier de destination
        sequence_dir = self.sequences_path / sequence_id
        ae_dir = sequence_dir / "_AE"
        ae_dir.mkdir(parents=True, exist_ok=True)
        
        # 5. Générer le script AE
        script_content = self.generate_ae_script(sequence_id, plans, available_graded)
        
        if dry_run:
            # Mode test : sauvegarder le script seulement
            script_file = ae_dir / f"{sequence_id}_generation_script.jsx"
            with open(script_file, 'w', encoding='utf-8') as f:
                f.write(script_content)
            print(f"📄 Script généré (dry run) : {script_file}")
            return True
        else:
            # Mode production : exécuter le script
            return self.execute_ae_script(script_content, sequence_id)

def main():
    """Fonction principale."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Générateur After Effects pour RL PostFlow')
    parser.add_argument('--sequence', '-s', help='ID de séquence (ex: SQ01)')
    parser.add_argument('--all', '-a', action='store_true', help='Générer toutes les séquences')
    parser.add_argument('--validation', '-v', action='store_true', help='Générer seulement SQ01, SQ02, SQ03 pour validation')
    parser.add_argument('--dry-run', '-d', action='store_true', help='Mode test (génère les scripts seulement)')
    parser.add_argument('--list', '-l', action='store_true', help='Lister les séquences disponibles')
    
    args = parser.parse_args()
    
    generator = AfterEffectsGenerator()
    
    if args.list:
        # Lister les séquences
        try:
            data = generator.load_sequence_data()
            print("🎬 Séquences disponibles :")
            for seq_id, seq_info in data.items():  # data est directement un dict de séquences
                plan_count = len(seq_info['plans']) if 'plans' in seq_info else 0
                print(f"   {seq_id} : {seq_info['name']} ({plan_count} plans)")
        except Exception as e:
            print(f"❌ Erreur : {e}")
        return
    
    if args.sequence:
        # Générer une séquence
        success = generator.generate_sequence(args.sequence, dry_run=args.dry_run)
        if success:
            print(f"✅ Génération {args.sequence} terminée")
        else:
            print(f"❌ Échec génération {args.sequence}")
    
    elif args.validation:
        # Générer les 3 premières séquences pour validation
        validation_sequences = ['SQ01', 'SQ02', 'SQ03']
        try:
            data = generator.load_sequence_data()
            success_count = 0
            available_sequences = []
            
            # Vérifier quelles séquences de validation sont disponibles
            for seq_id in validation_sequences:
                if seq_id in data:  # data est directement un dict de séquences
                    available_sequences.append(seq_id)
            
            if not available_sequences:
                print("❌ Aucune séquence de validation trouvée (SQ01, SQ02, SQ03)")
                return
                
            print(f"🧪 Mode validation - Génération de {len(available_sequences)} séquences : {', '.join(available_sequences)}")
            
            for sequence_id in available_sequences:
                print(f"\\n📁 Traitement de {sequence_id}...")
                if generator.generate_sequence(sequence_id, dry_run=args.dry_run):
                    success_count += 1
                    print(f"✅ {sequence_id} : OK")
                else:
                    print(f"❌ {sequence_id} : Échec")
            
            print(f"\\n🎉 Validation terminée : {success_count}/{len(available_sequences)} réussies")
            
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    elif args.all:
        # Générer toutes les séquences
        try:
            data = generator.load_sequence_data()
            success_count = 0
            
            for sequence_id in data.keys():  # data est directement un dict de séquences
                if generator.generate_sequence(sequence_id, dry_run=args.dry_run):
                    success_count += 1
            
            print(f"\\n🎉 Génération terminée : {success_count}/{len(data)} réussies")
            
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    else:
        print("❓ Spécifiez --sequence, --all, --validation ou --list")

if __name__ == "__main__":
    main()
