#!/usr/bin/env python3
"""
Script d'Analyse des Données Google Sheets (Updated)
Analyse RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv pour extraction séquences et plans
"""

import csv
import json
from collections import defaultdict, OrderedDict
from pathlib import Path
import sys
import os
from datetime import datetime

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

def parse_timecode_to_seconds(tc):
    """Convertit un timecode HH:MM:SS:FF en secondes."""
    if not tc or tc == '':
        return 5.0  # Durée par défaut
    
    try:
        # Format: HH:MM:SS:FF
        parts = tc.split(':')
        if len(parts) == 4:
            hours, minutes, seconds, frames = parts
            total_seconds = int(hours) * 3600 + int(minutes) * 60 + int(seconds) + int(frames) / 25.0
            return total_seconds
        return 5.0
    except:
        return 5.0

def analyze_google_sheets_data(validation_mode=False):
    """Analyse le fichier CSV Google Sheets mis à jour.
    
    Args:
        validation_mode (bool): Si True, ne traite que les 3 premières séquences (SQ01, SQ02, SQ03)
    """
    
    mode_text = " (MODE VALIDATION - 3 premières séquences)" if validation_mode else ""
    print(f"🔍 Analyse des données Google Sheets (SHOTS_TRACK.csv){mode_text}...")
    print("=" * 60)
    
    # Chemin vers le nouveau fichier CSV
    csv_path = Path(__file__).parent.parent / "data" / "RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv"
    
    if not csv_path.exists():
        print(f"❌ Fichier CSV non trouvé : {csv_path}")
        return None
        
    # Structures de données
    sequences = OrderedDict()
    plans_by_sequence = defaultdict(list)
    all_plans = []
    status_stats = defaultdict(int)
    
    print(f"📄 Lecture du fichier : {csv_path.name}")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # Données principales
                shot_num = row['SHOTS']
                sq_id = row['SQ_ID']
                sq_name = row['SQ_NAME'].strip()
                shot_name = row['SHOT_NAME'].strip()
                status = row['STATUS'].strip()
                comp_name = row['COMP_NAME'].strip()
                attribution = row['ATTRIBUTION'].strip()
                version = row['VERSION'].strip()
                
                # Timecodes et durée
                edit_dur = row['EDIT_DUR']
                edit_tc_in = row['EDIT_TC-IN']
                edit_tc_out = row['EDIT_TC-OUT']
                
                # Ignorer les lignes vides
                if not shot_num or not sq_id:
                    continue
                
                # Parser la durée
                duration_seconds = parse_timecode_to_seconds(edit_dur)
                
                # Ajouter nouvelle séquence si nécessaire
                if sq_id not in sequences:
                    sequences[sq_id] = {
                        'id': sq_id,
                        'name': sq_name,
                        'order': len(sequences) + 1
                    }
                
                # Statistiques status
                status_stats[status] += 1
                
                # Informations du plan
                plan_info = {
                    'shot_num': int(shot_num),
                    'shot_name': shot_name,
                    'sq_id': sq_id,
                    'sq_name': sq_name,
                    'status': status,
                    'comp_name': comp_name,
                    'attribution': attribution,
                    'version': version,
                    'duration_seconds': duration_seconds,
                    'duration_timecode': edit_dur,
                    'edit_tc_in': edit_tc_in,
                    'edit_tc_out': edit_tc_out,
                    'has_frame_io': bool(row['FRAME_IO_LINK']),
                    'prod_approval': row['PROD_APPROVAL'] == 'TRUE',
                    'director_approval': row['DIRECTOR_APPROVAL'] == 'TRUE',
                    'updated': row['UPDATED']
                }
                
                plans_by_sequence[sq_id].append(plan_info)
                all_plans.append(plan_info)
                
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du CSV : {e}")
        return None
    
    # Trier les plans par numéro
    for sq_id in plans_by_sequence:
        plans_by_sequence[sq_id].sort(key=lambda x: x['shot_num'])
    
    all_plans.sort(key=lambda x: x['shot_num'])
    
    return {
        'sequences': sequences,
        'plans_by_sequence': dict(plans_by_sequence),
        'all_plans': all_plans,
        'status_stats': dict(status_stats)
    }

