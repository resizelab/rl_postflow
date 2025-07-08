#!/usr/bin/env python3
"""
Configuration Interactive pour Tests Réels Frame.io
Configure l'intégration pour les tests avec l'API réelle
"""

import json
import os
import sys
from pathlib import Path
import getpass

def print_banner():
    """Affiche la bannière"""
    print("=" * 60)
    print("🎬 CONFIGURATION FRAME.IO - TESTS RÉELS")
    print("=" * 60)
    print("Configuration interactive pour tester avec l'API Frame.io réelle")
    print("=" * 60)

def get_input(prompt, default=None, required=True, hidden=False):
    """Récupère une entrée utilisateur avec validation"""
    while True:
        if hidden:
            value = getpass.getpass(f"{prompt}: ")
        else:
            if default:
                value = input(f"{prompt} [{default}]: ").strip()
                if not value:
                    value = default
            else:
                value = input(f"{prompt}: ").strip()
        
        if value or not required:
            return value
        print("❌ Cette valeur est requise")

def load_existing_config():
    """Charge la configuration existante si elle existe"""
    config_path = Path("config/frameio_integration.json")
    if config_path.exists():
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except:
            pass
    
    # Charger l'exemple comme base
    example_path = Path("config/frameio_integration.json.example")
    if example_path.exists():
        with open(example_path, 'r') as f:
            return json.load(f)
    
    return {}

def configure_frameio(config):
    """Configure les paramètres Frame.io"""
    print("\n🎬 CONFIGURATION FRAME.IO")
    print("-" * 40)
    
    frameio = config.get('frameio', {})
    
    print("ℹ️  Vous pouvez trouver ces informations dans votre compte Frame.io:")
    print("   - Account ID: Settings > Account > Account ID")
    print("   - Workspace ID: Dans l'URL de votre workspace")
    print("   - Project ID: Dans l'URL de votre projet")
    print("   - OAuth: Applications > Votre app > Credentials")
    
    frameio['account_id'] = get_input(
        "Account ID Frame.io",
        frameio.get('account_id'),
        required=True
    )
    
    frameio['workspace_id'] = get_input(
        "Workspace ID Frame.io",
        frameio.get('workspace_id'),
        required=True
    )
    
    frameio['project_id'] = get_input(
        "Project ID Frame.io",
        frameio.get('project_id'),
        required=True
    )
    
    # OAuth configuration
    oauth = frameio.get('oauth', {})
    print("\n🔐 Configuration OAuth:")
    
    oauth['client_id'] = get_input(
        "Client ID OAuth",
        oauth.get('client_id'),
        required=True
    )
    
    oauth['client_secret'] = get_input(
        "Client Secret OAuth",
        oauth.get('client_secret'),
        required=True,
        hidden=True
    )
    
    oauth['jwt_key'] = get_input(
        "JWT Key (optionnel)",
        oauth.get('jwt_key'),
        required=False,
        hidden=True
    )
    
    frameio['oauth'] = oauth
    config['frameio'] = frameio
    
    return config

def configure_discord(config):
    """Configure les paramètres Discord"""
    print("\n🔔 CONFIGURATION DISCORD")
    print("-" * 40)
    
    discord = config.get('discord', {})
    
    print("ℹ️  Pour créer un webhook Discord:")
    print("   1. Allez dans votre serveur Discord")
    print("   2. Paramètres du canal > Intégrations > Webhooks")
    print("   3. Créer un webhook et copiez l'URL")
    
    webhook_url = get_input(
        "URL du webhook Discord",
        discord.get('webhook_url'),
        required=False
    )
    
    if webhook_url:
        discord['webhook_url'] = webhook_url
        discord['enable_notifications'] = True
        
        bot_name = get_input(
            "Nom du bot Discord",
            discord.get('bot_name', 'RL PostFlow Bot'),
            required=False
        )
        discord['bot_name'] = bot_name
    else:
        discord['enable_notifications'] = False
        print("⚠️  Notifications Discord désactivées")
    
    config['discord'] = discord
    
    return config

def configure_lucidlink(config):
    """Configure les paramètres LucidLink"""
    print("\n📁 CONFIGURATION LUCIDLINK")
    print("-" * 40)
    
    lucidlink = config.get('lucidlink', {})
    
    by_shot_path = get_input(
        "Chemin vers le dossier BY_SHOT",
        lucidlink.get('by_shot_path', '/path/to/lucidlink/BY_SHOT'),
        required=True
    )
    
    # Vérifier que le chemin existe
    if not Path(by_shot_path).exists():
        print(f"⚠️  Le chemin {by_shot_path} n'existe pas")
        create_test_dir = input("Créer un dossier de test pour les démos ? (y/n): ").lower() == 'y'
        if create_test_dir:
            test_dir = Path("temp/test_by_shot")
            test_dir.mkdir(parents=True, exist_ok=True)
            by_shot_path = str(test_dir.absolute())
            print(f"✅ Dossier de test créé: {by_shot_path}")
    
    lucidlink['by_shot_path'] = by_shot_path
    
    # Configuration avancée
    print("\n⚙️  Configuration avancée (optionnel):")
    
    scan_interval = get_input(
        "Intervalle de scan (secondes)",
        str(lucidlink.get('scan_interval', 5)),
        required=False
    )
    
    if scan_interval:
        lucidlink['scan_interval'] = int(scan_interval)
    
    config['lucidlink'] = lucidlink
    
    return config

