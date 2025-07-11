#!/usr/bin/env python3
"""
Script d'Analyse des Séquences et Plans After Effects
Analyse shots.csv pour extraire le mapping séquences et plans
"""

import csv
import json
from collections import defaultdict, OrderedDict
from pathlib import Path
import sys
import os

# Ajouter src au path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

def analyze_shots_data():
    """Analyse le fichier shots.csv pour extraire les séquences et plans."""
    
    print("🔍 Analyse des données shots.csv...")
    print("=" * 50)
    
    # Chemin vers le fichier CSV
    csv_path = Path(__file__).parent.parent / "data" / "RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv"
    
    if not csv_path.exists():
        print(f"❌ Fichier RL_O2B_UNDLM_SUIVI_ANIM - SHOTS_TRACK.csv non trouvé : {csv_path}")
        return None
        
    # Structures de données
    sequences = OrderedDict()
    plans_by_sequence = defaultdict(list)
    all_plans = []
    sequence_counter = 1
    
    print(f"📄 Lecture du fichier : {csv_path}")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                plan_num = row['PLAN']
                sequence_name = row['SEQUENCE'].strip()
                nomenclature = row['NOMENCLATURE PLAN'].strip()
                
                # Ignorer les lignes vides
                if not plan_num or not sequence_name:
                    continue
                
                # Ajouter nouvelle séquence si nécessaire
                if sequence_name not in sequences:
                    seq_id = f"SQ{sequence_counter:02d}"
                    sequences[sequence_name] = {
                        'id': seq_id,
                        'name': sequence_name,
                        'order': sequence_counter
                    }
                    sequence_counter += 1
                
                # Ajouter plan à la séquence
                plan_info = {
                    'plan_num': int(plan_num),
                    'nomenclature': nomenclature,
                    'sequence_name': sequence_name,
                    'sequence_id': sequences[sequence_name]['id']
                }
                
                plans_by_sequence[sequence_name].append(plan_info)
                all_plans.append(plan_info)
                
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du CSV : {e}")
        return None
    
    # Trier les plans par numéro
    for seq_name in plans_by_sequence:
        plans_by_sequence[seq_name].sort(key=lambda x: x['plan_num'])
    
    all_plans.sort(key=lambda x: x['plan_num'])
    
    return {
        'sequences': sequences,
        'plans_by_sequence': dict(plans_by_sequence),
        'all_plans': all_plans
    }

def generate_mapping_report(data):
    """Génère un rapport de mapping des séquences et plans."""
    
    if not data:
        return
        
    sequences = data['sequences']
    plans_by_sequence = data['plans_by_sequence']
    all_plans = data['all_plans']
    
    print("\\n📊 RAPPORT D'ANALYSE")
    print("=" * 50)
    
    # Statistiques générales
    print(f"📈 **Statistiques Générales**")
    print(f"   • Total séquences : {len(sequences)}")
    print(f"   • Total plans : {len(all_plans)}")
    print(f"   • Plans min : {min(p['plan_num'] for p in all_plans)}")
    print(f"   • Plans max : {max(p['plan_num'] for p in all_plans)}")
    
    # Mapping séquences
    print(f"\\n🎬 **Mapping Séquences**")
    for seq_name, seq_info in sequences.items():
        plan_count = len(plans_by_sequence[seq_name])
        plans_range = plans_by_sequence[seq_name]
        min_plan = min(p['plan_num'] for p in plans_range)
        max_plan = max(p['plan_num'] for p in plans_range)
        
        print(f"   {seq_info['id']} : {seq_name}")
        print(f"      └─ {plan_count} plans (#{min_plan} à #{max_plan})")
    
    # Détail par séquence
    print(f"\\n📋 **Détail par Séquence**")
    for seq_name, seq_info in sequences.items():
        plans = plans_by_sequence[seq_name]
        print(f"\\n🎯 {seq_info['id']} - {seq_name}")
        print(f"   Plans : {len(plans)}")
        
        # Afficher premiers et derniers plans
        if len(plans) <= 10:
            for plan in plans:
                print(f"      • Plan {plan['plan_num']:03d} → {plan['nomenclature']}")
        else:
            # Afficher les 5 premiers
            for plan in plans[:5]:
                print(f"      • Plan {plan['plan_num']:03d} → {plan['nomenclature']}")
            print(f"      ... ({len(plans) - 10} plans intermédiaires)")
            # Afficher les 5 derniers
            for plan in plans[-5:]:
                print(f"      • Plan {plan['plan_num']:03d} → {plan['nomenclature']}")

