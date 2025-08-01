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
    sequences = OrderedDict()
    plans_by_sequence = defaultdict(list)
    all_plans = []
    status_stats = defaultdict(int)
    priority_counter = defaultdict(int)
    priority_anomalies = []
    csv_path = Path(__file__).parent.parent / "data" / "RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv"

    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            if not lines:
                print(f"❌ Fichier CSV vide : {csv_path}")
                return None
            header = [h.strip() for h in lines[0].split(',')]
            for idx, line in enumerate(lines[1:], start=2):
                fields = [f.strip() for f in line.strip().split(',')]
                row = {header[i]: fields[i] if i < len(fields) else '' for i in range(len(header))}

                priority_val = row.get('PRIORITY', '').strip()
                priority_counter[priority_val] += 1
                # Detect anomalies: empty, weird chars, too long, etc.
                if priority_val == '' or len(priority_val) > 10 or not priority_val.isalnum():
                    priority_anomalies.append((idx, priority_val, row.get('SHOT_NAME', '')))

                # ...existing code...
                shot_num = row.get('SHOTS', '')
                sq_id = row.get('SQ_ID', '')
                sq_name = row.get('SQ_NAME', '').strip()
                shot_name = row.get('SHOT_NAME', '').strip()
                status = row.get('STATUS', '').strip()
                comp_name = row.get('COMP_NAME', '').strip()
                attribution = row.get('ATTRIBUTION', '').strip()
                version = row.get('VERSION', '').strip()
                edit_dur = row.get('EDIT_DUR', '')
                edit_tc_in = row.get('EDIT_TC-IN', '')
                edit_tc_out = row.get('EDIT_TC-OUT', '')

                duration_seconds = parse_timecode_to_seconds(edit_dur)

                if sq_id not in sequences:
                    sequences[sq_id] = {
                        'id': sq_id,
                        'name': sq_name,
                        'order': len(sequences) + 1
                    }

                status_stats[status] += 1

                try:
                    shot_num_val = int(shot_num)
                except (ValueError, TypeError):
                    shot_num_val = None
                plan_info = {
                    'shot_num': shot_num_val,
                    'shot_name': shot_name,
                    'sq_id': sq_id if sq_id else None,
                    'sq_name': sq_name,
                    'status': status,
                    'comp_name': comp_name,
                    'attribution': attribution,
                    'version': version,
                    'duration_seconds': duration_seconds,
                    'duration_timecode': edit_dur,
                    'edit_tc_in': edit_tc_in,
                    'edit_tc_out': edit_tc_out,
                    'has_frame_io': bool(row.get('FRAME_IO_LINK', '')),
                    'prod_approval': row.get('PROD_APPROVAL', '') == 'TRUE',
                    'director_approval': row.get('DIRECTOR_APPROVAL', '') == 'TRUE',
                    'updated': row.get('UPDATED', ''),
                    'PRIORITY': priority_val
                }
                plans_by_sequence[sq_id if sq_id else '_NOSEQ'].append(plan_info)
                all_plans.append(plan_info)

            # Trier les plans par numéro, les plans sans numéro vont à la fin
            for sq_id in plans_by_sequence:
                plans_by_sequence[sq_id].sort(key=lambda x: x['shot_num'] if x['shot_num'] is not None else float('inf'))
            all_plans.sort(key=lambda x: x['shot_num'] if x['shot_num'] is not None else float('inf'))

            print("\n🕵️ DIAGNOSTIC PRIORITY:")
            for val, count in sorted(priority_counter.items(), key=lambda x: (-x[1], x[0])):
                print(f"   '{val}': {count} occurences")
            if priority_anomalies:
                print(f"\n⚠️ Anomalies détectées dans PRIORITY (lignes, valeur, shot_name):")
                for idx, val, shot_name in priority_anomalies[:10]:
                    print(f"   Ligne {idx}: PRIORITY='{val}' | SHOT_NAME='{shot_name}'")
                if len(priority_anomalies) > 10:
                    print(f"   ... {len(priority_anomalies)-10} autres anomalies ...")

            # DEBUG: Afficher toutes les lignes où 'P02' apparaît dans PRIORITY
            print("\n🔬 Lignes où 'P02' apparaît dans PRIORITY (toutes variantes):")
            p02_lines = []
            for idx, plan in enumerate(all_plans, start=2):
                prio_raw = str(plan.get('PRIORITY', ''))
                if 'P02' in prio_raw or 'p02' in prio_raw:
                    p02_lines.append((idx, prio_raw, plan.get('SHOT_NAME', '')))
            print(f"  Total détecté par script: {len(p02_lines)}")
            for l in p02_lines[:10]:
                print(f"   Ligne {l[0]}: PRIORITY='{l[1]}' | SHOT_NAME='{l[2]}'")
            if len(p02_lines) > 10:
                print(f"   ... {len(p02_lines)-10} autres lignes ...")

            # Export complet des lignes brutes du CSV où 'P02' apparaît dans PRIORITY
            export_full_p02_path = Path(__file__).parent.parent / "data" / "full_p02_lines.csv"
            with open(export_full_p02_path, 'w', encoding='utf-8') as f:
                # Écrire l'en-tête
                header = [h for h in all_plans[0].keys()] if all_plans else []
                f.write(','.join(header) + '\n')
                for plan in all_plans:
                    prio_raw = str(plan.get('PRIORITY', ''))
                    if 'P02' in prio_raw or 'p02' in prio_raw:
                        row = [str(plan.get(h, '')) for h in header]
                        f.write(','.join(row) + '\n')
            print(f"📄 Export complet des lignes 'P02' du CSV : {export_full_p02_path}")

            # Export all detected P02 lines to a file for full visibility
            export_path = Path(__file__).parent.parent / "data" / "missing_p02_plans.txt"
            with open(export_path, 'w', encoding='utf-8') as f:
                f.write(f"Total détecté par script: {len(p02_lines)}\n")
                for l in p02_lines:
                    f.write(f"Ligne {l[0]}: PRIORITY='{l[1]}' | SHOT_NAME='{l[2]}'\n")
            print(f"\n📄 Liste complète des plans 'P02' exportée : {export_path}")

            return {
                'sequences': sequences,
                'plans_by_sequence': dict(plans_by_sequence),
                'all_plans': all_plans,
                'status_stats': dict(status_stats)
            }
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du CSV : {e}")
        return None
    """Analyse le fichier CSV Google Sheets mis à jour.
    
    Args:
        validation_mode (bool): Si True, ne traite que les 3 premières séquences (SQ01, SQ02, SQ03)
    """
    
    mode_text = " (MODE VALIDATION - 3 premières séquences)" if validation_mode else ""
    print(f"🔍 Analyse des données Google Sheets (SHOTS_TRACK.csv){mode_text}...")
    print("=" * 60)
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            if not lines:
                print(f"❌ Fichier CSV vide : {csv_path}")
                return None
            header = [h.strip() for h in lines[0].split(',')]
            for idx, line in enumerate(lines[1:], start=2):
                fields = [f.strip() for f in line.strip().split(',')]
                row = {header[i]: fields[i] if i < len(fields) else '' for i in range(len(header))}

                priority_val = row.get('PRIORITY', '').strip()
                priority_counter[priority_val] += 1
                # Detect anomalies: empty, weird chars, too long, etc.
                if priority_val == '' or len(priority_val) > 10 or not priority_val.isalnum():
                    priority_anomalies.append((idx, priority_val, row.get('SHOT_NAME', '')))

                # ...existing code...
                shot_num = row.get('SHOTS', '')
                sq_id = row.get('SQ_ID', '')
                sq_name = row.get('SQ_NAME', '').strip()
                shot_name = row.get('SHOT_NAME', '').strip()
                status = row.get('STATUS', '').strip()
                comp_name = row.get('COMP_NAME', '').strip()
                attribution = row.get('ATTRIBUTION', '').strip()
                version = row.get('VERSION', '').strip()
                edit_dur = row.get('EDIT_DUR', '')
                edit_tc_in = row.get('EDIT_TC-IN', '')
                edit_tc_out = row.get('EDIT_TC-OUT', '')

                duration_seconds = parse_timecode_to_seconds(edit_dur)

                if sq_id not in sequences:
                    sequences[sq_id] = {
                        'id': sq_id,
                        'name': sq_name,
                        'order': len(sequences) + 1
                    }

                status_stats[status] += 1

                try:
                    shot_num_val = int(shot_num)
                except (ValueError, TypeError):
                    shot_num_val = None
                plan_info = {
                    'shot_num': shot_num_val,
                    'shot_name': shot_name,
                    'sq_id': sq_id if sq_id else None,
                    'sq_name': sq_name,
                    'status': status,
                    'comp_name': comp_name,
                    'attribution': attribution,
                    'version': version,
                    'duration_seconds': duration_seconds,
                    'duration_timecode': edit_dur,
                    'edit_tc_in': edit_tc_in,
                    'edit_tc_out': edit_tc_out,
                    'has_frame_io': bool(row.get('FRAME_IO_LINK', '')),
                    'prod_approval': row.get('PROD_APPROVAL', '') == 'TRUE',
                    'director_approval': row.get('DIRECTOR_APPROVAL', '') == 'TRUE',
                    'updated': row.get('UPDATED', ''),
                    'PRIORITY': priority_val
                }
                plans_by_sequence[sq_id if sq_id else '_NOSEQ'].append(plan_info)
                all_plans.append(plan_info)

            # Trier les plans par numéro, les plans sans numéro vont à la fin
            for sq_id in plans_by_sequence:
                plans_by_sequence[sq_id].sort(key=lambda x: x['shot_num'] if x['shot_num'] is not None else float('inf'))
            all_plans.sort(key=lambda x: x['shot_num'] if x['shot_num'] is not None else float('inf'))

            print("\n🕵️ DIAGNOSTIC PRIORITY:")
            for val, count in sorted(priority_counter.items(), key=lambda x: (-x[1], x[0])):
                print(f"   '{val}': {count} occurences")
            if priority_anomalies:
                print(f"\n⚠️ Anomalies détectées dans PRIORITY (lignes, valeur, shot_name):")
                for idx, val, shot_name in priority_anomalies[:10]:
                    print(f"   Ligne {idx}: PRIORITY='{val}' | SHOT_NAME='{shot_name}'")
                if len(priority_anomalies) > 10:
                    print(f"   ... {len(priority_anomalies)-10} autres anomalies ...")

            # DEBUG: Afficher toutes les lignes où 'P02' apparaît dans PRIORITY
            print("\n🔬 Lignes où 'P02' apparaît dans PRIORITY (toutes variantes):")
            p02_lines = []
            for idx, plan in enumerate(all_plans, start=2):
                prio_raw = str(plan.get('PRIORITY', ''))
                if 'P02' in prio_raw or 'p02' in prio_raw:
                    p02_lines.append((idx, prio_raw, plan.get('SHOT_NAME', '')))
            print(f"  Total détecté par script: {len(p02_lines)}")
            for l in p02_lines[:10]:
                print(f"   Ligne {l[0]}: PRIORITY='{l[1]}' | SHOT_NAME='{l[2]}'")
            if len(p02_lines) > 10:
                print(f"   ... {len(p02_lines)-10} autres lignes ...")

            return {
                'sequences': sequences,
                'plans_by_sequence': dict(plans_by_sequence),
                'all_plans': all_plans,
                'status_stats': dict(status_stats)
            }
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du CSV : {e}")
        return None
    
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
    if all_plans:
        print(f"   • Plans min : {min(p['shot_num'] for p in all_plans)}")
        print(f"   • Plans max : {max(p['shot_num'] for p in all_plans)}")
    else:
        print(f"   • Aucun plan trouvé pour cette priorité.")
    
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
    print(f"\n🎬 **Mapping Séquences**")
    for sq_id, seq_info in sequences.items():
        plans = plans_by_sequence[sq_id]
        seq_duration = sum(p['duration_seconds'] for p in plans)
        plans_range = [p['shot_num'] for p in plans]
        if plans_range:
            min_plan = min(plans_range)
            max_plan = max(plans_range)
            print(f"   {sq_id} : {seq_info['name']}")
            print(f"      └─ {len(plans)} plans (#{min_plan} à #{max_plan}) - {seq_duration/60:.1f}min")
        else:
            print(f"   {sq_id} : {seq_info['name']}")
            print(f"      └─ Aucun plan pour cette séquence.")
    
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

