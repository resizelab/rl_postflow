#!/usr/bin/env python3
"""
Script de Test Déploiement After Effects
Test le déploiement sur SQ01 seulement pour validation
"""

import os
import sys
import shutil
import tempfile
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def test_ae_deployment():
    """Test du déploiement AE sur un dossier temporaire."""
    
    print("🧪 TEST DÉPLOIEMENT AFTER EFFECTS")
    print("=" * 50)
    
    # Chemins réels
    template_source = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/_TEMPLATES/SQXX")
    real_sequences = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
    
    # Vérifier existence des chemins
    print("🔍 Vérification des chemins...")
    if not template_source.exists():
        print(f"❌ Template source introuvable : {template_source}")
        return False
        
    if not real_sequences.exists():
        print(f"❌ Dossier sequences introuvable : {real_sequences}")
        return False
    
    print("✅ Chemins validés")
    
    # Analyser la structure template
    print("\\n📁 Analyse structure template...")
    
    ae_folder = template_source / "_AE"
    eb_folder = template_source / "_EB"
    ps_folder = template_source / "_PS"
    
    print(f"   _AE : {'✅' if ae_folder.exists() else '❌'}")
    print(f"   _EB : {'✅' if eb_folder.exists() else '❌'}")
    print(f"   _PS : {'✅' if ps_folder.exists() else '❌'}")
    
    # Analyser le template plan
    plan_template = eb_folder / "UNDLM_00XXX"
    if plan_template.exists():
        print(f"   Plan template : ✅")
        
        # Lister les sous-dossiers
        subdirs = [d.name for d in plan_template.iterdir() if d.is_dir()]
        files = [f.name for f in plan_template.iterdir() if f.is_file()]
        
        print(f"      Sous-dossiers : {subdirs}")
        print(f"      Fichiers : {files}")
        
        # Analyser 2_KEY et 3_OUT
        key_folder = plan_template / "2_KEY"
        out_folder = plan_template / "3_OUT"
        
        if key_folder.exists():
            key_subdirs = [d.name for d in key_folder.iterdir() if d.is_dir()]
            print(f"      2_KEY sous-dossiers : {key_subdirs}")
            
        if out_folder.exists():
            out_subdirs = [d.name for d in out_folder.iterdir() if d.is_dir()]
            print(f"      3_OUT sous-dossiers : {out_subdirs}")
    else:
        print(f"   Plan template : ❌")
        return False
    
    # Test de renommage
    print("\\n🔧 Test des patterns de renommage...")
    
    test_patterns = [
        ("SQXX", "SQ01"),
        ("SQXX_01.aep", "SQ01_01.aep"),
        ("UNDLM_00XXX", "UNDLM_00001"),
        ("EB_UNDLM_00XXX.psd", "EB_UNDLM_00001.psd")
    ]
    
    for original, expected in test_patterns:
        result = original.replace("SQXX", "SQ01").replace("00XXX", "00001").replace("XXX", "001")
        status = "✅" if result == expected else "❌"
        print(f"   {original} → {result} {status}")
    
    # Simuler la création d'une séquence
    print("\\n🎬 Simulation création SQ01...")
    
    # Charger la config
    config_path = Path(__file__).parent.parent / "config" / "after_effects_mapping.json"
    if not config_path.exists():
        print(f"❌ Config non trouvée : {config_path}")
        return False
    
    import json
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    sq01_info = config['sequences'].get('SQ01')
    if not sq01_info:
        print("❌ SQ01 non trouvée dans la config")
        return False
    
    print(f"   Nom : {sq01_info['name']}")
    print(f"   Plans : {sq01_info['plan_count']}")
    print(f"   Range : {sq01_info['plan_range']['min']}-{sq01_info['plan_range']['max']}")
    print(f"   Plans spécifiques : {sq01_info['plans'][:5]}...")
    
    # Estimer la taille
    print("\\n📊 Estimation taille déploiement...")
    
    def get_dir_size(path):
        """Calcule la taille d'un dossier."""
        total = 0
        try:
            for entry in path.rglob('*'):
                if entry.is_file():
                    total += entry.stat().st_size
        except:
            pass
        return total
    
    template_size = get_dir_size(template_source)
    print(f"   Taille template : {template_size / 1024 / 1024:.1f} MB")
    
    # Estimation pour toutes les séquences
    total_sequences = len(config['sequences'])
    total_plans = config['metadata']['total_plans']
    estimated_size = (template_size * total_sequences) + (template_size * 0.1 * total_plans)
    
    print(f"   Estimation totale : {estimated_size / 1024 / 1024 / 1024:.1f} GB")
    print(f"   Séquences : {total_sequences}")
    print(f"   Plans : {total_plans}")
    
    # Test création dans dossier temporaire
    print("\\n🧪 Test création dans dossier temporaire...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        test_seq_dir = temp_path / "SQ01"
        
        print(f"   Dossier test : {test_seq_dir}")
        
        # Créer structure SQ01
        test_seq_dir.mkdir()
        
        # _AE
        ae_dest = test_seq_dir / "_AE"
        shutil.copytree(ae_folder, ae_dest)
        
        # Renommer fichier AE
        old_ae_file = ae_dest / "SQXX_01.aep"
        new_ae_file = ae_dest / "SQ01_01.aep"
        if old_ae_file.exists():
            old_ae_file.rename(new_ae_file)
            print(f"      ✅ Renommé : {old_ae_file.name} → {new_ae_file.name}")
        
        # _EB avec quelques plans de test
        eb_dest = test_seq_dir / "_EB"
        eb_dest.mkdir()
        
        test_plans = sq01_info['plans'][:3]  # 3 premiers plans
        for plan_num in test_plans:
            plan_name = f"UNDLM_{plan_num:05d}"
            plan_dest = eb_dest / plan_name
            
            # Copier template plan
            shutil.copytree(plan_template, plan_dest)
            
            # Renommer fichier PSD
            old_psd = plan_dest / "EB_UNDLM_00XXX.psd"
            new_psd = plan_dest / f"EB_{plan_name}.psd"
            if old_psd.exists():
                old_psd.rename(new_psd)
            
            print(f"      ✅ Plan créé : {plan_name}")
        
        # _PS
        ps_dest = test_seq_dir / "_PS"
        ps_dest.mkdir()
        
        # Vérifier structure créée
        print(f"\\n🔍 Vérification structure test...")
        
        def check_path(path, name):
            exists = path.exists()
            print(f"      {name} : {'✅' if exists else '❌'}")
            return exists
        
        all_good = True
        all_good &= check_path(test_seq_dir, "SQ01/")
        all_good &= check_path(ae_dest, "_AE/")
        all_good &= check_path(new_ae_file, "SQ01_01.aep")
        all_good &= check_path(eb_dest, "_EB/")
        all_good &= check_path(ps_dest, "_PS/")
        
        for plan_num in test_plans:
            plan_name = f"UNDLM_{plan_num:05d}"
            plan_path = eb_dest / plan_name
            psd_path = plan_path / f"EB_{plan_name}.psd"
            all_good &= check_path(plan_path, f"{plan_name}/")
            all_good &= check_path(psd_path, f"EB_{plan_name}.psd")
        
        print(f"\\n{'✅ TEST RÉUSSI' if all_good else '❌ TEST ÉCHOUÉ'}")
        
        # Afficher la taille créée
        test_size = get_dir_size(test_seq_dir)
        print(f"   Taille test SQ01 : {test_size / 1024 / 1024:.1f} MB")
        
    return all_good

def test_real_deployment():
    """Test déploiement réel sur SQ01."""
    
    print("\\n🚀 TEST DÉPLOIEMENT RÉEL SQ01")
    print("=" * 30)
    
    try:
        from deploy_ae_templates import AfterEffectsDeployer
        
        deployer = AfterEffectsDeployer()
        
        # Test sur SQ01 seulement
        success = deployer.run(sequence_id="SQ01", test_mode=True)
        
        if success:
            print("✅ Déploiement SQ01 réussi")
            
            # Vérifier rapidement
            sequences_dir = Path("/Volumes/resizelab/o2b-undllm/3_PROJECTS/2_ANIM/SEQUENCES")
            sq01_dir = sequences_dir / "SQ01"
            
            if sq01_dir.exists():
                print(f"✅ Dossier SQ01 créé")
                
                ae_file = sq01_dir / "_AE" / "SQ01_01.aep"
                print(f"   AE file : {'✅' if ae_file.exists() else '❌'}")
                
                eb_dir = sq01_dir / "_EB"
                plan_count = len([d for d in eb_dir.iterdir() if d.is_dir()]) if eb_dir.exists() else 0
                print(f"   Plans EB : {plan_count}")
                
            return True
        else:
            print("❌ Déploiement SQ01 échoué")
            return False
            
    except Exception as e:
        print(f"❌ Erreur test réel : {e}")
        return False

def main():
    """Fonction principale de test."""
    
    print("🧪 TESTS BEFORE DEPLOYMENT")
    print("=" * 50)
    
    # Test 1 : Simulation
    test1_ok = test_ae_deployment()
    
    if test1_ok:
        print("\\n✅ Tests de simulation réussis")
        
        # Demander confirmation pour test réel
        response = input("\\n❓ Lancer le test réel sur SQ01 ? (y/n) : ").strip().lower()
        
        if response == 'y':
            test2_ok = test_real_deployment()
            
            if test2_ok:
                print("\\n🎉 TOUS LES TESTS RÉUSSIS")
                print("✅ Prêt pour déploiement complet")
                
                response = input("\\n❓ Lancer le déploiement complet ? (y/n) : ").strip().lower()
                if response == 'y':
                    print("🚀 Lancement déploiement complet...")
                    os.system("python scripts/deploy_ae_templates.py --all")
                else:
                    print("ℹ️  Déploiement complet annulé")
            else:
                print("\\n❌ Test réel échoué - Vérifier les erreurs")
        else:
            print("ℹ️  Test réel annulé")
    else:
        print("\\n❌ Tests de simulation échoués - Corriger les problèmes")

if __name__ == "__main__":
    main()