def generate_detailed_report(data, validation_mode=False):
    """Génère un rapport détaillé des données analysées.
    
    Args:
        data: Données analysées du CSV
        validation_mode (bool): Si True, ne montre que les 3 premières séquences (SQ01, SQ02, SQ03)
    """
    
    if not data:
        return
        
    sequences = data['sequences']
    plans_by_sequence = data['plans_by_sequence']
    all_plans = data['all_plans']
    status_stats = data['status_stats']
    
    # Filtrer pour validation si demandé
    if validation_mode:
        validation_sequences = {k: v for k, v in sequences.items() if k in ['SQ01', 'SQ02', 'SQ03']}
        validation_plans_by_sequence = {k: v for k, v in plans_by_sequence.items() if k in ['SQ01', 'SQ02', 'SQ03']}
        validation_all_plans = [p for p in all_plans if p['sq_id'] in ['SQ01', 'SQ02', 'SQ03']]
        
        # Recalculer les stats de statut pour les séquences de validation
        validation_status_stats = defaultdict(int)
        for plan in validation_all_plans:
            validation_status_stats[plan['status']] += 1
        
        sequences = validation_sequences
        plans_by_sequence = validation_plans_by_sequence
        all_plans = validation_all_plans
        status_stats = dict(validation_status_stats)
    
    mode_text = " (MODE VALIDATION - 3 premières séquences)" if validation_mode else ""
    print(f"\\n📊 RAPPORT D'ANALYSE GOOGLE SHEETS{mode_text}")
    print("=" * 60)
    
    # Statistiques générales
    print(f"📈 **Statistiques Générales**")
    print(f"   • Total séquences : {len(sequences)}")
    print(f"   • Total plans : {len(all_plans)}")
    print(f"   • Plans min : {min(p['shot_num'] for p in all_plans)}")
    print(f"   • Plans max : {max(p['shot_num'] for p in all_plans)}")
    
    # Statistiques par statut
    print(f"\\n🎬 **Statuts des Plans**")
    for status, count in status_stats.items():
        percentage = (count / len(all_plans)) * 100
        print(f"   {status or 'VIDE'} : {count} plans ({percentage:.1f}%)")
    
    # Durée totale
    total_duration = sum(p['duration_seconds'] for p in all_plans)
    total_minutes = total_duration / 60
    print(f"\\n⏱️  **Durée Totale** : {total_minutes:.1f} minutes ({total_duration:.1f}s)")
    
    # Mapping séquences
    print(f"\\n🎬 **Mapping Séquences**")
    for sq_id, seq_info in sequences.items():
        plans = plans_by_sequence[sq_id]
        seq_duration = sum(p['duration_seconds'] for p in plans)
        plans_range = [p['shot_num'] for p in plans]
        min_plan = min(plans_range)
        max_plan = max(plans_range)
        
        print(f"   {sq_id} : {seq_info['name']}")
        print(f"      └─ {len(plans)} plans (#{min_plan} à #{max_plan}) - {seq_duration/60:.1f}min")
    
    # Détail par séquence avec statuts
    print(f"\\n📋 **Détail par Séquence**")
    for sq_id, seq_info in sequences.items():
        plans = plans_by_sequence[sq_id]
        seq_duration = sum(p['duration_seconds'] for p in plans)
        
        # Statistiques statuts pour cette séquence
        seq_status = defaultdict(int)
        for plan in plans:
            seq_status[plan['status']] += 1
        
        print(f"\\n🎯 {sq_id} - {seq_info['name']}")
        print(f"   Plans : {len(plans)} | Durée : {seq_duration/60:.1f}min")
        print(f"   Statuts : {dict(seq_status)}")
        
        # Afficher premiers et derniers plans
        if len(plans) <= 10:
            for plan in plans:
                status_icon = "✅" if plan['status'] == "PROCESSED" else "📝" if plan['status'] == "" else "🔄"
                print(f"      {status_icon} Plan {plan['shot_num']:03d} → {plan['shot_name']} ({plan['status'] or 'PENDING'})")
        else:
            # Afficher les 5 premiers
            for plan in plans[:5]:
                status_icon = "✅" if plan['status'] == "PROCESSED" else "📝" if plan['status'] == "" else "🔄"
                print(f"      {status_icon} Plan {plan['shot_num']:03d} → {plan['shot_name']} ({plan['status'] or 'PENDING'})")
            print(f"      ... ({len(plans) - 10} plans intermédiaires)")
            # Afficher les 5 derniers
            for plan in plans[-5:]:
                status_icon = "✅" if plan['status'] == "PROCESSED" else "📝" if plan['status'] == "" else "🔄"
                print(f"      {status_icon} Plan {plan['shot_num']:03d} → {plan['shot_name']} ({plan['status'] or 'PENDING'})")