def generate_json_config(data):
    """Génère un fichier JSON de configuration pour le déploiement."""
    
    if not data:
        return
        
    config = {
        'metadata': {
            'total_sequences': len(data['sequences']),
            'total_plans': len(data['all_plans']),
            'generated_at': '2025-07-10'
        },
        'sequences': {},
        'plans': {}
    }
    
    # Configuration des séquences
    for seq_name, seq_info in data['sequences'].items():
        plans = data['plans_by_sequence'][seq_name]
        config['sequences'][seq_info['id']] = {
            'name': seq_name,
            'order': seq_info['order'],
            'plan_count': len(plans),
            'plan_range': {
                'min': min(p['plan_num'] for p in plans),
                'max': max(p['plan_num'] for p in plans)
            },
            'plans': [p['plan_num'] for p in plans]
        }
    
    # Configuration des plans
    for plan in data['all_plans']:
        config['plans'][f"UNDLM_{plan['plan_num']:05d}"] = {
            'plan_num': plan['plan_num'],
            'sequence_id': plan['sequence_id'],
            'sequence_name': plan['sequence_name'],
            'nomenclature': plan['nomenclature']
        }
    
    # Sauvegarder le fichier JSON
    config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping_gsheets.json"
    config_path.parent.mkdir(exist_ok=True)
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"\\n💾 Configuration sauvegardée : {config_path}")
    return config_path

def generate_deployment_preview(data):
    """Génère un aperçu de la structure qui sera déployée."""
    
    if not data:
        return
        
    print(f"\\n🏗️ **APERÇU DÉPLOIEMENT**")
    print("=" * 50)
    
    sequences = data['sequences']
    plans_by_sequence = data['plans_by_sequence']
    
    total_folders = 0
    total_files = 0
    
    print("📁 Structure qui sera créée :")
    print("SEQUENCES/")
    
    for seq_name, seq_info in sequences.items():
        plans = plans_by_sequence[seq_name]
        print(f"├── {seq_info['id']}/")
        print(f"│   ├── _AE/")
        print(f"│   │   └── {seq_info['id']}_01.aep")
        print(f"│   ├── _EB/")
        
        total_folders += 3  # SQxx, _AE, _EB
        total_files += 1   # .aep
        
        # Afficher quelques plans
        displayed_plans = 0
        for plan in plans:
            if displayed_plans < 3:
                plan_folder = f"UNDLM_{plan['plan_num']:05d}"
                print(f"│   │   ├── {plan_folder}/")
                print(f"│   │   │   ├── 1_VIDEO-REF/")
                print(f"│   │   │   ├── 2_KEY/ (4 sous-dossiers)")
                print(f"│   │   │   ├── 3_OUT/ (4 sous-dossiers)")
                print(f"│   │   │   └── EB_{plan_folder}.psd")
                total_folders += 11  # Plan + 1_VIDEO-REF + 2_KEY + 3_OUT + 8 sous-dossiers
                total_files += 1     # .psd
                displayed_plans += 1
            elif displayed_plans == 3 and len(plans) > 3:
                remaining = len(plans) - 3
                print(f"│   │   └── ... ({remaining} autres plans)")
                total_folders += remaining * 11
                total_files += remaining
                break
        
        print(f"│   └── _PS/")
        total_folders += 1  # _PS
    
    print(f"\\n📊 **Résumé Déploiement**")
    print(f"   • Séquences à créer : {len(sequences)}")
    print(f"   • Plans à déployer : {len(data['all_plans'])}")
    print(f"   • Dossiers estimés : ~{total_folders}")
    print(f"   • Fichiers estimés : ~{total_files}")

def main():
    """Fonction principale."""
    
    print("🎬 ANALYSE AFTER EFFECTS DEPLOYMENT")
    print("=" * 50)
    
    # Analyser les données
    data = analyze_shots_data()
    
    if not data:
        print("❌ Échec de l'analyse des données")
        return
    
    # Générer les rapports
    generate_mapping_report(data)
    config_path = generate_json_config(data)
    generate_deployment_preview(data)
    
    print(f"\\n✅ **ANALYSE TERMINÉE**")
    print(f"   📄 Configuration : {config_path}")
    print(f"   🎯 Prêt pour le déploiement")
    
    # Suggestions pour la suite
    print(f"\\n🚀 **PROCHAINES ÉTAPES**")
    print(f"   1. Valider le mapping des séquences")
    print(f"   2. Créer le script de déploiement")
    print(f"   3. Tester sur SQ01")
    print(f"   4. Déployer toutes les séquences")

if __name__ == "__main__":
    main()
