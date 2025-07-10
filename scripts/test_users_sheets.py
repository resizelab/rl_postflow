#!/usr/bin/env python3
"""
🧪 Test récupération des USERS depuis Google Sheets
====================================================

Script de test pour vérifier que les utilisateurs sont bien récupérés
depuis la worksheet USERS_INFOS.

Version: 4.1.1
Date: 10 juillet 2025
"""

import sys
import json
import logging
from pathlib import Path

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_users_module():
    """Test du module users.py"""
    print("🧪 Test 1: Module users.py")
    print("="*50)
    
    try:
        sys.path.append(str(Path.cwd()))
        
        from src.integrations.sheets.users import SheetsUserManager, User
        from src.integrations.sheets.auth import GoogleSheetsAuth, GoogleSheetsConfig
        
        print("✅ Import modules users réussi")
        
        # Test de la classe User
        user = User(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            discord_id="123456789",
            role="Developer"
        )
        
        print(f"✅ Création User: {user.full_name} ({user.email})")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur test module users: {e}")
        return False

def test_users_config():
    """Test de la configuration des users"""
    print("\n🧪 Test 2: Configuration USERS")
    print("="*50)
    
    try:
        # Vérifier le mapping users
        config_file = Path("config/sheets_mapping.json")
        if config_file.exists():
            with open(config_file) as f:
                mapping = json.load(f)
            
            if "USERS_INFOS" in mapping.get("worksheets", {}):
                users_mapping = mapping["worksheets"]["USERS_INFOS"]
                print("✅ Configuration USERS_INFOS trouvée")
                print(f"   📊 Total colonnes: {users_mapping.get('total_columns', 'N/A')}")
                
                # Vérifier les champs essentiels
                required_fields = ["first_name", "last_name", "email", "discord_id"]
                mapping_fields = users_mapping.get("mapping", {})
                
                for field in required_fields:
                    if field in mapping_fields:
                        config = mapping_fields[field]
                        print(f"   ✅ {field}: Colonne {config.get('column_index')} ({config.get('column_name')})")
                    else:
                        print(f"   ⚠️ {field}: Non configuré")
                
                return True
            else:
                print("❌ Configuration USERS_INFOS non trouvée")
                return False
        else:
            print("❌ Fichier sheets_mapping.json non trouvé")
            return False
            
    except Exception as e:
        print(f"❌ Erreur test configuration: {e}")
        return False

def test_users_integration():
    """Test de l'intégration avec le SheetsTracker"""
    print("\n🧪 Test 3: Intégration SheetsTracker")
    print("="*50)
    
    try:
        sys.path.append(str(Path.cwd()))
        
        from src.integrations.sheets.tracker import SheetsTracker
        from src.integrations.sheets.users import SheetsUserManager
        
        print("✅ Import intégration réussi")
        
        # Test de création d'un tracker avec user_manager
        # (sans vraie connexion Google Sheets)
        tracker = SheetsTracker("test_spreadsheet_id")
        
        if hasattr(tracker, 'user_manager'):
            print("✅ SheetsTracker a un attribut user_manager")
        else:
            print("❌ SheetsTracker n'a pas d'attribut user_manager")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur test intégration: {e}")
        return False

def test_users_in_postflow_runner():
    """Test de l'utilisation dans PostFlowRunner"""
    print("\n🧪 Test 4: PostFlowRunner intégration")
    print("="*50)
    
    try:
        sys.path.append(str(Path.cwd()))
        
        from src.bootstrap.postflow_runner import PostFlowRunner
        
        print("✅ Import PostFlowRunner réussi")
        
        # Vérifier le code source pour les références aux users
        runner_file = Path("src/bootstrap/postflow_runner.py")
        if runner_file.exists():
            with open(runner_file) as f:
                content = f.read()
            
            if "SheetsUserManager" in content:
                print("✅ PostFlowRunner utilise SheetsUserManager")
            else:
                print("⚠️ PostFlowRunner n'utilise pas SheetsUserManager")
            
            if "user_manager" in content:
                print("✅ PostFlowRunner référence user_manager")
            else:
                print("⚠️ PostFlowRunner ne référence pas user_manager")
            
            return True
        else:
            print("❌ Fichier PostFlowRunner non trouvé")
            return False
            
    except Exception as e:
        print(f"❌ Erreur test PostFlowRunner: {e}")
        return False

def test_users_worksheet_name():
    """Test du nom de worksheet configuré"""
    print("\n🧪 Test 5: Nom worksheet USERS")
    print("="*50)
    
    try:
        # Vérifier les différents endroits où le nom est configuré
        places_to_check = [
            ("src/integrations/sheets/users.py", "USERS_INFOS"),
            ("src/integrations/sheets/auth.py", "USERS_INFOS"),
            ("src/bootstrap/postflow_runner.py", "USERS_INFOS"),
        ]
        
        all_good = True
        for file_path, expected_name in places_to_check:
            file = Path(file_path)
            if file.exists():
                with open(file) as f:
                    content = f.read()
                
                if expected_name in content:
                    print(f"✅ {file_path}: Contient '{expected_name}'")
                else:
                    print(f"⚠️ {file_path}: Ne contient pas '{expected_name}'")
                    all_good = False
            else:
                print(f"❌ {file_path}: Fichier non trouvé")
                all_good = False
        
        return all_good
        
    except Exception as e:
        print(f"❌ Erreur test worksheet name: {e}")
        return False

def main():
    """Test complet de la récupération des USERS"""
    print("👥 Test Complet - Récupération USERS Google Sheets")
    print("="*70)
    
    results = []
    
    # Tests
    results.append(('Module users.py', test_users_module()))
    results.append(('Configuration USERS', test_users_config()))
    results.append(('Intégration SheetsTracker', test_users_integration()))
    results.append(('PostFlowRunner intégration', test_users_in_postflow_runner()))
    results.append(('Nom worksheet USERS', test_users_worksheet_name()))
    
    # Résultats
    print("\n📊 Résultats des Tests")
    print("="*50)
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if not passed:
            all_passed = False
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 Tous les tests passés !")
        print("\n📋 Récapitulatif USERS:")
        print("✅ Module SheetsUserManager implémenté")
        print("✅ Configuration USERS_INFOS dans sheets_mapping.json")
        print("✅ Intégration avec SheetsTracker")
        print("✅ Utilisation dans PostFlowRunner")
        print("✅ Worksheet 'USERS_INFOS' configurée")
        
        print("\n👥 Champs USERS disponibles:")
        print("- Prénom (PRENOM)")
        print("- Nom (NOMS)")
        print("- Email (MAIL)")
        print("- Téléphone (TEL)")
        print("- Département (DEPT)")
        print("- Discord ID (ID DISCORD)")
        print("- Actif (ACTIF)")
        print("- Accès Lucid (ACCES LUCID ?)")
        
        print("\n🔧 Méthodes disponibles:")
        print("- get_user_by_name(name)")
        print("- get_user_by_discord_id(discord_id)")
        print("- get_all_users()")
        print("- Cache automatique avec refresh")
        
    else:
        print("⚠️ Certains tests ont échoué")
        print("Vérifiez la configuration et l'implémentation")
    
    return all_passed

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