def generate_after_effects_config(data, validation_mode=False):
    """Génère un fichier JSON de configuration pour After Effects.
    
    Args:
        data: Données analysées du CSV
        validation_mode (bool): Si True, ne génère que pour les 3 premières séquences
    """
    
    if not data:
        return
        
    sequences = data['sequences']
    plans_by_sequence = data['plans_by_sequence']
    all_plans = data['all_plans']
    
    # Filtrer pour validation si demandé
    if validation_mode:
        sequences = {k: v for k, v in sequences.items() if k in ['SQ01', 'SQ02', 'SQ03']}
        plans_by_sequence = {k: v for k, v in plans_by_sequence.items() if k in ['SQ01', 'SQ02', 'SQ03']}
        all_plans = [p for p in all_plans if p['sq_id'] in ['SQ01', 'SQ02', 'SQ03']]
        print("📌 Mode validation - Configuration limitée aux séquences SQ01, SQ02, SQ03")
        
    config = {
        'metadata': {
            'source': 'RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv',
            'validation_mode': validation_mode,
            'total_sequences': len(sequences),
            'total_plans': len(all_plans),
            'generated_at': datetime.now().isoformat(),
            'status_distribution': data['status_stats'],
            'total_duration_seconds': sum(p['duration_seconds'] for p in all_plans),
            'total_duration_minutes': sum(p['duration_seconds'] for p in all_plans) / 60
        },
        'sequences': {},
        'plans': {}
    }
    
    # Configuration des séquences
    for sq_id, seq_info in sequences.items():
        plans = plans_by_sequence[sq_id]
        config['sequences'][sq_id] = {
            'name': seq_info['name'],
            'order': seq_info['order'],
            'plan_count': len(plans),
            'duration_seconds': sum(p['duration_seconds'] for p in plans),
            'duration_minutes': sum(p['duration_seconds'] for p in plans) / 60,
            'plan_range': {
                'min': min(p['shot_num'] for p in plans),
                'max': max(p['shot_num'] for p in plans)
            },
            'plans': [p['shot_num'] for p in plans],
            'status_distribution': {
                status: len([p for p in plans if p['status'] == status])
                for status in set(p['status'] for p in plans)
            }
        }
    
    # Configuration des plans
    for plan in all_plans:
        config['plans'][plan['shot_name']] = {
            'shot_num': plan['shot_num'],
            'sq_id': plan['sq_id'],
            'sq_name': plan['sq_name'],
            'shot_name': plan['shot_name'],
            'status': plan['status'],
            'comp_name': plan['comp_name'],
            'attribution': plan['attribution'],
            'version': plan['version'],
            'duration_seconds': plan['duration_seconds'],
            'duration_timecode': plan['duration_timecode'],
            'edit_tc_in': plan['edit_tc_in'],
            'edit_tc_out': plan['edit_tc_out'],
            'has_frame_io': plan['has_frame_io'],
            'prod_approval': plan['prod_approval'],
            'director_approval': plan['director_approval']
        }
    
    # Sauvegarder le fichier JSON
    config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
    config_path.parent.mkdir(exist_ok=True)
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"\\n💾 Configuration AE sauvegardée : {config_path}")
    return config_path