def generate_after_effects_config(data, validation_mode=False, priority_filter=None):
    """Génère un fichier JSON de configuration pour After Effects.
    
    Args:
        data: Données analysées du CSV
        validation_mode (bool): Si True, ne génère que pour les 3 premières séquences
        priority_filter (str): Filtre de priorité pour nommer le fichier de sortie
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
        if plans:
            plan_range = {
                'min': min(p['shot_num'] for p in plans),
                'max': max(p['shot_num'] for p in plans)
            }
        else:
            plan_range = {'min': None, 'max': None}
        config['sequences'][sq_id] = {
            'name': seq_info['name'],
            'order': seq_info['order'],
            'plan_count': len(plans),
            'duration_seconds': sum(p['duration_seconds'] for p in plans),
            'duration_minutes': sum(p['duration_seconds'] for p in plans) / 60,
            'plan_range': plan_range,
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
    
    # Sauvegarder le fichier JSON avec nom spécifique selon le filtre
    if priority_filter:
        filename = f"after_effects_mapping_{priority_filter.upper()}.json"
    elif validation_mode:
        filename = "after_effects_mapping_validation.json"
    else:
        filename = "after_effects_mapping_gsheets.json"
    
    config_path = Path(__file__).parent.parent / "config" / filename
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
    import argparse
    parser = argparse.ArgumentParser(description="Analyse des données Google Sheets pour After Effects")
    parser.add_argument('--validation', action='store_true', 
                        help='Mode validation : traite uniquement les 3 premières séquences (SQ01, SQ02, SQ03)')
    parser.add_argument('--priority', type=str, default=None,
                        help='Filtrer sur la colonne PRIORITY (ex: 02)')
    parser.add_argument('--sequence', type=str, default=None,
                        help='Filtrer sur une séquence spécifique (ex: SQCR)')
    parser.add_argument('--regroup-cross', type=str, default=None,
                        help='Regroupe tous les plans CROSS avec la priorité donnée dans une séquence personnalisée. Format: <SEQ_ID>:<SEQ_NAME>')

    args = parser.parse_args()

    mode_text = " - MODE VALIDATION" if args.validation else ""
    print(f"🎬 ANALYSE GOOGLE SHEETS - AFTER EFFECTS SETUP{mode_text}")
    print("=" * 60)

    # Analyser les données
    data = analyze_google_sheets_data(args.validation)

    # Export complet des lignes brutes du CSV où 'P02' apparaît dans PRIORITY
    if data and 'all_plans' in data:
        export_full_p02_path = Path(__file__).parent.parent / "data" / "full_p02_lines.csv"
        with open(export_full_p02_path, 'w', encoding='utf-8') as f:
            # Écrire l'en-tête
            header = list(data['all_plans'][0].keys()) if data['all_plans'] else []
            f.write(','.join(header) + '\n')
            for p in data['all_plans']:
                prio_raw = str(p.get('PRIORITY', ''))
                if 'P02' in prio_raw or 'p02' in prio_raw:
                    row = [str(p.get(h, '')) for h in header]
                    f.write(','.join(row) + '\n')
        print(f"📄 Export complet des lignes 'P02' du CSV : {export_full_p02_path}")
    
    import argparse
    


    import argparse
    parser = argparse.ArgumentParser(description="Analyse des données Google Sheets pour After Effects")
    parser.add_argument('--validation', action='store_true', 
                        help='Mode validation : traite uniquement les 3 premières séquences (SQ01, SQ02, SQ03)')
    parser.add_argument('--priority', type=str, default=None,
                        help='Filtrer sur la colonne PRIORITY (ex: 02)')
    parser.add_argument('--sequence', type=str, default=None,
                        help='Filtrer sur une séquence spécifique (ex: SQCR)')
    parser.add_argument('--regroup-cross', type=str, default=None,
                        help='Regroupe tous les plans CROSS avec la priorité donnée dans une séquence personnalisée. Format: <SEQ_ID>:<SEQ_NAME>')

    args = parser.parse_args()

    mode_text = " - MODE VALIDATION" if args.validation else ""
    print(f"🎬 ANALYSE GOOGLE SHEETS - AFTER EFFECTS SETUP{mode_text}")
    print("=" * 60)

    # Analyser les données
    data = analyze_google_sheets_data(args.validation)

    if not data:
        print("❌ Échec de l'analyse des données")
        return

    # Filtrage priorité si demandé
    if args.priority:
        priority_value = args.priority.strip().lower()
        print(f"📌 Mode priorité activé - PRIORITY={priority_value}")

        # Filtrage dynamique selon la priorité demandée
        csv_path = Path(__file__).parent.parent / "data" / "RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv"
        priority_raw_plans = []
        unique_id_counter = 1
        priority_upper = priority_value.upper()
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                prio_raw = str(row.get('PRIORITY', ''))
                if priority_upper in prio_raw.upper():
                    plan = {
                        'shot_num': int(row.get('SHOTS', '-1')) if row.get('SHOTS', '').isdigit() else -1,
                        'shot_name': row.get('SHOT_NAME', '') or f"{priority_upper}_{unique_id_counter:03d}",
                        'sq_id': f'{priority_upper}_ALL',
                        'sq_name': f'{priority_upper}_ALL',
                        'status': row.get('STATUS', '').strip(),
                        'comp_name': row.get('COMP_NAME', '').strip(),
                        'attribution': row.get('ATTRIBUTION', '').strip(),
                        'version': row.get('VERSION', '').strip(),
                        'duration_seconds': parse_timecode_to_seconds(row.get('EDIT_DUR', '')),
                        'duration_timecode': row.get('EDIT_DUR', ''),
                        'edit_tc_in': row.get('EDIT_TC-IN', ''),
                        'edit_tc_out': row.get('EDIT_TC-OUT', ''),
                        'has_frame_io': bool(row.get('FRAME_IO_LINK', '')),
                        'prod_approval': row.get('PROD_APPROVAL', '') == 'TRUE',
                        'director_approval': row.get('DIRECTOR_APPROVAL', '') == 'TRUE',
                        'updated': row.get('UPDATED', ''),
                        'PRIORITY': prio_raw,
                        'unique_id': f"{priority_upper}_{unique_id_counter:03d}"
                    }
                    unique_id_counter += 1
                    priority_raw_plans.append(plan)

        print(f"✅ Plans '{priority_upper}' inclus dans le mapping : {len(priority_raw_plans)}")
        
        # Regrouper tous les plans dans une seule séquence
        filtered_sequences = {
            f'{priority_upper}_ALL': {
                'id': f'{priority_upper}_ALL',
                'name': f'{priority_upper}_ALL',
                'order': 1
            }
        }
        filtered_plans_by_sequence = {f'{priority_upper}_ALL': priority_raw_plans}
        filtered_status_stats = defaultdict(int)
        for plan in priority_raw_plans:
            filtered_status_stats[plan['status']] += 1
        filtered_data = {
            'sequences': filtered_sequences,
            'plans_by_sequence': filtered_plans_by_sequence,
            'all_plans': priority_raw_plans,
            'status_stats': dict(filtered_status_stats)
        }
        generate_detailed_report(filtered_data, validation_mode=False)
        config_path = generate_after_effects_config(filtered_data, validation_mode=False, priority_filter=args.priority)
        generate_production_preview(filtered_data)
    else:
        # Générer les rapports
        generate_detailed_report(data, args.validation)
        config_path = generate_after_effects_config(data, args.validation, priority_filter=None)

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

    print(f"\n✅ **ANALYSE TERMINÉE**")
    print(f"   📄 Configuration : {config_path}")
    print(f"   🎯 Prêt pour génération After Effects")

    # Suggestions pour la suite
    print(f"\n🚀 **PROCHAINES ÉTAPES**")
    print(f"   1. Valider le mapping des séquences")
    print(f"   2. Mettre à jour le générateur AE")
    print(f"   3. Tester sur {list(data['sequences'].keys())[0]}")
    print(f"   4. Déployer toutes les séquences")

if __name__ == "__main__":
    main()