def test_configuration(config):
    """Teste la configuration"""
    print("\n🧪 TEST DE CONFIGURATION")
    print("-" * 40)
    
    # Test Frame.io
    print("🎬 Test Frame.io...")
    try:
        frameio = config.get('frameio', {})
        if frameio.get('account_id') and frameio.get('workspace_id'):
            print("  ✅ Configuration Frame.io semble correcte")
        else:
            print("  ❌ Configuration Frame.io incomplète")
    except Exception as e:
        print(f"  ❌ Erreur Frame.io: {e}")
    
    # Test Discord
    print("🔔 Test Discord...")
    try:
        discord = config.get('discord', {})
        if discord.get('webhook_url'):
            print("  ✅ URL webhook Discord configurée")
        else:
            print("  ⚠️  Webhook Discord non configuré")
    except Exception as e:
        print(f"  ❌ Erreur Discord: {e}")
    
    # Test LucidLink
    print("📁 Test LucidLink...")
    try:
        lucidlink = config.get('lucidlink', {})
        by_shot_path = lucidlink.get('by_shot_path')
        if by_shot_path and Path(by_shot_path).exists():
            print(f"  ✅ Chemin BY_SHOT accessible: {by_shot_path}")
        else:
            print(f"  ❌ Chemin BY_SHOT inaccessible: {by_shot_path}")
    except Exception as e:
        print(f"  ❌ Erreur LucidLink: {e}")

def save_config(config):
    """Sauvegarde la configuration"""
    config_path = Path("config/frameio_integration.json")
    config_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Configuration sauvegardée: {config_path}")

def setup_environment_variables(config):
    """Configure les variables d'environnement"""
    print("\n🌍 VARIABLES D'ENVIRONNEMENT")
    print("-" * 40)
    
    env_vars = []
    
    # Frame.io
    frameio = config.get('frameio', {})
    oauth = frameio.get('oauth', {})
    
    if oauth.get('client_id'):
        env_vars.append(f"export FRAMEIO_CLIENT_ID='{oauth['client_id']}'")
    if oauth.get('client_secret'):
        env_vars.append(f"export FRAMEIO_CLIENT_SECRET='{oauth['client_secret']}'")
    if frameio.get('account_id'):
        env_vars.append(f"export FRAMEIO_ACCOUNT_ID='{frameio['account_id']}'")
    if frameio.get('workspace_id'):
        env_vars.append(f"export FRAMEIO_WORKSPACE_ID='{frameio['workspace_id']}'")
    if frameio.get('project_id'):
        env_vars.append(f"export FRAMEIO_PROJECT_ID='{frameio['project_id']}'")
    
    # Discord
    discord = config.get('discord', {})
    if discord.get('webhook_url'):
        env_vars.append(f"export DISCORD_WEBHOOK_URL='{discord['webhook_url']}'")
    
    if env_vars:
        env_file = Path("config/frameio_env.sh")
        with open(env_file, 'w') as f:
            f.write("#!/bin/bash\n")
            f.write("# Variables d'environnement Frame.io\n")
            f.write("# Source ce fichier avec: source config/frameio_env.sh\n\n")
            for var in env_vars:
                f.write(var + "\n")
        
        print(f"✅ Variables d'environnement sauvegardées: {env_file}")
        print(f"💡 Pour les charger: source {env_file}")
    
    return env_vars

def main():
    """Fonction principale"""
    print_banner()
    
    # Charger la configuration existante
    config = load_existing_config()
    
    # Configuration interactive
    config = configure_frameio(config)
    config = configure_discord(config)
    config = configure_lucidlink(config)
    
    # Tester la configuration
    test_configuration(config)
    
    # Sauvegarder
    save_config(config)
    
    # Variables d'environnement
    env_vars = setup_environment_variables(config)
    
    # Instructions finales
    print("\n🎯 PROCHAINES ÉTAPES")
    print("-" * 40)
    print("1. Charger les variables d'environnement:")
    print("   source config/frameio_env.sh")
    print("\n2. Tester la connectivité:")
    print("   ./scripts/frameio-cli.sh interactive")
    print("   # Choisir option 6: Tester la Connectivité API")
    print("\n3. Tester avec un fichier réel:")
    print("   ./scripts/frameio-cli.sh demo")
    print("\n4. Lancer les tests complets:")
    print("   python -m pytest tests/test_frameio_integration.py -v")
    
    print("\n🎉 Configuration terminée !")

if __name__ == "__main__":
    main()