def generate_production_preview(data):
    """Génère un aperçu pour la production After Effects."""
    
    if not data:
        return
        
    print(f"\\n🏗️ **APERÇU PRODUCTION AFTER EFFECTS**")
    print("=" * 60)
    
    sequences = data['sequences']
    plans_by_sequence = data['plans_by_sequence']
    
    total_ae_projects = len(sequences)
    total_precomps = len(data['all_plans'])
    total_duration = sum(p['duration_seconds'] for p in data['all_plans'])
    
    print("📁 Projets After Effects qui seront générés :")
    print("SEQUENCES/")
    
    for sq_id, seq_info in sequences.items():
        plans = plans_by_sequence[sq_id]
        seq_duration = sum(p['duration_seconds'] for p in plans)
        processed_count = len([p for p in plans if p['status'] == 'PROCESSED'])
        
        print(f"├── {sq_id}/")
        print(f"│   ├── _AE/")
        print(f"│   │   └── {sq_id}_01.aep")
        print(f"│   │       ├── 🎬 {sq_id}_UNDLM_v001 ({seq_duration/60:.1f}min)")
        print(f"│   │       ├── 📂 FROM_EDIT/ ({len(plans)} plans)")
        print(f"│   │       ├── 📂 FROM_GRADING/ (détection auto)")
        print(f"│   │       └── 📦 Precomps/ ({len(plans)} précomps)")
        print(f"│   │           └── Plans {processed_count}/{len(plans)} traités")
        print(f"│   └── _EB/ ({len(plans)} dossiers plans)")
    
    print(f"\\n📊 **Résumé Production**")
    print(f"   • Projets AE à créer : {total_ae_projects}")
    print(f"   • Précompositions : {total_precomps}")
    print(f"   • Durée totale : {total_duration/60:.1f} minutes")
    print(f"   • Plans traités : {data['status_stats'].get('PROCESSED', 0)}/{len(data['all_plans'])}")
    
    # Estimation ressources
    avg_project_size_mb = 50  # Estimation taille projet AE
    estimated_storage_gb = (total_ae_projects * avg_project_size_mb) / 1024
    
    print(f"\\n💾 **Estimation Ressources**")
    print(f"   • Stockage projets AE : ~{estimated_storage_gb:.1f} GB")
    print(f"   • Temps génération estimé : ~{total_ae_projects * 2} minutes")

def main():
    """Fonction principale."""
    
    import argparse
    
    parser = argparse.ArgumentParser(description="Analyse des données Google Sheets pour After Effects")
    parser.add_argument('--validation', action='store_true', 
                        help='Mode validation : traite uniquement les 3 premières séquences (SQ01, SQ02, SQ03)')
    
    args = parser.parse_args()
    
    mode_text = " - MODE VALIDATION" if args.validation else ""
    print(f"🎬 ANALYSE GOOGLE SHEETS - AFTER EFFECTS SETUP{mode_text}")
    print("=" * 60)
    
    if args.validation:
        print("📌 Mode validation activé - Traitement limité aux séquences SQ01, SQ02, SQ03")
        print()
    
    # Analyser les données
    data = analyze_google_sheets_data(args.validation)
    
    if not data:
        print("❌ Échec de l'analyse des données")
        return
    
    # Générer les rapports
    generate_detailed_report(data, args.validation)
    config_path = generate_after_effects_config(data, args.validation)
    
    # Créer les données filtrées pour l'aperçu production si en mode validation
    if args.validation:
        # Filtrer les données pour l'aperçu production
        filtered_data = {
            'sequences': {k: v for k, v in data['sequences'].items() if k in ['SQ01', 'SQ02', 'SQ03']},
            'plans_by_sequence': {k: v for k, v in data['plans_by_sequence'].items() if k in ['SQ01', 'SQ02', 'SQ03']},
            'all_plans': [p for p in data['all_plans'] if p['sq_id'] in ['SQ01', 'SQ02', 'SQ03']],
            'status_stats': data['status_stats']  # Garder les stats complètes pour référence
        }
        # Recalculer les stats pour les plans filtrés
        validation_status_stats = defaultdict(int)
        for plan in filtered_data['all_plans']:
            validation_status_stats[plan['status']] += 1
        filtered_data['status_stats'] = dict(validation_status_stats)
        
        generate_production_preview(filtered_data)
    else:
        generate_production_preview(data)
    
    print(f"\\n✅ **ANALYSE TERMINÉE**")
    print(f"   📄 Configuration : {config_path}")
    print(f"   🎯 Prêt pour génération After Effects")
    
    # Suggestions pour la suite
    print(f"\\n🚀 **PROCHAINES ÉTAPES**")
    print(f"   1. Valider le mapping des séquences")
    print(f"   2. Mettre à jour le générateur AE")
    print(f"   3. Tester sur {list(data['sequences'].keys())[0]}")
    print(f"   4. Déployer toutes les séquences")

if __name__ == "__main__":
    main()
