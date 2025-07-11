#!/usr/bin/env python3
"""
Import des Sources Étalonnées v2 pour RL PostFlow
Met à jour les projets After Effects existants avec les plans étalonnés
Insère les layers GRADED dans la hiérarchie correcte des compositions
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

class GradedSourcesImporter:
    """Importateur de sources étalonnées pour projets After Effects existants."""
    
    def __init__(self):
        self.from_grading_path = Path("/Volumes/resizelab/o2b-undllm/2_IN/_FROM_GRADING/BY_SHOTS")
        self.sequences_path = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
        self.config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
        
    def load_sequence_data(self) -> Dict:
        """Charge les données de mapping des séquences depuis Google Sheets JSON."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration non trouvée : {self.config_path}")
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            gsheets_data = json.load(f)
        
        # Adapter le format Google Sheets vers le format attendu par l'importateur
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
    
    def check_available_graded_plans(self, plans: List[Dict]) -> List[int]:
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
                print(f"✅ Plan étalonné disponible : UNDLM_{plan_num:05d}")
            else:
                print(f"📝 Plan étalonné non disponible : UNDLM_{plan_num:05d}")
        
        return available_graded
    
    def check_existing_ae_project(self, sequence_id: str) -> bool:
        """Vérifie si le projet AE existe déjà pour cette séquence."""
        ae_project_path = self.sequences_path / sequence_id / "_AE" / f"{sequence_id}_01.aep"
        return ae_project_path.exists()
    
    def generate_graded_import_script(self, sequence_id: str, plans: List[Dict], available_graded: List[int]) -> str:
        """Génère le script JSX pour importer les sources étalonnées dans un projet existant."""
        
        if not available_graded:
            return None
            
        output_path = self.sequences_path / sequence_id / "_AE"
        
        script = f"""
// ==========================================
// RL PostFlow v4.1.2 - Import Sources Étalonnées
// Séquence {sequence_id} - {len(available_graded)} plans étalonnés disponibles
// Compatible avec structure After Effects v2
// ==========================================

// Ouvrir le projet existant
var projectFile = new File("{output_path}/{sequence_id}_01.aep");
if (!projectFile.exists) {{
    alert("❌ Projet AE non trouvé : {sequence_id}_01.aep\\n\\nVeuillez d'abord générer le projet avec generate_ae_projects_v2.py");
    $.writeln("GRADED_IMPORT_ERROR:PROJECT_NOT_FOUND:{sequence_id}");
}} else {{
    app.open(projectFile);
    var project = app.project;
    
    // Vérifier la structure des dossiers
    var fromGradingFolder = null;
    var masterCompsShotsFolder = null;
    
    for (var i = 1; i <= project.items.length; i++) {{
        var item = project.items[i];
        if (item instanceof FolderItem) {{
            if (item.name === "FROM_GRADING") {{
                fromGradingFolder = item;
            }}
            if (item.name === "MASTER_COMPS_SHOTS") {{
                masterCompsShotsFolder = item;
            }}
        }}
    }}
    
    if (!fromGradingFolder || !masterCompsShotsFolder) {{
        alert("❌ Structure AE incompatible\\n\\nDossiers manquants : FROM_GRADING ou MASTER_COMPS_SHOTS");
        $.writeln("GRADED_IMPORT_ERROR:INVALID_STRUCTURE:{sequence_id}");
    }} else {{
        
        // ==========================================
        // 1. IMPORT DES SOURCES ÉTALONNÉES
        // ==========================================
        
        var gradingSources = {{}};
        var importedCount = 0;
        
"""
        
        # Import des plans GRADED
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
            importedCount++;
            $.writeln("GRADED_IMPORTED:UNDLM_{plan_num:05d}");
        }} else {{
            $.writeln("GRADED_MISSING:UNDLM_{plan_num:05d}");
        }}"""
                script += import_script
        
        script += f"""
        
        // ==========================================
        // 2. AJOUT DANS LES COMPOSITIONS EXISTANTES
        // ==========================================
        
        var updatedComps = 0;
        
        // Parcourir toutes les compositions de plans dans MASTER_COMPS_SHOTS
        for (var i = 1; i <= masterCompsShotsFolder.numItems; i++) {{
            var compItem = masterCompsShotsFolder.item(i);
            
            if (compItem instanceof CompItem) {{
                var compName = compItem.name;
                
                // Extraire le numéro de plan depuis le nom de composition
                // Format: {sequence_id}_UNDLM_XXXXX_v001
                var planMatch = compName.match(/{sequence_id}_UNDLM_(\\d{{5}})_v\\d{{3}}/);
                
                if (planMatch) {{
                    var planNum = parseInt(planMatch[1]);
                    
                    // Vérifier si on a une source étalonnée pour ce plan
                    if (gradingSources[planNum]) {{
                        
                        // Vérifier si le layer graded existe déjà
                        var gradedLayerExists = false;
                        for (var j = 1; j <= compItem.numLayers; j++) {{
                            if (compItem.layer(j).name.indexOf("_graded") !== -1) {{
                                gradedLayerExists = true;
                                break;
                            }}
                        }}
                        
                        if (!gradedLayerExists) {{
                            // Ajouter le layer GRADED
                            var gradedLayer = compItem.layers.add(gradingSources[planNum]);
                            gradedLayer.name = "UNDLM_" + planMatch[1] + "_graded";
                            
                            // Mise à l'échelle UHD (3840x2160) vers 1440p (2560x1440)
                            gradedLayer.property("Transform").property("Scale").setValue([66.67, 66.67]);
                            gradedLayer.property("Transform").property("Position").setValue([1280, 720]);
                            
                            // Positionner correctement dans la hiérarchie :
                            // 1. Layer GRADED (nouveau)
                            // 2. Layer EDIT (existant, à désactiver)
                            // 3. BG_SOLID (en bas)
                            
                            // Trouver et désactiver le layer EDIT
                            for (var k = 1; k <= compItem.numLayers; k++) {{
                                var layer = compItem.layer(k);
                                if (layer.name.indexOf("_edit") !== -1) {{
                                    layer.enabled = false;
                                    $.writeln("EDIT_LAYER_DISABLED:" + layer.name);
                                    break;
                                }}
                            }}
                            
                            // Positionner le layer GRADED au bon endroit
                            // Le placer au-dessus du layer EDIT mais en-dessous des autres éléments
                            var targetIndex = 1;
                            for (var l = 1; l <= compItem.numLayers; l++) {{
                                var layer = compItem.layer(l);
                                if (layer.name.indexOf("_edit") !== -1 || layer.name === "BG_SOLID") {{
                                    targetIndex = l;
                                    break;
                                }}
                            }}
                            
                            gradedLayer.moveAfter(compItem.layer(targetIndex));
                            
                            updatedComps++;
                            $.writeln("GRADED_ADDED_TO_COMP:" + compName);
                        }} else {{
                            $.writeln("GRADED_ALREADY_EXISTS:" + compName);
                        }}
                    }}
                }}
            }}
        }}
        
        // ==========================================
        // 3. SAUVEGARDE ET FINALISATION
        // ==========================================
        
        // Sauvegarder le projet
        project.save();
        
        // Statistiques finales
        var totalGraded = {len(available_graded)};
        var totalPlans = {len(plans)};
        
        alert("🎨 Sources étalonnées importées avec succès!\\n\\n" + 
              "📊 Statistiques:\\n" +
              "• Plans étalonnés disponibles: " + totalGraded + "\\n" + 
              "• Plans importés: " + importedCount + "\\n" +
              "• Compositions mises à jour: " + updatedComps + "\\n" +
              "• Total plans séquence: " + totalPlans + "\\n\\n" +
              "✅ Hiérarchie des layers:\\n" +
              "   1. UNDLM_XXXXX_graded (actif)\\n" +
              "   2. UNDLM_XXXXX_edit (désactivé)\\n" +
              "   3. BG_SOLID (fond)\\n\\n" +
              "💾 Projet sauvegardé automatiquement");

        // Log pour Python
        $.writeln("GRADED_IMPORT_SUCCESS:{sequence_id}:" + importedCount + ":" + updatedComps);
    }}
}}
"""
        
        return script
    
    def import_graded_for_sequence(self, sequence_id: str, dry_run: bool = False) -> bool:
        """Importe les sources étalonnées pour une séquence donnée."""
        try:
            sequence_data = self.load_sequence_data()
            
            if sequence_id not in sequence_data:
                print(f"❌ Séquence {sequence_id} non trouvée dans le mapping")
                return False
            
            # Vérifier que le projet AE existe
            if not self.check_existing_ae_project(sequence_id):
                print(f"❌ Projet AE non trouvé pour {sequence_id}")
                print(f"   Veuillez d'abord générer le projet avec :")
                print(f"   python scripts/generate_ae_projects_v2.py --sequence {sequence_id}")
                return False
            
            seq_info = sequence_data[sequence_id]
            plans = seq_info['plans']
            
            print(f"\n🎨 Import sources étalonnées pour {sequence_id}")
            print(f"   📝 {len(plans)} plans à vérifier")
            
            # Vérifier disponibilité des plans étalonnés
            available_graded = self.check_available_graded_plans(plans)
            
            if not available_graded:
                print(f"⚠️  Aucun plan étalonné disponible pour {sequence_id}")
                return False
            
            print(f"✅ {len(available_graded)} plans étalonnés trouvés")
            
            # Générer le script JSX d'import
            import_script = self.generate_graded_import_script(sequence_id, plans, available_graded)
            
            if not import_script:
                print(f"❌ Impossible de générer le script d'import")
                return False
            
            # Créer le dossier de sortie
            output_dir = self.sequences_path / sequence_id / "_AE"
            
            # Sauvegarder le script d'import
            script_file = output_dir / f"{sequence_id}_import_graded_v2.jsx"
            
            if not dry_run:
                with open(script_file, 'w', encoding='utf-8') as f:
                    f.write(import_script)
                print(f"✅ Script d'import généré : {script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait généré : {script_file}")
            
            # Copier également dans le dossier ae_scripts local
            local_script_dir = Path(__file__).parent.parent / "ae_scripts"
            local_script_file = local_script_dir / f"RL_PostFlow_{sequence_id}_IMPORT_GRADED_V2.jsx"
            
            if not dry_run:
                local_script_dir.mkdir(exist_ok=True)
                with open(local_script_file, 'w', encoding='utf-8') as f:
                    f.write(import_script)
                print(f"✅ Script copié localement : {local_script_file}")
            else:
                print(f"📝 [DRY-RUN] Script serait copié : {local_script_file}")
            
            print(f"\n🎯 Instructions :")
            print(f"   1. Ouvrir After Effects")
            print(f"   2. Exécuter le script : {script_file.name}")
            print(f"   3. Le script ouvrira automatiquement {sequence_id}_01.aep")
            print(f"   4. Import et positionnement automatiques des {len(available_graded)} plans étalonnés")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de l'import : {e}")
            return False
    
    def import_graded_for_multiple_sequences(self, sequence_ids: List[str], dry_run: bool = False) -> bool:
        """Importe les sources étalonnées pour plusieurs séquences."""
        success_count = 0
        
        for i, seq_id in enumerate(sequence_ids, 1):
            print(f"\n📍 [{i}/{len(sequence_ids)}] Import {seq_id}")
            if self.import_graded_for_sequence(seq_id, dry_run):
                success_count += 1
            else:
                print(f"❌ Échec pour {seq_id}")
        
        print(f"\n📊 Import terminé : {success_count}/{len(sequence_ids)} séquences")
        return success_count == len(sequence_ids)
    
    def import_graded_for_all_sequences(self, dry_run: bool = False) -> bool:
        """Importe les sources étalonnées pour toutes les séquences disponibles."""
        try:
            sequence_data = self.load_sequence_data()
            sequences = list(sequence_data.keys())
            sequences.sort()  # Trier par ordre alphabétique
            
            print(f"🎨 Import sources étalonnées pour toutes les séquences ({len(sequences)} au total)")
            
            return self.import_graded_for_multiple_sequences(sequences, dry_run)
            
        except Exception as e:
            print(f"❌ Erreur import massif : {e}")
            return False
    
    def scan_available_graded_sources(self) -> Dict:
        """Scanne tous les plans étalonnés disponibles."""
        print(f"🔍 Scan des sources étalonnées dans {self.from_grading_path}")
        
        if not self.from_grading_path.exists():
            print(f"❌ Dossier grading non trouvé : {self.from_grading_path}")
            return {}
        
        available_files = {}
        pattern = "UNDLM_*.mov"
        
        for file_path in self.from_grading_path.glob(pattern):
            if file_path.is_file():
                # Extraire le numéro de plan
                plan_num = int(file_path.stem.split('_')[1])
                file_size = file_path.stat().st_size / (1024 * 1024)  # MB
                
                available_files[plan_num] = {
                    'path': str(file_path),
                    'size_mb': round(file_size, 1),
                    'name': file_path.name
                }
        
        print(f"✅ {len(available_files)} plans étalonnés trouvés")
        
        if available_files:
            total_size = sum(info['size_mb'] for info in available_files.values())
            min_plan = min(available_files.keys())
            max_plan = max(available_files.keys())
            
            print(f"📊 Statistiques :")
            print(f"   • Plans : {min_plan} à {max_plan}")
            print(f"   • Taille totale : {total_size:.1f} MB")
            print(f"   • Taille moyenne : {total_size/len(available_files):.1f} MB/plan")
        
        return available_files

def main():
    """Point d'entrée principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Import des sources étalonnées v2 pour RL PostFlow')
    parser.add_argument('--sequence', '-s', help='Séquence à traiter (ex: SQ01)')
    parser.add_argument('--sequences', '-m', nargs='+', help='Plusieurs séquences à traiter (ex: SQ01 SQ05 SQ21)')
    parser.add_argument('--all', '-a', action='store_true', help='Traiter toutes les séquences disponibles')
    parser.add_argument('--scan', action='store_true', help='Scanner les sources étalonnées disponibles')
    parser.add_argument('--dry-run', '-d', action='store_true', help='Mode simulation (pas d\'import réel)')
    
    args = parser.parse_args()
    
    importer = GradedSourcesImporter()
    
    if args.scan:
        print("🔍 Scan des sources étalonnées disponibles")
        available = importer.scan_available_graded_sources()
        
        if available:
            print(f"\n📝 Plans étalonnés disponibles :")
            for plan_num in sorted(available.keys()):
                info = available[plan_num]
                print(f"   ✅ UNDLM_{plan_num:05d} ({info['size_mb']} MB)")
        
        sys.exit(0)
    
    if args.all:
        print("🎨 Import pour toutes les séquences")
        success = importer.import_graded_for_all_sequences(args.dry_run)
        sys.exit(0 if success else 1)
    elif args.sequences:
        print(f"🎨 Import pour {len(args.sequences)} séquences")
        success = importer.import_graded_for_multiple_sequences(args.sequences, args.dry_run)
        sys.exit(0 if success else 1)
    elif args.sequence:
        success = importer.import_graded_for_sequence(args.sequence, args.dry_run)
        sys.exit(0 if success else 1)
    else:
        print("❌ Spécifiez --sequence, --sequences, --all ou --scan")
        print("   --scan : scanner les sources étalonnées disponibles")
        print("   --sequence SQ01 : importer pour une séquence spécifique")
        print("   --sequences SQ01 SQ05 SQ21 : importer pour plusieurs séquences")
        print("   --all : importer pour toutes les séquences")
        print("   --dry-run : mode simulation")
        sys.exit(1)

if __name__ == "__main__":
    main()
